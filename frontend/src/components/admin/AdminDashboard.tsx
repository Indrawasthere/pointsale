import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Table2,
  TrendingUp,
  Plus,
  Settings,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader,
} from "lucide-react";
import apiClient from "@/api/client";

// Types for real data
interface DashboardStats {
  today_orders: number;
  today_revenue: number;
  active_orders: number;
  occupied_tables: number;
}

interface SalesData {
  date?: string;
  hour?: string;
  order_count: number;
  revenue: number;
}

interface IncomeData {
  period: string;
  orders: number;
  gross: number;
  tax: number;
  net: number;
}

interface OrderStatusData {
  name: string;
  value: number;
  color: string;
}

interface TableStatusData {
  location: string;
  total: number;
  occupied: number;
  available: number;
  occupancy_rate: number;
}

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [revealRevenue, setRevealRevenue] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real data states
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [incomeData, setIncomeData] = useState<IncomeData[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<OrderStatusData[]>([]);
  const [tableStatusData, setTableStatusData] = useState<TableStatusData[]>([]);
  const [previousStats, setPreviousStats] = useState<DashboardStats | null>(
    null,
  );

  // Fetch data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch dashboard stats
        const statsResponse = await apiClient.getDashboardStats();
        if (statsResponse.success && statsResponse.data) {
          setStats(statsResponse.data);
        }

        // Fetch income report
        const incomeResponse = await apiClient.getIncomeReport(
          selectedPeriod as any,
        );
        if (incomeResponse.success && incomeResponse.data) {
          // Transform API response to chart format
          const breakdown = Array.isArray(incomeResponse.data.breakdown)
            ? incomeResponse.data.breakdown
            : [];

          const chartData: IncomeData[] = breakdown.map((item: any) => ({
            period: new Date(item.period).toLocaleString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            orders: item.orders || 0,
            gross: item.gross || 0,
            tax: item.tax || 0,
            net: item.net || 0,
          }));
          setIncomeData(chartData);
        }

        // Fetch orders report for status breakdown
        const ordersResponse = await apiClient.getOrdersReport();
        if (ordersResponse.success && ordersResponse.data) {
          const statusData: OrderStatusData[] = (
            ordersResponse.data as any[]
          ).map((item: any) => ({
            name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
            value: item.count || 0,
            color: getStatusColor(item.status),
          }));
          setOrderStatusData(statusData);
        }

        // Fetch table status
        const tableResponse = await apiClient.getTableStatus();
        if (tableResponse.success && tableResponse.data) {
          const byLocation = (tableResponse.data as any).by_location || [];
          setTableStatusData(byLocation);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard data",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [selectedPeriod]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusColor = (status: string): string => {
    const colors: { [key: string]: string } = {
      pending: "#fbbf24",
      confirmed: "#60a5fa",
      preparing: "#fb923c",
      ready: "#34d399",
      served: "#818cf8",
      completed: "#10b981",
      cancelled: "#ef4444",
    };
    return colors[status] || "#6b7280";
  };

  const growthPercent =
    stats && previousStats
      ? (
          ((stats.today_revenue - previousStats.today_revenue) /
            previousStats.today_revenue) *
          100
        ).toFixed(1)
      : "0";

  const orderGrowth =
    stats && previousStats
      ? (
          ((stats.today_orders - previousStats.today_orders) /
            previousStats.today_orders) *
          100
        ).toFixed(1)
      : "0";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-6">
        <div className="max-w-md bg-white rounded-2xl p-8 border border-red-200 shadow-lg">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 text-center mb-2">
            Dashboard Error
          </h2>
          <p className="text-slate-600 text-center mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-black bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                Real-time POS System Analytics
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-slate-600" />
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <BarChart3 className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-5">
        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Today's Orders */}
          <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200/50 hover:border-blue-300/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
              {stats && previousStats && (
                <div
                  className={`flex items-center gap-1 text-sm font-semibold ${
                    parseFloat(orderGrowth) >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {parseFloat(orderGrowth) >= 0 ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span>{Math.abs(parseFloat(orderGrowth))}%</span>
                </div>
              )}
            </div>
            <p className="text-slate-600 text-sm font-medium">Today's Orders</p>
            <div className="mt-2 flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-slate-900">
                {stats?.today_orders || 0}
              </h3>
            </div>
          </div>

          {/* Today's Revenue */}
          <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200/50 hover:border-purple-300/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <button
                onClick={() => setRevealRevenue(!revealRevenue)}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {revealRevenue ? (
                  <Eye className="w-4 h-4 text-slate-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-slate-600" />
                )}
              </button>
            </div>
            <p className="text-slate-600 text-sm font-medium">
              Today's Revenue
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-slate-900">
                {revealRevenue
                  ? formatCurrency(stats?.today_revenue || 0)
                  : "••••••"}
              </h3>
              {stats && previousStats && (
                <span
                  className={`text-sm font-semibold ${
                    parseFloat(growthPercent) >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {parseFloat(growthPercent) >= 0 ? "+" : ""}
                  {growthPercent}%
                </span>
              )}
            </div>
          </div>

          {/* Active Orders */}
          <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200/50 hover:border-orange-300/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                In Progress
              </span>
            </div>
            <p className="text-slate-600 text-sm font-medium">Active Orders</p>
            <div className="mt-2">
              <h3 className="text-3xl font-bold text-slate-900">
                {stats?.active_orders || 0}
              </h3>
            </div>
            <div className="mt-4 w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full transition-all"
                style={{
                  width: `${Math.min(((stats?.active_orders || 0) / 12) * 100, 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Occupied Tables */}
          <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200/50 hover:border-emerald-300/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl">
                <Table2 className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-emerald-600 text-sm font-semibold">
                {stats
                  ? Math.round(
                      (stats.occupied_tables / (stats.occupied_tables + 3)) *
                        100,
                    )
                  : 0}
                % Full
              </span>
            </div>
            <p className="text-slate-600 text-sm font-medium">
              Occupied Tables
            </p>
            <div className="mt-2">
              <h3 className="text-3xl font-bold text-slate-900">
                {stats?.occupied_tables || 0}
                <span className="text-xl text-slate-400 font-normal">/8</span>
              </h3>
            </div>
            <div className="mt-4 flex gap-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-1.5 rounded-full ${
                    i < (stats?.occupied_tables || 0)
                      ? "bg-emerald-500"
                      : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Revenue Trend
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  Income breakdown for {selectedPeriod}
                </p>
              </div>

              {/* Period Switch */}
              <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
                {["today", "week", "month"].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all
                      ${
                        selectedPeriod === period
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-200"
                      }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {incomeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={incomeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="period"
                    stroke="#94a3b8"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderRadius: "12px",
                      border: "none",
                    }}
                    labelStyle={{ color: "#e5e7eb", fontWeight: 600 }}
                    itemStyle={{ color: "#e5e7eb" }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend verticalAlign="top" height={36} />

                  <Line
                    type="monotone"
                    dataKey="gross"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#2563eb" }}
                    activeDot={{ r: 6 }}
                    name="Gross Income"
                  />

                  <Line
                    type="monotone"
                    dataKey="net"
                    stroke="#7c3aed"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#7c3aed" }}
                    activeDot={{ r: 6 }}
                    name="Net Income"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-300 flex items-center justify-center text-slate-500">
                No data available for this period
              </div>
            )}
          </div>

          {/* Order Status Pie */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Order Status
            </h2>

            {orderStatusData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          className="hover:opacity-80 transition-opacity"
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderRadius: "12px",
                        border: "none",
                      }}
                      labelStyle={{ color: "#e5e7eb", fontWeight: 600 }}
                      itemStyle={{ color: "#e5e7eb" }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Legend Manual */}
                <div className="mt-4 space-y-2">
                  {orderStatusData.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-slate-700 font-medium">
                          {item.name}
                        </span>
                      </div>
                      <span className="font-bold text-slate-900">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-300 flex items-center justify-center text-slate-500">
                No orders data
              </div>
            )}
          </div>
        </div>

        {/* Table Status Section */}
        {tableStatusData.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Table Status by Location
            </h2>
            <div className="space-y-4">
              {tableStatusData.map((location, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-900">
                      {location.location}
                    </h3>
                    <span className="text-sm text-slate-600">
                      {location.occupied}/{location.total} tables
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-slate-200 rounded-lg h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-blue-500 h-full"
                        style={{
                          width: `${(location.occupied / location.total) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-600 w-12 text-right">
                      {Math.round(location.occupancy_rate)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-sm text-white">
          <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all backdrop-blur-sm">
              <Plus className="w-5 h-5" />
              <span className="text-sm font-semibold">New Order</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all backdrop-blur-sm">
              <Users className="w-5 h-5" />
              <span className="text-sm font-semibold">Manage Staff</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all backdrop-blur-sm">
              <Settings className="w-5 h-5" />
              <span className="text-sm font-semibold">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
