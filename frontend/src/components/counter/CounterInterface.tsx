import { useState } from "react";
import {
  Plus,
  Minus,
  ShoppingCart,
  CreditCard,
  DollarSign,
  Check,
  Clock,
  Table2,
  Search,
  Package,
  Car,
  Users,
  Receipt,
  AlertCircle,
  Banknote,
  Smartphone,
  MapPin,
} from "lucide-react";

// Mock data
const mockCategories = [
  { id: "1", name: "Beverages", color: "#3b82f6", icon: "" },
  { id: "2", name: "Main Course", color: "#3b82f6", icon: "" },
  { id: "3", name: "Appetizers", color: "#3b82f6", icon: "" },
  { id: "4", name: "Desserts", color: "#3b82f6", icon: "" },
];

const mockProducts = [
  {
    id: "1",
    category_id: "1",
    name: "Dadar Gulung",
    price: 3500,
    description: "Perpaduan kulit lembut dan fla yang lumer",
    is_available: true,
    preparation_time: 2,
  },
  {
    id: "2",
    category_id: "1",
    name: "Risol Mayo",
    price: 4500,
    description: "Risol dengan mayo yang lezat",
    is_available: true,
    preparation_time: 3,
  },
  {
    id: "3",
    category_id: "2",
    name: "Grilled Salmon",
    price: 35000,
    description: "Saus lemon yang lezat dan pedas",
    is_available: true,
    preparation_time: 20,
  },
  {
    id: "4",
    category_id: "2",
    name: "Beef Steak",
    price: 25000,
    description: "Daging sapi yang lezat",
    is_available: true,
    preparation_time: 25,
  },
  {
    id: "5",
    category_id: "3",
    name: "Salad Buah",
    price: 12000,
    description: "Perpaduan buah yang segar",
    is_available: true,
    preparation_time: 5,
  },
  {
    id: "6",
    category_id: "3",
    name: "Kue Coklat",
    price: 8000,
    description: "Coklat lumer yang manis",
    is_available: true,
    preparation_time: 8,
  },
  {
    id: "7",
    category_id: "4",
    name: "Vanilla Ice Cream",
    price: 5000,
    description: "Es krim vanilla dengan saus coklat",
    is_available: true,
    preparation_time: 2,
  },
  {
    id: "8",
    category_id: "4",
    name: "Strawberry Ice Cream",
    price: 6500,
    description: "Es krim strawberry dengan saus coklat",
    is_available: true,
    preparation_time: 1,
  },
];

const mockTables = [
  {
    id: "1",
    table_number: "1",
    seating_capacity: 2,
    location: "Main Hall",
    is_occupied: false,
  },
  {
    id: "2",
    table_number: "2",
    seating_capacity: 2,
    location: "Main Hall",
    is_occupied: false,
  },
  {
    id: "3",
    table_number: "3",
    seating_capacity: 4,
    location: "Main Hall",
    is_occupied: true,
  },
  {
    id: "4",
    table_number: "4",
    seating_capacity: 4,
    location: "Main Hall",
    is_occupied: false,
  },
];

const mockOrders = [
  {
    id: "1",
    order_number: "ORD001",
    customer_name: "John Doe",
    total_amount: 45000,
    order_type: "dine_in",
    status: "ready",
    table: { table_number: "3" },
    items: [],
  },
  {
    id: "2",
    order_number: "ORD002",
    customer_name: "Jane Smith",
    total_amount: 32500,
    order_type: "takeout",
    status: "ready",
    items: [],
  },
];

