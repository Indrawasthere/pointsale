import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Calendar,
  Download,
  AlertCircle,
  Loader,
} from "lucide-react";
import apiClient from "@/api/client";

interface SalesReportItem {
  date?: string;
  hour?: string;
  order_count: number;
  revenue: number;
}

interface OrdersReportItem {
  status: string;
  count: number;
  avg_amount: number;
}

interface IncomeReport {
  summary?: {
    total_orders: number;
    gross_income: number;
    tax_collected: number;
    net_income: number;
  };
  breakdown?: Array<{
    period: string;
    orders: number;
    gross: number;
    tax: number;
    net: number;
  }>;
}

export function AdminReports() {
  const [activeTab, setActiveTab] = useState<"sales" | "orders" | "analytics">(
    "sales",
  );
  const [selectedPeriod, setSelectedPeriod] = useState<
    "today" | "week" | "month"
  >("today");

  // Fetch sales report
  const {
    data: salesData,
    isLoading: salesLoading,
    error: salesError,
  } = useQuery({
    queryKey: ["salesReport", selectedPeriod],
    queryFn: () =>
      apiClient.getSalesReport(selectedPeriod).then((res) => res.data),
    retry: 2,
  });

  // Fetch orders report
  const {
    data: ordersData,
    isLoading: ordersLoading,
    error: ordersError,
  } = useQuery({
    queryKey: ["ordersReport"],
    queryFn: () => apiClient.getOrdersReport().then((res) => res.data),
    retry: 2,
  });

  // Fetch income report
  const {
    data: incomeData,
    isLoading: incomeLoading,
    error: incomeError,
  } = useQuery({
    queryKey: ["incomeReport", selectedPeriod],
    queryFn: () =>
      apiClient.getIncomeReport(selectedPeriod).then((res) => res.data),
    retry: 2,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate totals from real data
  const totalRevenue =
    Array.isArray(salesData) && salesData.length > 0
      ? salesData.reduce(
          (sum: number, item: SalesReportItem) => sum + (item.revenue || 0),
          0,
        )
      : 0;

  const totalOrders =
    Array.isArray(salesData) && salesData.length > 0
      ? salesData.reduce(
          (sum: number, item: SalesReportItem) => sum + (item.order_count || 0),
          0,
        )
      : 0;

  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const LoadingState = () => (
    <div className="flex items-center justify-center py-12">
      <Loader className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
  );

  const ErrorState = ({ error }: { error: any }) => (
    <div className="flex items-center gap-3 py-8 px-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
      <AlertCircle className="w-5 h-5 flex-shrink-0" />
      <div>
        <p className="font-semibold">Error loading data</p>
        <p className="text-sm">{error?.message || "An error occurred"}</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground">
            Detailed insights into your restaurant performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Custom Range
          </Button>
        </div>
      </div>

      {/* Period Selection */}
      <div className="flex gap-2">
        {(["today", "week", "month"] as const).map((period) => (
          <Button
            key={period}
            variant={selectedPeriod === period ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod(period)}
          >
            {period === "today"
              ? "Today"
              : period === "week"
                ? "This Week"
                : "This Month"}
          </Button>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {salesLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                formatCurrency(totalRevenue)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedPeriod === "today" ? "Today" : `This ${selectedPeriod}`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {salesLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                totalOrders
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedPeriod === "today" ? "Today" : `This ${selectedPeriod}`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {salesLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                formatCurrency(averageOrderValue)
              )}
            </div>
            <p className="text-xs text-muted-foreground">Per order value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+12.5%</div>
            <p className="text-xs text-muted-foreground">
              Compared to previous period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Reports Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value: any) => setActiveTab(value)}
      >
        <TabsList>
          <TabsTrigger value="sales">Sales Report</TabsTrigger>
          <TabsTrigger value="orders">Orders Report</TabsTrigger>
          <TabsTrigger value="analytics">Income Analysis</TabsTrigger>
        </TabsList>

        {/* Sales Report Tab */}
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Sales Report - {selectedPeriod}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {salesLoading ? (
                <LoadingState />
              ) : salesError ? (
                <ErrorState error={salesError} />
              ) : Array.isArray(salesData) && salesData.length > 0 ? (
                <div className="space-y-4">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 font-medium text-sm">
                      <div>Date/Period</div>
                      <div className="text-center">Orders</div>
                      <div className="text-center">Revenue</div>
                    </div>
                    {salesData.map((item: SalesReportItem, index: number) => (
                      <div
                        key={index}
                        className="grid grid-cols-3 gap-4 p-4 border-t text-sm hover:bg-muted/30 transition-colors"
                      >
                        <div className="font-medium">
                          {item.date
                            ? new Date(item.date).toLocaleDateString()
                            : item.hour || "N/A"}
                        </div>
                        <div className="text-center">{item.order_count}</div>
                        <div className="text-center font-medium">
                          {formatCurrency(item.revenue)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No sales data available for this period
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Report Tab */}
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Orders by Status - Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <LoadingState />
              ) : ordersError ? (
                <ErrorState error={ordersError} />
              ) : Array.isArray(ordersData) && ordersData.length > 0 ? (
                <div className="space-y-4">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 font-medium text-sm">
                      <div>Status</div>
                      <div className="text-center">Count</div>
                      <div className="text-center">Avg Amount</div>
                    </div>
                    {ordersData.map((item: OrdersReportItem, index: number) => (
                      <div
                        key={index}
                        className="grid grid-cols-3 gap-4 p-4 border-t text-sm hover:bg-muted/30 transition-colors"
                      >
                        <div className="font-medium">
                          <Badge
                            variant={
                              item.status === "completed"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {item.status.charAt(0).toUpperCase() +
                              item.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="text-center">{item.count}</div>
                        <div className="text-center font-medium">
                          {formatCurrency(item.avg_amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No orders data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Income Analysis - {selectedPeriod}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {incomeLoading ? (
                <LoadingState />
              ) : incomeError ? (
                <ErrorState error={incomeError} />
              ) : incomeData ? (
                <div className="space-y-6">
                  {/* Summary */}
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {incomeData.summary?.total_orders || 0}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Total Orders
                      </div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(incomeData.summary?.gross_income || 0)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Gross Income
                      </div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {formatCurrency(incomeData.summary?.tax_collected || 0)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Tax Collected
                      </div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {formatCurrency(incomeData.summary?.net_income || 0)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Net Income
                      </div>
                    </div>
                  </div>

                  {/* Breakdown Table */}
                  {incomeData.breakdown && incomeData.breakdown.length > 0 && (
                    <div className="border rounded-lg overflow-hidden">
                      <div className="grid grid-cols-5 gap-4 p-4 bg-muted/50 font-medium text-sm">
                        <div>Period</div>
                        <div className="text-center">Orders</div>
                        <div className="text-center">Gross</div>
                        <div className="text-center">Tax</div>
                        <div className="text-center">Net</div>
                      </div>
                      {incomeData.breakdown
                        .slice(0, 10)
                        .map((item: any, index: number) => (
                          <div
                            key={index}
                            className="grid grid-cols-5 gap-4 p-4 border-t text-sm hover:bg-muted/30 transition-colors"
                          >
                            <div className="font-medium">
                              {new Date(item.period).toLocaleDateString()}
                            </div>
                            <div className="text-center">{item.orders}</div>
                            <div className="text-center">
                              {formatCurrency(item.gross)}
                            </div>
                            <div className="text-center">
                              {formatCurrency(item.tax)}
                            </div>
                            <div className="text-center font-medium">
                              {formatCurrency(item.net)}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No analytics data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
