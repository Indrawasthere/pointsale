import { useState } from "react";
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
} from "lucide-react";

const mockStats = {
  today_orders: 24,
  today_revenue: 4850.5,
  active_orders: 8,
  occupied_tables: 5,
  yesterday_orders: 18,
  yesterday_revenue: 3200.75,
};

const mockIncomeData = [
  { period: "09:00", orders: 2, gross: 250, tax: 25, net: 225 },
  { period: "10:00", orders: 5, gross: 680, tax: 68, net: 612 },
  { period: "11:00", orders: 8, gross: 1200, tax: 120, net: 1080 },
  { period: "12:00", orders: 9, gross: 1350, tax: 135, net: 1215 },
  { period: "13:00", orders: 4, gross: 650, tax: 65, net: 585 },
  { period: "14:00", orders: 2, gross: 320, tax: 32, net: 288 },
];

const mockOrderStatus = [
  { name: "Completed", value: 20, color: "#10b981" },
  { name: "Pending", value: 5, color: "#f59e0b" },
  { name: "Cancelled", value: 1, color: "#ef4444" },
];

const mockTableStatus = [
  { location: "Main Hall", total: 8, occupied: 5, available: 3 },
  { location: "VIP Area", total: 4, occupied: 2, available: 2 },
  { location: "Outdoor", total: 6, occupied: 1, available: 5 },
];

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [revealRevenue, setRevealRevenue] = useState(true);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const growthPercent = (
    ((mockStats.today_revenue - mockStats.yesterday_revenue) /
      mockStats.yesterday_revenue) *
    100
  ).toFixed(1);
  const orderGrowth = (
    ((mockStats.today_orders - mockStats.yesterday_orders) /
      mockStats.yesterday_orders) *
    100
  ).toFixed(1);

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
                Welcome back, Admin!
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
              <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                <ArrowUpRight className="w-4 h-4" />
                <span>{orderGrowth}%</span>
              </div>
            </div>
            <p className="text-slate-600 text-sm font-medium">Today's Orders</p>
            <div className="mt-2 flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-slate-900">
                {mockStats.today_orders}
              </h3>
              <span className="text-slate-500 text-sm">
                vs {mockStats.yesterday_orders} yesterday
              </span>
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
                  ? formatCurrency(mockStats.today_revenue)
                  : "••••••"}
              </h3>
              <span
                className={`text-sm font-semibold ${parseFloat(growthPercent) >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {parseFloat(growthPercent) >= 0 ? "+" : ""}
                {growthPercent}%
              </span>
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
                {mockStats.active_orders}
              </h3>
            </div>
            <div className="mt-4 w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full transition-all"
                style={{ width: `${(mockStats.active_orders / 12) * 100}%` }}
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
                {Math.round(
                  (mockStats.occupied_tables /
                    (mockStats.occupied_tables + 3)) *
                    100,
                )}
                % Full
              </span>
            </div>
            <p className="text-slate-600 text-sm font-medium">
              Occupied Tables
            </p>
            <div className="mt-2">
              <h3 className="text-3xl font-bold text-slate-900">
                {mockStats.occupied_tables}
                <span className="text-xl text-slate-400 font-normal">/8</span>
              </h3>
            </div>
            <div className="mt-4 flex gap-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-1.5 rounded-full ${
                    i < mockStats.occupied_tables
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
                  Hourly breakdown for today
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

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockIncomeData}>
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
          </div>

          {/* Order Status Pie */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Order Status
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockOrderStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {mockOrderStatus.map((entry, index) => (
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
              {mockOrderStatus.map((item) => (
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
                  <span className="font-bold text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section - Tables & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Table Status */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Table Status</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {mockTableStatus.map((table, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-900">
                      {table.location}
                    </h3>
                    <span className="text-sm text-slate-600">
                      {table.occupied}/{table.total} tables
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-slate-200 rounded-lg h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-blue-500 h-full"
                        style={{
                          width: `${(table.occupied / table.total) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-600 w-12 text-right">
                      {Math.round((table.occupied / table.total) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-500 rounded-2xl p-6 shadow-sm text-white">
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
    </div>
  );
}
