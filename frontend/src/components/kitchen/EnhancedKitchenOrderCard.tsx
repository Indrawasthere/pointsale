import { useState } from "react";
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
} from "lucide-react";

// Mock data
const mockOrders = [
  {
    id: "1",
    order_number: "ORD001",
    customer_name: "John Doe",
    table: { table_number: "3" },
    order_type: "dine_in",
    status: "confirmed",
    notes: "No onions on burger",
    created_at: new Date(Date.now() - 5 * 60000).toISOString(),
    items: [
      {
        id: "i1",
        quantity: 2,
        product: { name: "Cheeseburger" },
        special_instructions: "No onions",
        status: "preparing",
      },
      {
        id: "i2",
        quantity: 1,
        product: { name: "French Fries" },
        special_instructions: "Extra crispy",
        status: "preparing",
      },
    ],
  },
  {
    id: "2",
    order_number: "ORD002",
    customer_name: "Jane Smith",
    order_type: "takeout",
    status: "preparing",
    created_at: new Date(Date.now() - 12 * 60000).toISOString(),
    items: [
      {
        id: "i3",
        quantity: 1,
        product: { name: "Grilled Salmon" },
        special_instructions: null,
        status: "preparing",
      },
      {
        id: "i4",
        quantity: 2,
        product: { name: "Caesar Salad" },
        special_instructions: null,
        status: "ready",
      },
    ],
  },
  {
    id: "3",
    order_number: "ORD003",
    customer_name: "Mike Wilson",
    table: { table_number: "5" },
    order_type: "dine_in",
    status: "ready",
    created_at: new Date(Date.now() - 8 * 60000).toISOString(),
    items: [
      {
        id: "i5",
        quantity: 2,
        product: { name: "Beef Steak" },
        special_instructions: "Medium rare",
        status: "ready",
      },
    ],
  },
];

const mockUser = {
  first_name: "Chef",
  last_name: "Fadlan",
};