export function CounterInterface() {
  const [activeTab, setActiveTab] = useState("create");
  const [orderType, setOrderType] = useState("takeout");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTable, setSelectedTable] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [cart, setCart] = useState([]);
  const [orderNotes, setOrderNotes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredProducts = mockProducts.filter((p) => {
    const matchCategory =
      selectedCategory === "all" || p.category_id === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const availableTables = mockTables.filter((t) => !t.is_occupied);

  const addToCart = (product) => {
    const existing = cart.find((item) => item.product.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    const existing = cart.find((item) => item.product.id === productId);
    if (existing && existing.quantity > 1) {
      setCart(
        cart.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        ),
      );
    } else {
      setCart(cart.filter((item) => item.product.id !== productId));
    }
  };

  const getTotalAmount = () => {
    return cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
  };

  const handleCreateOrder = () => {
    if (cart.length === 0 || (orderType === "dine_in" && !selectedTable))
      return;
    setIsProcessing(true);
    setTimeout(() => {
      console.log("Order created");
      setIsProcessing(false);
      setCart([]);
      setSelectedTable(null);
      setCustomerName("");
      setOrderNotes("");
    }, 1500);
  };

  const handlePayment = () => {
    if (!selectedOrder || !paymentAmount) return;
    setIsProcessing(true);
    setTimeout(() => {
      console.log("Payment processed");
      setIsProcessing(false);
      setSelectedOrder(null);
      setPaymentAmount("");
      setReferenceNumber("");
    }, 1500);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const orderTypeConfig = {
    dine_in: {
      icon: Users,
      label: "Dine-In",
      color: "from-blue-600 to-blue-500",
    },
    takeout: {
      icon: Package,
      label: "Takeout",
      color: "from-green-700 to-green-600",
    },
    delivery: {
      icon: Car,
      label: "Delivery",
      color: "from-red-600 to-red-500",
    },
  };

  const config = orderTypeConfig[orderType];
  const OrderIcon = config.icon;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* LEFT SIDE - PRODUCTS */}
      <div className="flex-1 flex flex-col overflow-hidden border-r border-slate-200/50">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
          <div className="p-6 space-y-5">
            {/* Title */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-black bg-clip-text text-transparent">
                  Counter / Checkout
                </h1>
                <p className="text-slate-600 text-sm mt-2">
                  Create orders & process payments
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setActiveTab("create")}
                  className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${
                    activeTab === "create"
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg"
                      : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                  }`}
                >
                  Create
                </button>
                <button
                  onClick={() => setActiveTab("payment")}
                  className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${
                    activeTab === "payment"
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg"
                      : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                  }`}
                >
                  Payment
                </button>
              </div>
            </div>

            {activeTab === "create" && (
              <>
                {/* Order Type Selection */}
                <div className="flex gap-3">
                  {Object.entries(orderTypeConfig).map(([type, cfg]) => {
                    const Icon = cfg.icon;
                    return (
                      <button
                        key={type}
                        onClick={() => setOrderType(type)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                          orderType === type
                            ? `bg-gradient-to-r ${cfg.color} text-white shadow-lg`
                            : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
                  />
                </div>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === "all"
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg"
                        : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                    }`}
                  >
                    All Items
                  </button>
                  {mockCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                        selectedCategory === cat.id
                          ? "text-white shadow-lg"
                          : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                      }`}
                      style={{
                        background:
                          selectedCategory === cat.id
                            ? `linear-gradient(135deg, ${cat.color} 0%, ${cat.color}dd 100%)`
                            : undefined,
                      }}
                    >
                      <span>{cat.icon}</span>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "create" ? (
            // Products Grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((product) => {
                const cartItem = cart.find(
                  (item) => item.product.id === product.id,
                );
                const category = mockCategories.find(
                  (c) => c.id === product.category_id,
                );

                return (
                  <div
                    key={product.id}
                    className="group bg-white rounded-2xl overflow-hidden border border-slate-200/50 hover:shadow-lg hover:border-blue-300/50 transition-all duration-200"
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-slate-600 text-xs mt-1">
                            {product.description}
                          </p>
                        </div>
                        <div className="text-2xl ml-3">{category?.icon}</div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="text-2xl font-bold text-slate-900">
                          Rp {product.price.toLocaleString()}
                        </div>
                        {product.preparation_time > 0 && (
                          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-orange-100 rounded-lg">
                            <Clock className="w-3.5 h-3.5 text-orange-600" />
                            <span className="text-xs text-orange-700 font-semibold">
                              {product.preparation_time}m
                            </span>
                          </div>
                        )}
                      </div>

                      {!cartItem ? (
                        <button
                          onClick={() => addToCart(product)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all active:scale-95"
                        >
                          <Plus className="w-5 h-5" />
                          Add
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1.5">
                          <button
                            onClick={() => removeFromCart(product.id)}
                            className="flex-1 flex items-center justify-center p-2 hover:bg-white rounded-lg transition-colors"
                          >
                            <Minus className="w-4 h-4 text-slate-600" />
                          </button>
                          <span className="flex-1 text-center font-bold text-slate-900 text-lg">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => addToCart(product)}
                            className="flex-1 flex items-center justify-center p-2 hover:bg-white rounded-lg transition-colors"
                          >
                            <Plus className="w-4 h-4 text-blue-600" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Payment Orders List
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">
                Orders Ready for Payment
              </h3>
              {mockOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 text-center">
                  <Receipt className="w-16 h-16 text-slate-300 mb-4" />
                  <p className="text-slate-600 font-semibold text-lg">
                    No orders ready
                  </p>
                </div>
              ) : (
                mockOrders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => {
                      setSelectedOrder(order);
                      setPaymentAmount(order.total_amount.toString());
                    }}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedOrder?.id === order.id
                        ? "border-blue-500 bg-blue-50 shadow-lg"
                        : "border-slate-200/50 bg-white hover:shadow-md hover:border-blue-300/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <OrderIcon className="w-5 h-5 text-slate-600" />
                        <div>
                          <h4 className="font-bold text-slate-900">
                            Order #{order.order_number}
                          </h4>
                          <p className="text-xs text-slate-600 mt-0.5">
                            {order.customer_name && `${order.customer_name}`}
                            {order.table &&
                              ` • Table ${order.table.table_number}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-slate-900">
                          Rp {order.total_amount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="px-3 py-1 bg-blue-600 text-blue-500 font-semibold rounded-lg">
                        {order.order_type === "dine_in" ? "Dine-In" : "Takeout"}
                      </div>
                      <div className="px-3 py-1 bg-blue-600 text-blue-700 font-semibold rounded-lg">
                        Ready
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE - ORDER/PAYMENT SUMMARY */}
      <div className="w-96 flex flex-col bg-white border-l border-slate-200/50 shadow-xl">
        {activeTab === "create" ? (
          // CREATE ORDER MODE
          <>
            {/* Table/Customer Selection */}
            {orderType === "dine_in" && (
              <div className="p-6 border-b border-slate-200/50">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Table2 className="w-5 h-5" />
                  Select Table
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {availableTables.map((table) => (
                    <button
                      key={table.id}
                      onClick={() => setSelectedTable(table)}
                      className={`p-3 rounded-xl font-semibold transition-all ${
                        selectedTable?.id === table.id
                          ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      <div className="text-lg">T{table.table_number}</div>
                      <div className="text-xs mt-1">
                        {table.seating_capacity}s
                      </div>
                    </button>
                  ))}
                </div>
                {selectedTable && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-sm font-semibold text-blue-900">
                      Selected: Table {selectedTable.table_number}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Customer Name */}
            <div className="p-6 border-b border-slate-200/50">
              <label className="block text-sm font-bold text-slate-900 mb-3">
                {orderType === "dine_in" ? "Customer Name" : "Customer Name"}
              </label>
              <input
                type="text"
                placeholder="Enter customer name..."
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
              />
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                  <ShoppingCart className="w-14 h-14 text-slate-300 mb-4" />
                  <p className="text-slate-600 font-semibold">Cart is empty</p>
                  <p className="text-slate-500 text-sm mt-2">
                    Add items from menu
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/50 hover:shadow-md transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        Rp {item.product.price.toLocaleString()} ×{" "}
                        {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                      <p className="font-bold text-slate-900 min-w-[80px] text-right">
                        Rp{" "}
                        {(item.product.price * item.quantity).toLocaleString()}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        <Minus className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Order Notes */}
            {cart.length > 0 && (
              <div className="px-6 pb-4">
                <label className="block text-xs font-bold text-slate-900 mb-2">
                  Special Instructions
                </label>
                <textarea
                  placeholder="Any special requests..."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none font-medium"
                  rows="2"
                />
              </div>
            )}

            {/* Footer - Summary */}
            <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent p-6 border-t border-slate-200/50 space-y-4">
              {cart.length > 0 ? (
                <>
                  <div className="p-5 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-200/50">
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-700 font-medium">
                          Subtotal:
                        </span>
                        <span className="font-semibold text-slate-900">
                          Rp {getTotalAmount().toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="border-t border-slate-200 pt-3">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span className="text-slate-900">Total:</span>
                        <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent text-xl">
                          Rp {getTotalAmount().toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCreateOrder}
                    disabled={
                      (!selectedTable && orderType === "dine_in") ||
                      isProcessing
                    }
                    className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-white transition-all active:scale-95 text-base ${
                      !selectedTable && orderType === "dine_in"
                        ? "bg-slate-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-blue-500 hover:shadow-lg"
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        Create Order
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div className="text-center py-6 text-slate-600">
                  <p className="text-sm font-medium">No items selected</p>
                </div>
              )}
            </div>
          </>
        ) : (
          // PAYMENT MODE
          <>
            {selectedOrder ? (
              <>
                <div className="p-6 border-b border-slate-200/50">
                  <h3 className="font-bold text-slate-900 mb-4">
                    Payment Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700 font-medium">Order:</span>
                      <span className="font-bold text-slate-900">
                        #{selectedOrder.order_number}
                      </span>
                    </div>
                    {selectedOrder.customer_name && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-700 font-medium">
                          Customer:
                        </span>
                        <span className="font-bold text-slate-900">
                          {selectedOrder.customer_name}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-slate-200 pt-3">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total:</span>
                        <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                          Rp {selectedOrder.total_amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-3">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { id: "cash", label: "Cash", icon: Banknote },
                        {
                          id: "credit_card",
                          label: "Credit Card",
                          icon: CreditCard,
                        },
                        {
                          id: "debit_card",
                          label: "Debit Card",
                          icon: CreditCard,
                        },
                        {
                          id: "digital_wallet",
                          label: "E-Wallet",
                          icon: Smartphone,
                        },
                      ].map((method) => {
                        const Icon = method.icon;
                        return (
                          <button
                            key={method.id}
                            onClick={() => setPaymentMethod(method.id)}
                            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                              paymentMethod === method.id
                                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {method.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Payment Amount */}
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">
                      Amount to Pay
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium text-lg"
                    />
                  </div>

                  {/* Reference Number */}
                  {paymentMethod !== "cash" && (
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">
                        Reference Number
                      </label>
                      <input
                        type="text"
                        placeholder="Transaction reference..."
                        value={referenceNumber}
                        onChange={(e) => setReferenceNumber(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
                      />
                    </div>
                  )}
                </div>

                {/* Payment Button */}
                <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent p-6 border-t border-slate-200/50">
                  <button
                    onClick={handlePayment}
                    disabled={!paymentAmount || isProcessing}
                    className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-white transition-all active:scale-95 text-base ${
                      !paymentAmount
                        ? "bg-slate-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-emerald-600 to-green-600 hover:shadow-lg"
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        Process Payment
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <CreditCard className="w-16 h-16 text-slate-300 mb-4" />
                <p className="text-slate-600 font-semibold">Select an order</p>
                <p className="text-slate-500 text-sm mt-2">
                  from the list to process payment
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
