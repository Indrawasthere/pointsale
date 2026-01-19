import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, User, Mail, Lock, Shield } from "lucide-react";
import apiClient from "@/api/client";
import { toastHelpers } from "@/lib/toast-helpers";
import type { User } from "@/types";

// ✅ Validation Schema
const userSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  role: z.enum(["admin", "manager", "server", "counter", "kitchen"]),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  user?: User;
  mode: "create" | "edit";
  onSuccess: () => void;
  onCancel: () => void;
}

export function UserForm({ user, mode, onSuccess, onCancel }: UserFormProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: user
      ? {
          username: user.username,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role as any,
        }
      : {
          role: "server",
        },
  });

  const selectedRole = watch("role");

  // ✅ CREATE Mutation
  const createMutation = useMutation({
    mutationFn: async (data: UserFormData) => {
      console.log("📤 Creating user:", data);
      const response = await apiClient.createUser(data as any);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toastHelpers.userCreated(response.data?.username || "New User");
      onSuccess();
    },
    onError: (error: any) => {
      console.error("❌ Create user error:", error);
      toastHelpers.apiError("Create user", error);
    },
  });

  // ✅ UPDATE Mutation
  const updateMutation = useMutation({
    mutationFn: async (data: UserFormData) => {
      if (!user?.id) throw new Error("User ID is required for update");
      console.log("📤 Updating user:", user.id, data);

      // Only send password if it's provided
      const updateData: any = { ...data };
      if (!updateData.password) {
        delete updateData.password;
      }

      const response = await apiClient.updateUser(user.id, updateData);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toastHelpers.success(
        "User Updated",
        `${response.data?.first_name} ${response.data?.last_name} has been updated successfully.`,
      );
      onSuccess();
    },
    onError: (error: any) => {
      console.error("❌ Update user error:", error);
      toastHelpers.apiError("Update user", error);
    },
  });

  const onSubmit = async (data: UserFormData) => {
    if (mode === "create") {
      createMutation.mutate(data);
    } else {
      updateMutation.mutate(data);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "text-red-600 bg-red-50 border-red-200";
      case "manager":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "server":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "counter":
        return "text-green-600 bg-green-50 border-green-200";
      case "kitchen":
        return "text-orange-600 bg-orange-50 border-orange-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl flex items-center gap-2">
                <User className="w-6 h-6" />
                {mode === "create"
                  ? "Add New Staff Member"
                  : "Edit Staff Member"}
              </CardTitle>
              <CardDescription>
                {mode === "create"
                  ? "Create a new staff account with role-based permissions"
                  : "Update staff member information and permissions"}
              </CardDescription>
            </div>
            <Button variant="outline" onClick={onCancel} disabled={isPending}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    {...register("first_name")}
                    placeholder="John"
                    disabled={isPending}
                  />
                  {errors.first_name && (
                    <p className="text-sm text-red-600">
                      {errors.first_name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    {...register("last_name")}
                    placeholder="Doe"
                    disabled={isPending}
                  />
                  {errors.last_name && (
                    <p className="text-sm text-red-600">
                      {errors.last_name.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Account Information
              </h3>

              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  {...register("username")}
                  placeholder="johndoe"
                  disabled={isPending}
                />
                {errors.username && (
                  <p className="text-sm text-red-600">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="john.doe@restaurant.com"
                  disabled={isPending}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  Password{" "}
                  {mode === "edit" ? "(leave empty to keep current)" : "*"}
                </Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  placeholder={
                    mode === "edit"
                      ? "Enter new password to change"
                      : "Minimum 6 characters"
                  }
                  disabled={isPending}
                />
                {errors.password && (
                  <p className="text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {/* Role & Permissions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Role & Permissions
              </h3>

              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={selectedRole}
                  onValueChange={(value) => setValue("role", value as any)}
                  disabled={isPending}
                >
                  <SelectTrigger
                    className={`${getRoleColor(selectedRole || "server")}`}
                  >
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-600" />
                        <span>Admin</span>
                        <span className="text-xs text-muted-foreground">
                          - Full system access
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="manager">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-600" />
                        <span>Manager</span>
                        <span className="text-xs text-muted-foreground">
                          - Management & reports
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="server">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-600" />
                        <span>Server</span>
                        <span className="text-xs text-muted-foreground">
                          - Dine-in orders only
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="counter">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-600" />
                        <span>Counter</span>
                        <span className="text-xs text-muted-foreground">
                          - All orders & payments
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="kitchen">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-600" />
                        <span>Kitchen</span>
                        <span className="text-xs text-muted-foreground">
                          - Order preparation
                        </span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-sm text-red-600">{errors.role.message}</p>
                )}
              </div>

              {/* Role Description */}
              <div
                className={`p-4 rounded-lg border ${getRoleColor(selectedRole || "server")}`}
              >
                <p className="text-sm font-medium mb-2">Role Permissions:</p>
                <ul className="text-sm space-y-1">
                  {selectedRole === "admin" && (
                    <>
                      <li>✓ Full system access and management</li>
                      <li>✓ User and staff management</li>
                      <li>✓ All reports and analytics</li>
                      <li>✓ System settings configuration</li>
                    </>
                  )}
                  {selectedRole === "manager" && (
                    <>
                      <li>✓ View all reports and analytics</li>
                      <li>✓ Monitor all operations</li>
                      <li>✓ Access all interfaces</li>
                      <li>✗ Cannot manage users</li>
                    </>
                  )}
                  {selectedRole === "server" && (
                    <>
                      <li>✓ Create dine-in orders only</li>
                      <li>✓ Table management</li>
                      <li>✗ Cannot process payments</li>
                      <li>✗ No access to reports</li>
                    </>
                  )}
                  {selectedRole === "counter" && (
                    <>
                      <li>✓ Create all order types</li>
                      <li>✓ Process payments</li>
                      <li>✓ Manage transactions</li>
                      <li>✗ No access to reports</li>
                    </>
                  )}
                  {selectedRole === "kitchen" && (
                    <>
                      <li>✓ View kitchen orders</li>
                      <li>✓ Update order status</li>
                      <li>✓ Manage preparation</li>
                      <li>✗ Cannot create orders</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="min-w-[120px]"
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </div>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {mode === "create" ? "Create Staff" : "Update Staff"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