export function KitchenDisplay() {
  const [selectedTab, setSelectedTab] = useState("active");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(0.7);
  const [showSettings, setShowSettings] = useState(false);
  const [orders, setOrders] = useState(mockOrders);

  const getWaitTime = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    return Math.floor((now.getTime() - created.getTime()) / 1000 / 60);
  };

  const getUrgency = (createdAt) => {
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
        label: "WARNING",
        icon: "🟡",
      };
    return {
      level: "normal",
      color: "border-blue-500 bg-blue-50",
      label: "NEW",
      icon: "🔵",
    };
  };

  const stats = {
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    ready: orders.filter((o) => o.status === "ready").length,
    total: orders.length,
  };

  const handleStartCooking = (orderId) => {
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, status: "preparing" } : o)),
    );
  };

  const handleMarkReady = (orderId) => {
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, status: "ready" } : o)),
    );
  };

  const handleCompleteOrder = (orderId) => {
    setOrders(orders.filter((o) => o.id !== orderId));
  };

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

  const activeOrders = orders.filter((o) => o.status !== "ready");
  const readyOrders = orders.filter((o) => o.status === "ready");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50">
      {/* HEADER */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <div className="px-8 py-5">
          <div className="flex items-center justify-between">
            {/* Left - Title & Stats */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Flame className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Kitchen Display
                  </h1>
                  <p className="text-slate-600 text-sm mt-1">
                    Chef {mockUser.first_name} • {stats.total} active orders
                  </p>
                </div>
              </div>

              {/* Stats Badges */}
              <div className="flex items-center gap-3 ml-6 pl-6 border-l border-slate-200">
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-xl">
                  <span className="text-2xl">🆕</span>
                  <div className="text-center">
                    <div className="text-sm text-slate-600">New</div>
                    <div className="text-xl font-bold text-blue-700">
                      {stats.confirmed}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-xl">
                  <span className="text-2xl">🔥</span>
                  <div className="text-center">
                    <div className="text-sm text-slate-600">Cooking</div>
                    <div className="text-xl font-bold text-orange-700">
                      {stats.preparing}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-xl">
                  <span className="text-2xl">✅</span>
                  <div className="text-center">
                    <div className="text-sm text-slate-600">Ready</div>
                    <div className="text-xl font-bold text-emerald-700">
                      {stats.ready}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Controls */}
            <div className="flex items-center gap-3">
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
        {/* ACTIVE ORDERS */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <ChefHat className="w-7 h-7 text-orange-600" />
              Active Orders ({activeOrders.length})
            </h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
              Refresh
            </button>
          </div>

          {activeOrders.length === 0 ? (
            <div className="text-center py-16">
              <ChefHat className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 text-lg font-semibold">
                No active orders
              </p>
              <p className="text-slate-500">Kitchen is ready! 🎉</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {activeOrders.map((order) => {
                const urgency = getUrgency(order.created_at);
                const waitTime = getWaitTime(order.created_at);

                return (
                  <div
                    key={order.id}
                    className={`rounded-2xl border-2 overflow-hidden shadow-lg hover:shadow-xl transition-all ${urgency.color}`}
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
                        <div className="text-sm">
                          {order.order_type === "dine_in" && order.table && (
                            <span>🪑 Table {order.table.table_number}</span>
                          )}
                          {order.order_type === "takeout" && (
                            <span>📦 Takeout</span>
                          )}
                        </div>
                        <div className="text-sm font-bold">{waitTime} min</div>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="p-5 space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 bg-white/70 rounded-xl border border-slate-200"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="font-bold text-slate-900">
                                {item.quantity}x {item.product.name}
                              </div>
                              {item.special_instructions && (
                                <div className="text-xs text-orange-700 mt-1 bg-orange-50 p-1.5 rounded mt-2">
                                  ⭐ {item.special_instructions}
                                </div>
                              )}
                            </div>
                            <div
                              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                                item.status === "ready"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-orange-100 text-orange-700"
                              }`}
                            >
                              {item.status === "ready" ? "✅" : "🍳"}{" "}
                              {item.status}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Notes */}
                    {order.notes && (
                      <div className="px-5 pb-4">
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                          <p className="text-sm text-blue-800">
                            <strong>Notes:</strong> {order.notes}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="px-5 pb-5 space-y-2">
                      {order.status === "confirmed" && (
                        <button
                          onClick={() => {
                            handleStartCooking(order.id);
                            playSound("new");
                          }}
                          className="w-full px-4 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-bold hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                          <Flame className="w-5 h-5" />
                          Start Cooking
                        </button>
                      )}
                      {order.status === "preparing" && (
                        <button
                          onClick={() => {
                            handleMarkReady(order.id);
                            playSound("ready");
                          }}
                          className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-bold hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-5 h-5" />
                          Mark Ready
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* READY ORDERS */}
        {readyOrders.length > 0 && (
          <div className="mt-12 pt-8 border-t-2 border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <CheckCircle className="w-7 h-7 text-emerald-600" />
              Ready for Service ({readyOrders.length})
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {readyOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border-2 border-emerald-500 bg-emerald-50 shadow-lg overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-6 text-center">
                    <div className="text-4xl font-bold mb-2">
                      #{order.order_number}
                    </div>
                    <div className="text-xl font-semibold">
                      {order.customer_name || "Guest"}
                    </div>
                    {order.order_type === "dine_in" && order.table && (
                      <div className="text-sm mt-2 text-emerald-100">
                        🪑 Table {order.table.table_number}
                      </div>
                    )}
                  </div>
                  <div className="p-5 text-center">
                    <div className="text-5xl mb-4">✅</div>
                    <p className="text-emerald-800 font-bold text-lg">
                      Ready for pickup/serving
                    </p>
                    <button
                      onClick={() => handleCompleteOrder(order.id)}
                      className="mt-4 w-full px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors"
                    >
                      Completed
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
