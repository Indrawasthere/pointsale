import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createCategorySchema,
  updateCategorySchema,
  type CreateCategoryData,
  type UpdateCategoryData,
} from "@/lib/form-schemas";
import { toastHelpers } from "@/lib/toast-helpers";
import apiClient from "@/api/client";
import type { Category } from "@/types";
import { Tag, Hash, Palette, Save, ArrowLeft } from "lucide-react";

interface CategoryFormProps {
  category?: Category;
  onSuccess?: () => void;
  onCancel?: () => void;
  mode?: "create" | "edit";
}

const colorOptions = [
  { value: "#FF6B6B", label: "Red", class: "bg-red-500" },
  { value: "#4ECDC4", label: "Teal", class: "bg-teal-500" },
  { value: "#45B7D1", label: "Blue", class: "bg-blue-500" },
  { value: "#96CEB4", label: "Green", class: "bg-green-500" },
  { value: "#FECA57", label: "Yellow", class: "bg-yellow-500" },
  { value: "#FF9FF3", label: "Pink", class: "bg-pink-500" },
  { value: "#A29BFE", label: "Purple", class: "bg-purple-500" },
  { value: "#FD79A8", label: "Rose", class: "bg-rose-500" },
  { value: "#FDCB6E", label: "Orange", class: "bg-orange-500" },
  { value: "#6C5CE7", label: "Indigo", class: "bg-indigo-500" },
];

export function CategoryForm({
  category,
  onSuccess,
  onCancel,
  mode = "create",
}: CategoryFormProps) {
  const queryClient = useQueryClient();
  const isEditing = mode === "edit" && category;

  const schema = isEditing ? updateCategorySchema : createCategorySchema;
  const defaultValues = isEditing
    ? {
        id: category.id,
        name: category.name,
        description: category.description || "",
        color: category.color || "#4ECDC4",
        sort_order: category.sort_order || 0,
        is_active: category.is_active !== false,
      }
    : {
        name: "",
        description: "",
        color: "#4ECDC4",
        sort_order: 0,
        is_active: true,
      };

  const form = useForm<CreateCategoryData | UpdateCategoryData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: CreateCategoryData) => {
      console.log("📤 Creating category:", data);
      const response = await apiClient.createCategory(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toastHelpers.categoryCreated(form.getValues("name"));
      onSuccess?.();
    },
    onError: (error) => {
      console.error("❌ Create category error:", error);
      toastHelpers.apiError("Create category", error);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: UpdateCategoryData) => {
      if (!data.id) throw new Error("Category ID required");
      console.log("📤 Updating category:", data.id, data);
      const response = await apiClient.updateCategory(data.id.toString(), data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toastHelpers.categoryUpdated(form.getValues("name"));
      onSuccess?.();
    },
    onError: (error) => {
      console.error("❌ Update category error:", error);
      toastHelpers.apiError("Update category", error);
    },
  });

  const onSubmit = (data: CreateCategoryData | UpdateCategoryData) => {
    if (isEditing) {
      updateMutation.mutate(data as UpdateCategoryData);
    } else {
      createMutation.mutate(data as CreateCategoryData);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Tag className="w-6 h-6" />
              {isEditing ? "Edit Category" : "Create New Category"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {isEditing
                ? "Update category information and styling"
                : "Add a new category to organize your menu"}
            </p>
          </div>
          {onCancel && (
            <Button variant="outline" onClick={onCancel} disabled={isLoading}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Basic Information
            </h3>

            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="e.g., Appetizers, Main Course, Beverages"
                disabled={isLoading}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.name.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                The name that will appear in menu sections
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Describe this category..."
                rows={3}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Optional description for menu organization
              </p>
            </div>
          </div>

          {/* Appearance */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Appearance
            </h3>

            <div className="space-y-2">
              <Label htmlFor="color">Category Color</Label>
              <Select
                value={form.watch("color") || "#4ECDC4"}
                onValueChange={(value) => form.setValue("color", value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a color" />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded ${color.class}`} />
                        <span>{color.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Color for category badges and visual organization
              </p>
            </div>
          </div>

          {/* Organization */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Hash className="w-5 h-5" />
              Organization
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  {...form.register("sort_order", { valueAsNumber: true })}
                  min={0}
                  max={999}
                  disabled={isLoading}
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground">
                  Lower numbers appear first
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="is_active">Status</Label>
                <Select
                  value={form.watch("is_active") ? "true" : "false"}
                  onValueChange={(value) =>
                    form.setValue("is_active", value === "true")
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-600" />
                        Active
                      </div>
                    </SelectItem>
                    <SelectItem value="false">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-600" />
                        Inactive
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-muted/30 p-4 rounded-lg border">
            <h4 className="font-medium mb-3">Preview:</h4>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium"
              style={{ backgroundColor: form.watch("color") || "#4ECDC4" }}
            >
              <Tag className="w-4 h-4" />
              {form.watch("name") || "Category Name"}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[140px]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEditing ? "Update Category" : "Create Category"}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
