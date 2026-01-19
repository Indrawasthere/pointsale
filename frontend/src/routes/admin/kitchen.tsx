import { createFileRoute } from "@tanstack/react-router";
import { KitchenDisplay } from "@/components/kitchen/NewEnhancedKitchenLayout";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/kitchen")({
  component: AdminKitchenPage,
});

function AdminKitchenPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    window.location.href = "/login";
    return null;
  }

  // Check if user has kitchen access
  const hasKitchenAccess = ["kitchen", "admin", "manager"].includes(user.role);

  if (!hasKitchenAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Access Denied
          </h1>
          <p className="text-slate-600">
            You don't have permission to access the kitchen display.
          </p>
        </div>
      </div>
    );
  }

  return <KitchenDisplay user={user} />;
}
