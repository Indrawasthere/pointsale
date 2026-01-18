import { useState, useEffect } from "react";
import {
  Menu,
  X,
  LogOut,
  Settings,
  LayoutDashboard,
  UserCog,
  Layers,
  Grid3x3,
  BarChart3,
  ShoppingCart,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Mock user data
const mockUser = {
  id: "1",
  username: "admin",
  email: "admin@restaurant.com",
  first_name: "Muhammad",
  last_name: "Fadlan",
  role: "admin",
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const revenueData = {
  today: [
    { label: "09", gross: 120, net: 90 },
    { label: "11", gross: 300, net: 220 },
    { label: "13", gross: 450, net: 360 },
    { label: "15", gross: 380, net: 310 },
    { label: "17", gross: 520, net: 430 },
  ],
  week: [
    { label: "Mon", gross: 1200, net: 980 },
    { label: "Tue", gross: 1800, net: 1400 },
    { label: "Wed", gross: 1500, net: 1200 },
    { label: "Thu", gross: 2100, net: 1750 },
    { label: "Fri", gross: 2600, net: 2100 },
  ],
  month: [
    { label: "W1", gross: 6200, net: 5100 },
    { label: "W2", gross: 7400, net: 6200 },
    { label: "W3", gross: 8100, net: 6900 },
    { label: "W4", gross: 9200, net: 7900 },
  ],
};

const orderStatus = [
  { name: "New", value: 6, color: "#3b82f6" },
  { name: "Cooking", value: 5, color: "#f59e0b" },
  { name: "Ready", value: 3, color: "#10b981" },
];

// Mock sections
const adminSections = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    description: "Overview and statistics",
  },
  {
    id: "staff",
    label: "Manage Staff",
    icon: <UserCog className="w-5 h-5" />,
    description: "User and role management",
  },
  {
    id: "menu",
    label: "Manage Menu",
    icon: <Layers className="w-5 h-5" />,
    description: "Categories and products",
  },
  {
    id: "tables",
    label: "Manage Tables",
    icon: <Grid3x3 className="w-5 h-5" />,
    description: "Dining table setup",
  },
  {
    id: "reports",
    label: "View Reports",
    icon: <BarChart3 className="w-5 h-5" />,
    description: "Sales and analytics",
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="w-5 h-5" />,
    description: "System configuration",
  },
];

