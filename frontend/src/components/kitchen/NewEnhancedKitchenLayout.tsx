import { useState, useEffect } from "react";
import {
  RefreshCw,
  Volume2,
  VolumeX,
  Clock,
  ChefHat,
  Package,
  CheckCircle,
  AlertCircle,
  LogOut,
  Flame,
  Zap,
  Loader2,
  Bell,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/api/client";
import type { User, Order, OrderItem } from "@/types";

interface KitchenDisplayProps {
  user: User;
}

export function KitchenDisplay({ user }: KitchenDisplayProps) {
  const [selectedTab, setSelectedTab] = useState("active");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(0.7);
  const [showSettings, setShowSettings] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  // Real-time refresh interval
  const REFRESH_INTERVAL = 3000; // 3 seconds

  // Fetch kitchen orders from API
  const fetchKitchenOrders = async () => {
    try {
      setRefreshing(true);
      const response = await apiClient.getKitchenOrders(
        selectedTab === "all" ? undefined : selectedTab,
      );

      if (response.success) {
        // Debug: Log semua order dengan ID mereka
        console.log("📋 Kitchen Orders Received:", {
          totalOrders: response.data?.length,
          orders: response.data?.map((order) => ({
            id: order.id,
            idLength: order.id?.length,
            orderNumber: order.order_number,
            status: order.status,
            table: order.table,
            itemsCount: order.items?.length,
          })),
        });

        // Log contoh ID decoding
        if (response.data?.[0]?.id) {
          const sampleId = response.data[0].id;
          console.log("🔍 Sample ID Analysis:", {
            original: sampleId,
            length: sampleId.length,
            isBase64:
              /^[A-Za-z0-9+/]+={0,2}$/.test(sampleId) &&
              sampleId.length % 4 === 0,
            tryDecode: tryDecodeBase64(sampleId),
          });
        }

        setOrders(response.data || []);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to fetch orders",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching kitchen orders:", error);
      toast({
        title: "Error",
        description: "Failed to fetch kitchen orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Helper function untuk decode
  const tryDecodeBase64 = (str: string): string | null => {
    try {
      return atob(str);
    } catch {
      return null;
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchKitchenOrders();
  }, [selectedTab]);

  // Set up real-time polling
  useEffect(() => {
    const interval = setInterval(() => {
      fetchKitchenOrders();
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [selectedTab]);

  const getWaitTime = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    return Math.floor((now.getTime() - created.getTime()) / 1000 / 60);
  };

  const getUrgency = (createdAt: string) => {
    const waitTime = getWaitTime(createdAt);
    if (waitTime > 20)
      return {
        level: "critical",
        color: "border-red-500 bg-red-50",
        label: "CRITICAL",
        icon: "🔴",
      };
    if (waitTime > 15)
      return {
        level: "urgent",
        color: "border-orange-500 bg-orange-50",
        label: "URGENT",
        icon: "🟠",
      };
    if (waitTime > 10)
      return {
        level: "warning",
        color: "border-yellow-500 bg-yellow-50",
        label: "NEED ATTENTION",
        icon: "🟡",
      };
    return {
      level: "normal",
      color: "border-blue-500 bg-blue-50",
      label: "NEW",
      icon: "🔵",
    };
  };

  // Update order item status (CRUD - Update)
  const handleUpdateItemStatus = async (
    orderId: string,
    itemId: string,
    newStatus: string,
  ) => {
    try {
      const response = await apiClient.updateOrderItemStatus(
        orderId,
        itemId,
        newStatus,
      );

      if (response.success) {
        toast({
          title: "Success",
          description: `Item status updated to ${newStatus}`,
          variant: "success",
        });

        // Refresh orders
        fetchKitchenOrders();

        // Play sound if enabled
        if (soundEnabled && newStatus === "ready") {
          playSound("ready");
        }
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update item status",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating item status:", error);
      toast({
        title: "Error",
        description: "Failed to update item status",
        variant: "destructive",
      });
    }
  };

  // Update entire order status
  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: string,
  ) => {
    try {
      const response = await apiClient.updateOrderStatus(
        orderId,
        newStatus,
        "Kitchen update",
      );

      if (response.success) {
        toast({
          title: "Success",
          description: `Order status updated to ${newStatus}`,
          variant: "success",
        });

        // Refresh orders
        fetchKitchenOrders();

        // Play sound if enabled
        if (soundEnabled) {
          playSound("ready");
        }
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update order status",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  // Complete entire order (CRUD - Update to completed)
  const handleCompleteOrder = async (orderId: string) => {
    try {
      const response = await apiClient.updateOrderStatus(
        orderId,
        "completed",
        "Order served",
      );

      if (response.success) {
        toast({
          title: "Success",
          description: "Order marked as completed",
          variant: "success",
        });

        // Refresh orders
        fetchKitchenOrders();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to complete order",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error completing order:", error);
      toast({
        title: "Error",
        description: "Failed to complete order",
        variant: "destructive",
      });
    }
  };

  // Sound functions
  const playSound = (type = "new") => {
    if (!soundEnabled) return;
    try {
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.connect(gain);
      gain.connect(audioContext.destination);

      if (type === "new") {
        osc.frequency.setValueAtTime(800, audioContext.currentTime);
        gain.gain.setValueAtTime(volume * 0.3, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.5,
        );
        osc.start();
        osc.stop(audioContext.currentTime + 0.5);
      } else {
        osc.frequency.setValueAtTime(1200, audioContext.currentTime);
        gain.gain.setValueAtTime(volume * 0.3, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.3,
        );
        osc.start();
        osc.stop(audioContext.currentTime + 0.3);
      }
    } catch (error) {
      console.log("Sound failed:", error);
    }
  };

  // Filter orders based on selected tab
  const filteredOrders = orders.filter((order) => {
    if (selectedTab === "all") return true;
    if (selectedTab === "active")
      return order.status !== "ready" && order.status !== "completed";
    return order.status === selectedTab;
  });

  const activeOrders = orders.filter(
    (o) => o.status === "confirmed" || o.status === "preparing",
  );
  const readyOrders = orders.filter((o) => o.status === "ready");

  const stats = {
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    ready: orders.filter((o) => o.status === "ready").length,
    total: activeOrders.length + readyOrders.length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading kitchen orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* HEADER */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <div className="px-8 py-5">
          <div className="flex items-center justify-between">
            {/* Left - Title & Stats */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Kitchen Display
                  </h1>
                  <p className="text-slate-600 text-sm mt-1">
                    Chef {user?.first_name} • {stats.total} active orders
                  </p>
                </div>
              </div>

              {/* Stats Badges */}
              <div className="flex items-center gap-4 ml-6 pl-6 border-l border-slate-300">
                <div className="w-28 flex flex-col items-center justify-center py-3 bg-blue-100 rounded-2xl">
                  <div className="text-sm font-medium text-slate-600">New</div>
                  <div className="text-2xl font-bold text-blue-700">
                    {stats.confirmed}
                  </div>
                </div>

                <div className="w-28 flex flex-col items-center justify-center py-3 bg-orange-100 rounded-2xl">
                  <div className="text-sm font-medium text-slate-600">
                    Cooking
                  </div>
                  <div className="text-2xl font-bold text-orange-700">
                    {stats.preparing}
                  </div>
                </div>

                <div className="w-28 flex flex-col items-center justify-center py-3 bg-emerald-100 rounded-2xl">
                  <div className="text-sm font-medium text-slate-600">
                    Ready
                  </div>
                  <div className="text-2xl font-bold text-emerald-700">
                    {stats.ready}
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={fetchKitchenOrders}
                disabled={refreshing}
                className="p-2.5 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
                title="Refresh orders"
              >
                <RefreshCw
                  className={`w-6 h-6 text-slate-600 ${refreshing ? "animate-spin" : ""}`}
                />
              </button>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2.5 hover:bg-slate-100 rounded-lg transition-colors"
                title={soundEnabled ? "Mute" : "Unmute"}
              >
                {soundEnabled ? (
                  <Volume2 className="w-6 h-6 text-slate-600" />
                ) : (
                  <VolumeX className="w-6 h-6 text-slate-400" />
                )}
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2.5 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Clock className="w-6 h-6 text-slate-600" />
              </button>
              <button
                onClick={() => (window.location.href = "/login")}
                className="p-2.5 hover:bg-red-100 rounded-lg transition-colors"
              >
                <LogOut className="w-6 h-6 text-red-600" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mt-6">
            {["all", "confirmed", "preparing", "ready"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  selectedTab === tab
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab !== "all" && (
                  <span className="ml-2 bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-full text-xs">
                    {
                      orders.filter((o) => tab === "all" || o.status === tab)
                        .length
                    }
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Settings Overlay */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">
                Sound Settings
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-900">
                  Enable Sounds
                </span>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors ${soundEnabled ? "bg-blue-600" : "bg-slate-300"}`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${soundEnabled ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Volume
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => playSound("new")}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium text-sm transition-colors"
                >
                  Test New Order
                </button>
                <button
                  onClick={() => playSound("ready")}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium text-sm transition-colors"
                >
                  Test Ready
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="p-8 space-y-8">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <ChefHat className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 text-lg font-semibold">
              No {selectedTab === "all" ? "" : selectedTab} orders
            </p>
            <p className="text-slate-500">
              Kitchen is {selectedTab === "ready" ? "caught up!" : "ready!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOrders.map((order) => {
              const urgency = getUrgency(order.created_at);
              const waitTime = getWaitTime(order.created_at);

              return (
                <div
                  key={order.id}
                  className={`rounded-2xl border border-slate-300 overflow-hidden shadow-md hover:shadow-lg transition-all ${urgency.color}`}
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-2xl font-bold">
                          #{order.order_number}
                        </h3>
                        <p className="text-slate-300 text-sm mt-1">
                          {order.customer_name || "Guest"}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl">{urgency.icon}</div>
                        <div className="text-xs font-bold mt-1 text-slate-300">
                          {urgency.label}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                      <div className="text-sm flex items-center gap-2">
                        {order.order_type === "dine_in" && order.table ? (
                          <>
                            <span>Table {order.table.table_number}</span>
                            {order.table.location && (
                              <span className="text-slate-400">
                                • {order.table.location}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="capitalize">{order.order_type}</span>
                        )}
                      </div>
                      <div className="text-sm font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {waitTime} min
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-5 bg-white">
                    <div className="space-y-4">
                      {order.items?.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full">
                                <span className="text-blue-700 font-bold">
                                  {item.quantity}x
                                </span>
                              </div>
                              <div>
                                <h4 className="font-medium text-slate-900">
                                  {item.product?.name}
                                </h4>
                                {item.special_instructions && (
                                  <p className="text-xs text-slate-600 mt-1">
                                    Note: {item.special_instructions}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                item.status === "ready"
                                  ? "bg-green-100 text-green-800"
                                  : item.status === "preparing"
                                    ? "bg-orange-100 text-orange-800"
                                    : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {item.status}
                            </span>

                            {item.status === "preparing" && (
                              <button
                                onClick={() =>
                                  handleUpdateItemStatus(
                                    order.id,
                                    item.id,
                                    "ready",
                                  )
                                }
                                className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                              >
                                Mark Ready
                              </button>
                            )}

                            {item.status === "ready" && (
                              <button
                                onClick={() =>
                                  handleUpdateItemStatus(
                                    order.id,
                                    item.id,
                                    "served",
                                  )
                                }
                                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                              >
                                Mark Served
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Actions */}
                    <div className="flex justify-between items-center pt-6 mt-6 border-t border-slate-200">
                      <div className="text-sm text-slate-600">
                        Status:{" "}
                        <span className="font-medium capitalize">
                          {order.status}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        {order.status === "confirmed" && (
                          <button
                            onClick={() =>
                              handleUpdateOrderStatus(order.id, "preparing")
                            }
                            className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
                          >
                            Start Cooking
                          </button>
                        )}

                        {order.status === "preparing" && (
                          <button
                            onClick={() =>
                              handleUpdateOrderStatus(order.id, "ready")
                            }
                            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                          >
                            Mark as Ready
                          </button>
                        )}

                        {order.status === "ready" && (
                          <button
                            onClick={() => handleCompleteOrder(order.id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                          >
                            Complete Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
