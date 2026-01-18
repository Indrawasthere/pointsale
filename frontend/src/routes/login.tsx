import { createFileRoute, Navigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import apiClient from "@/api/client";
import type { LoginRequest, LoginResponse, APIResponse } from "@/types";
import {
  Eye,
  EyeOff,
  Store,
  Users,
  CreditCard,
  BarChart3,
  ChefHat,
  UserCheck,
  Settings,
} from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginRequest>({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  if (apiClient.isAuthenticated()) {
    return <Navigate to="/" />;
  }

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response: APIResponse<LoginResponse> =
        await apiClient.login(credentials);
      return response;
    },
    onSuccess: (data) => {
      if (data.success && data.data) {
        apiClient.setAuthToken(data.data.token);
        localStorage.setItem("pos_user", JSON.stringify(data.data.user));
        router.navigate({ to: "/" });
      } else {
        setError(data.message || "Login failed");
      }
    },
    onError: (err: any) => {
      setError(err.message || "Login failed");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.username || !formData.password) {
      setError("Username and password are required");
      return;
    }

    loginMutation.mutate(formData);
  };

  const fillDemoCredentials = (username: string, password: string) => {
    setFormData({ username, password });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
      {/* LEFT BRANDING */}
      <div className="hidden lg:flex relative bg-gradient-to-br from-blue-700 to-blue-600 text-white px-16">
        <div className="flex flex-col justify-center max-w-xl">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Store className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold">Orca POS</h1>
          </div>

          <h2 className="text-4xl font-bold leading-tight mb-6">
            Run Your Store
            <br />
            <span className="text-blue-200">Without the Chaos</span>
          </h2>

          <p className="text-blue-100 text-lg mb-10 leading-relaxed">
            Orders, payments, kitchen, reports. Everything synced in real time
            so your team can actually breathe.
          </p>

          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: Users, label: "Staff Control" },
              { icon: CreditCard, label: "Payments" },
              { icon: BarChart3, label: "Analytics" },
              { icon: ChefHat, label: "Kitchen Display" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                  <f.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT LOGIN */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          <Card className="border border-slate-200 shadow-lg rounded-2xl">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-md">
                <Store className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">
                Sign in to Orca POS
              </CardTitle>
              <CardDescription className="text-sm">
                Use demo accounts or login manually
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, username: e.target.value }))
                  }
                  className="h-11"
                  disabled={loginMutation.isPending}
                />

                <div className="relative">
                  <Input
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, password: e.target.value }))
                    }
                    className="h-11 pr-10"
                    disabled={loginMutation.isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              {/* DEMO ACCOUNTS */}
              <div className="pt-4 border-t">
                <div className="text-xs text-slate-500 mb-3">Demo Accounts</div>

                <div className="grid gap-2">
                  {[
                    { u: "server1", r: "Server", i: UserCheck },
                    { u: "counter1", r: "Counter", i: CreditCard },
                    { u: "kitchen1", r: "Kitchen", i: ChefHat },
                    { u: "manager1", r: "Manager", i: BarChart3 },
                    { u: "admin", r: "Admin", i: Settings },
                  ].map((a) => (
                    <button
                      key={a.u}
                      onClick={() => fillDemoCredentials(a.u, "admin123")}
                      className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
                      disabled={loginMutation.isPending}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-slate-100 rounded flex items-center justify-center">
                          <a.i className="w-3 h-3" />
                        </div>
                        <span className="text-sm font-medium">{a.r}</span>
                      </div>
                      <span className="text-xs font-mono text-slate-400">
                        admin123
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