// Simple Mock Dashboard Component
const DashboardPreview = () => {
  const [period, setPeriod] = useState("today");

  return (
    <div className="p-8 space-y-8">
      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Orders Today", value: 24 },
          { label: "Revenue", value: "Rp4.350.800" },
          { label: "Active Orders", value: 8 },
          { label: "Tables Used", value: "5 / 8" },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 border border-slate-200"
          >
            <p className="text-sm text-slate-500">{item.label}</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-2">
              {item.value}
            </h3>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LINE CHART */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Revenue Trend
              </h2>
              <p className="text-sm text-slate-500">
                {period.toUpperCase()} overview
              </p>
            </div>

            <div className="flex gap-2">
              {["today", "week", "month"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                    period === p
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 hover:bg-slate-200"
                  }`}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={revenueData[period]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Line dataKey="gross" stroke="#3b82f6" strokeWidth={3} />
              <Line dataKey="net" stroke="#10b981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* PIE */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-6">
            Order Status
          </h2>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={orderStatus} dataKey="value" outerRadius={90} label>
                {orderStatus.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const MenuSection = () => (
  <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-8">
    <h1 className="text-3xl font-bold text-slate-900 mb-2">Menu Management</h1>
    <p className="text-slate-600 mb-6">Manage categories and products</p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        "Beverages",
        "Main Course",
        "Desserts",
        "Appetizers",
        "Soups",
        "Salads",
      ].map((cat, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-6 border border-slate-200/50 hover:shadow-md transition-all"
        >
          <div className="text-5xl mb-4">🍽️</div>
          <h3 className="font-bold text-slate-900">{cat}</h3>
          <p className="text-slate-600 text-sm mt-1">12 items</p>
        </div>
      ))}
    </div>
  </div>
);

const StaffSection = () => (
  <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-8">
    <h1 className="text-3xl font-bold text-slate-900 mb-2">Staff Management</h1>
    <p className="text-slate-600 mb-6">Manage users and roles</p>
    <div className="bg-white rounded-2xl border border-slate-200/50 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">
              Name
            </th>
            <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">
              Role
            </th>
            <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">
              Status
            </th>
            <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {[
            "Muhammad Fadlan",
            "Jane Smith",
            "Mike Johnson",
            "Sarah Wilson",
          ].map((name, i) => (
            <tr
              key={i}
              className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
            >
              <td className="px-6 py-4 text-sm font-medium text-slate-900">
                {name}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">Admin</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  Active
                </span>
              </td>
              <td className="px-6 py-4 text-sm">
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ReportsSection = () => (
  <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-8">
    <h1 className="text-3xl font-bold text-slate-900 mb-2">Reports</h1>
    <p className="text-slate-600 mb-6">Sales and analytics data</p>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[
        "Sales Report",
        "Order Analytics",
        "Revenue Trend",
        "Customer Stats",
      ].map((report, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-6 border border-slate-200/50 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="text-5xl mb-4">📊</div>
          <h3 className="font-bold text-slate-900 text-lg">{report}</h3>
          <p className="text-slate-600 text-sm mt-2">View detailed analytics</p>
        </div>
      ))}
    </div>
  </div>
);

const SettingsSection = () => (
  <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-8">
    <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
    <p className="text-slate-600 mb-6">Configure your restaurant</p>
    <div className="bg-white rounded-2xl border border-slate-200/50 p-8 max-w-2xl">
      <div className="space-y-6">
        {[
          "General Settings",
          "Payment Methods",
          "Tax Configuration",
          "Notification Settings",
        ].map((setting, i) => (
          <div
            key={i}
            className="flex items-center justify-between pb-6 border-b border-slate-100 last:border-0 last:pb-0"
          >
            <div>
              <h3 className="font-semibold text-slate-900">{setting}</h3>
              <p className="text-slate-600 text-sm mt-1">
                Manage {setting.toLowerCase()}
              </p>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all">
              Configure
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const TablesSection = () => (
  <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-8">
    <h1 className="text-3xl font-bold text-slate-900 mb-2">Table Management</h1>
    <p className="text-slate-600 mb-6">Configure dining tables</p>
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-4 border border-slate-200/50 hover:shadow-md transition-all cursor-pointer text-center"
        >
          <div className="text-3xl mb-2">🪑</div>
          <p className="font-bold text-slate-900">Table {i + 1}</p>
          <p className="text-slate-600 text-xs mt-1">4 seats</p>
        </div>
      ))}
    </div>
  </div>
);

export default function AdminLayout() {
  const [currentSection, setCurrentSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleNavClick = (sectionId) => {
    setCurrentSection(sectionId);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    // Handle logout
  };

  const renderContent = () => {
    switch (currentSection) {
      case "dashboard":
        return <DashboardPreview />;
      case "menu":
        return <MenuSection />;
      case "staff":
        return <StaffSection />;
      case "tables":
        return <TablesSection />;
      case "reports":
        return <ReportsSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return <DashboardPreview />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="sticky top-0 p-6 border-b border-slate-700/50 bg-slate-900/95 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">Orca POS</div>
                <div className="text-xs text-slate-400">Admin Panel</div>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {adminSections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleNavClick(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                currentSection === section.id
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
              title={section.label}
            >
              <span className="flex-shrink-0">{section.icon}</span>
              <div className="flex-1 text-left">
                <div className="text-sm font-semibold">{section.label}</div>
                <div className="text-xs opacity-75 hidden sm:block">
                  {section.description}
                </div>
              </div>
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/50 bg-slate-900/95 backdrop-blur-xl space-y-2">
          <div className="px-4 py-3 rounded-lg bg-slate-700/30 border border-slate-600/30">
            <div className="text-sm font-semibold text-white">
              {mockUser.first_name} {mockUser.last_name}
            </div>
            <div className="text-xs text-slate-400 mt-1">{mockUser.email}</div>
            <div className="text-xs text-slate-500 mt-2 px-2 py-1 bg-slate-600/30 rounded w-fit">
              {mockUser.role.charAt(0).toUpperCase() + mockUser.role.slice(1)}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-semibold">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-slate-600" />
            </button>
            <div className="text-2xl font-bold text-slate-900 ml-4 lg:ml-0">
              {adminSections.find((s) => s.id === currentSection)?.label}
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-auto">{renderContent()}</div>
      </div>
    </div>
  );
}
