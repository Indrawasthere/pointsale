import { useState, useEffect } from "react";
import { Outlet, useLocation } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  UserCog,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  BarChart3,
  Users,
  CreditCard,
  ChefHat,
  Grid3x3,
  Layers,
  ShoppingCart,
} from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import type { User } from "@/types";
import apiClient from "@/api/client";

interface AdminLayoutProps {
  user: User;
}

export default function AdminLayout({ user }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Responsive handling
  useEffect(() => {
    const checkScreenSize = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);

      // Auto-collapse on mobile
      if (isMobileView) {
        setSidebarCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Get page title from route
  const getPageTitle = () => {
    const pathname = location.pathname;

    if (pathname.includes("dashboard")) return "Dashboard";
    if (pathname.includes("server")) return "Server Interface";
    if (pathname.includes("counter")) return "Counter/Checkout";
    if (pathname.includes("kitchen")) return "Kitchen Display";
    if (pathname.includes("staff")) return "Staff Management";
    if (pathname.includes("menu")) return "Menu Management";
    if (pathname.includes("tables")) return "Table Management";
    if (pathname.includes("reports")) return "Reports & Analytics";
    if (pathname.includes("settings")) return "Settings";

    return "Admin Panel";
  };

  // Get page description from route
  const getPageDescription = () => {
    const pathname = location.pathname;

    if (pathname.includes("dashboard"))
      return "Overview and real-time statistics";
    if (pathname.includes("server"))
      return "Server-facing order interface for dine-in orders";
    if (pathname.includes("counter"))
      return "Payment processing and checkout counter";
    if (pathname.includes("kitchen"))
      return "Kitchen display system for order preparation";
    if (pathname.includes("staff"))
      return "Manage your restaurant staff and permissions";
    if (pathname.includes("menu"))
      return "Manage products, categories, and pricing";
    if (pathname.includes("tables"))
      return "Manage dining tables and seating arrangements";
    if (pathname.includes("reports"))
      return "Sales reports and detailed analytics";
    if (pathname.includes("settings"))
      return "System configuration and preferences";

    return "Restaurant management system";
  };

  const handleLogout = () => {
    apiClient.clearAuth();
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar user={user} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-card border-b border-border shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 md:px-6">
            {/* Left Side - Menu Toggle + Title */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="h-8 w-8 p-0 md:hidden"
              >
                {sidebarCollapsed ? (
                  <Menu className="h-5 w-5" />
                ) : (
                  <X className="h-5 w-5" />
                )}
              </Button>

              {/* Page Title */}
              <div className="min-w-0">
                <h1 className="text-lg md:text-2xl font-bold truncate">
                  {getPageTitle()}
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground truncate hidden sm:block">
                  {getPageDescription()}
                </p>
              </div>
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Quick Actions */}
              <div className="hidden lg:flex items-center gap-2">
                <Button variant="ghost" size="sm" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden xl:inline">Analytics</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="hidden xl:inline">Settings</span>
                </Button>
              </div>

              {/* Divider */}
              <div className="h-6 w-px bg-border hidden md:block" />

              {/* User Info & Logout */}
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 text-right">
                  <div className="text-sm">
                    <p className="font-medium text-foreground">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {user.role}
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0 md:w-auto md:px-3"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden md:inline text-xs">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
