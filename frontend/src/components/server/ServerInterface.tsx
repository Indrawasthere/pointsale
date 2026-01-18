import { useState } from "react";
import {
  Plus,
  Minus,
  ShoppingCart,
  Users,
  User,
  Check,
  Clock,
  Table2,
  Search,
  LogOut,
  AlertCircle,
  MapPin,
} from "lucide-react";

// Mock data
const mockCategories = [
  { id: "1", name: "Beverages", color: "#3b82f6", icon: "" },
  { id: "2", name: "Main Course", color: "#3b82f6", icon: "" },
  { id: "3", name: "Appetizers", color: "#3b82f6", icon: "" },
  { id: "4", name: "Desserts", color: "#3b82f6", icon: "" },
  { id: "5", name: "Soups", color: "#3b82f6", icon: "" },
];

const mockProducts = [
  {
    id: "1",
    category_id: "1",
    name: "Es Teh Manis",
    price: 5000,
    description: "Refreshing iced tea",
    is_available: true,
    preparation_time: 2,
  },
  {
    id: "2",
    category_id: "1",
    name: "Jus Jeruk",
    price: 8000,
    description: "Freshly squeezed",
    is_available: true,
    preparation_time: 3,
  },
  {
    id: "3",
    category_id: "2",
    name: "Salmon Grilled",
    price: 32000,
    description: "With lemon butter sauce",
    is_available: true,
    preparation_time: 20,
  },
  {
    id: "4",
    category_id: "2",
    name: "Steak Daging",
    price: 50000,
    description: "Medium rare perfection",
    is_available: true,
    preparation_time: 25,
  },
  {
    id: "5",
    category_id: "3",
    name: "Salad Sayur",
    price: 24000,
    description: "Classic caesar with croutons",
    is_available: true,
    preparation_time: 5,
  },
  {
    id: "6",
    category_id: "3",
    name: "Udang Goreng",
    price: 25000,
    description: "Chilled & seasoned",
    is_available: true,
    preparation_time: 8,
  },
  {
    id: "7",
    category_id: "4",
    name: "Kue Coklat",
    price: 20000,
    description: "Rich dark chocolate",
    is_available: true,
    preparation_time: 2,
  },
  {
    id: "8",
    category_id: "4",
    name: "Ice Cream",
    price: 5000,
    description: "Various flavors available",
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
  {
    id: "5",
    table_number: "5",
    seating_capacity: 6,
    location: "VIP Area",
    is_occupied: false,
  },
  {
    id: "6",
    table_number: "6",
    seating_capacity: 6,
    location: "VIP Area",
    is_occupied: true,
  },
  {
    id: "7",
    table_number: "7",
    seating_capacity: 4,
    location: "Outdoor",
    is_occupied: false,
  },
  {
    id: "8",
    table_number: "8",
    seating_capacity: 4,
    location: "Outdoor",
    is_occupied: true,
  },
];

export function ServerInterface() {
  const [selectedCategory, setSelectedCategory] = useState("1");
  const [selectedTable, setSelectedTable] = useState(null);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showTableView, setShowTableView] = useState(false);
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
    if (!selectedTable || cart.length === 0) return;
    setIsProcessing(true);
    setTimeout(() => {
      console.log("Order created:", {
        table: selectedTable,
        items: cart,
        customerName,
        notes: orderNotes,
      });
      setIsProcessing(false);
      setCart([]);
      setSelectedTable(null);
      setCustomerName("");
      setOrderNotes("");
    }, 1500);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* LEFT SIDE - PRODUCTS */}
      <div className="flex-1 flex flex-col overflow-hidden border-r border-slate-200/50">
        {/* Header Section */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
          <div className="p-6 space-y-5">
            {/* Title & Badges */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-black bg-clip-text text-transparent">
                  Server Station
                </h1>
                <p className="text-slate-600 text-sm mt-2">
                  Take orders & manage tables
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-blue-100 text-blue-700 text-xs font-bold rounded-full flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Dine-In
                </div>
                <div className="px-4 py-2 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                  {availableTables.length} Available
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
              />
            </div>

            {/* Category Filter */}
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
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
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
                  {/* Product Body */}
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

                    {/* Price & Time */}
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

                    {/* Add Button */}
                    {!cartItem ? (
                      <button
                        onClick={() => addToCart(product)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all active:scale-95"
                      >
                        <Plus className="w-5 h-5" />
                        Add to Order
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

          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <AlertCircle className="w-16 h-16 text-slate-300 mb-4" />
              <p className="text-slate-600 font-semibold text-lg">
                No products found
              </p>
              <p className="text-slate-500 text-sm mt-2">
                Try searching with different keywords
              </p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE - ORDER SUMMARY */}
      <div className="w-96 flex flex-col bg-white border-l border-slate-200/50 shadow-xl">
        {/* Table Selection Header */}
        <div className="sticky top-0 z-20 bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 rounded-b-3xl">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <Table2 className="w-6 h-6" />
              <h2 className="text-xl font-bold">Select Table</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowTableView(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  !showTableView
                    ? "bg-white/30 backdrop-blur-sm"
                    : "bg-white/20 hover:bg-white/30"
                }`}
              >
                List
              </button>
              <button
                onClick={() => setShowTableView(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  showTableView
                    ? "bg-white/30 backdrop-blur-sm"
                    : "bg-white/20 hover:bg-white/30"
                }`}
              >
                Floor
              </button>
            </div>
          </div>

          {!showTableView ? (
            // List View
            <div className="grid grid-cols-3 gap-2.5">
              {availableTables.slice(0, 9).map((table) => (
                <button
                  key={table.id}
                  onClick={() => setSelectedTable(table)}
                  className={`p-4 rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95 ${
                    selectedTable?.id === table.id
                      ? "bg-white text-blue-600 shadow-lg"
                      : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                  }`}
                >
                  <div className="text-xl font-bold">T{table.table_number}</div>
                  <div className="text-xs mt-1.5 opacity-90">
                    {table.seating_capacity} seats
                  </div>
                </button>
              ))}
            </div>
          ) : (
            // Floor View
            <div className="grid grid-cols-4 gap-2 max-h-56 overflow-y-auto">
              {mockTables.map((table) => (
                <button
                  key={table.id}
                  disabled={table.is_occupied}
                  onClick={() => setSelectedTable(table)}
                  className={`p-3 rounded-xl font-bold transition-all transform ${
                    table.is_occupied
                      ? "bg-red-500/30 text-white/50 cursor-not-allowed"
                      : selectedTable?.id === table.id
                        ? "bg-white text-blue-600 shadow-lg scale-105"
                        : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  <div className="text-lg">T{table.table_number}</div>
                  <div className="text-xs mt-1">{table.seating_capacity}s</div>
                  {table.is_occupied && <div className="text-xs mt-1">✗</div>}
                </button>
              ))}
            </div>
          )}

          {selectedTable && (
            <div className="mt-5 p-4 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4" />
                <div className="font-semibold">
                  Table {selectedTable.table_number}
                </div>
              </div>
              <div className="text-xs text-white/80">
                {selectedTable.seating_capacity} seats •{" "}
                {selectedTable.location}
              </div>
            </div>
          )}
        </div>

        {/* Guest Information */}
        <div className="p-6 border-b border-slate-200/50">
          <label className="block text-sm font-bold text-slate-900 mb-3">
            Guest Name
          </label>
          <input
            type="text"
            placeholder="Enter guest name..."
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium text-sm"
          />
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <ShoppingCart className="w-14 h-14 text-slate-300 mb-4" />
              <p className="text-slate-600 font-semibold">Cart is empty</p>
              <p className="text-slate-500 text-sm mt-2">Add items from menu</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200/50 hover:shadow-md transition-all"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    Rp {item.product.price.toLocaleString()} × {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                  <p className="font-bold text-slate-900 min-w-[80px] text-right">
                    Rp {(item.product.price * item.quantity).toLocaleString()}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
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

        {/* Footer - Summary & Button */}
        <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent p-6 border-t border-slate-200/50 space-y-4">
          {cart.length > 0 ? (
            <>
              <div className="space-y-3 p-5 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-200/50">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-700 font-medium">Subtotal:</span>
                  <span className="font-semibold text-slate-900">
                    Rp {getTotalAmount().toLocaleString()}
                  </span>
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
                disabled={!selectedTable || isProcessing}
                className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-white transition-all active:scale-95 text-base ${
                  !selectedTable
                    ? "bg-slate-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-500 hover:shadow-lg"
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending Order...
                  </>
                ) : !selectedTable ? (
                  <>
                    <AlertCircle className="w-5 h-5" />
                    Select a Table
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Send to Kitchen
                  </>
                )}
              </button>
            </>
          ) : (
            <div className="text-center py-6 text-slate-600">
              <p className="text-sm font-medium">No items selected</p>
              <p className="text-xs mt-2">
                {selectedTable ? "Add items to start" : "Select table to begin"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
