import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
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
  createProductSchema,
  updateProductSchema,
  type CreateProductData,
  type UpdateProductData,
} from "@/lib/form-schemas";
import { toastHelpers } from "@/lib/toast-helpers";
import apiClient from "@/api/client";
import type { Product, Category } from "@/types";
import {
  X,
  Package,
  DollarSign,
  Clock,
  Tag,
  Image,
  Save,
  ArrowLeft,
} from "lucide-react";

interface ProductFormProps {
  product?: Product;
  onSuccess?: () => void;
  onCancel?: () => void;
  mode?: "create" | "edit";
}

export function ProductForm({
  product,
  onSuccess,
  onCancel,
  mode = "create",
}: ProductFormProps) {
  const queryClient = useQueryClient();
  const isEditing = mode === "edit" && product;

  // Fetch categories
  const { data: categoriesResponse, isLoading: loadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => apiClient.getCategories(false),
  });

  const categories = categoriesResponse?.data || [];

  // Choose schema and defaults
  const schema = isEditing ? updateProductSchema : createProductSchema;
  const defaultValues = isEditing
    ? {
        id: product.id,
        name: product.name,
        description: product.description || "",
        price: product.price,
        category_id: product.category_id?.toString() || "",
        image_url: product.image_url || "",
        preparation_time: product.preparation_time || 5,
        is_available: product.is_available !== false,
        sort_order: product.sort_order || 0,
      }
    : {
        name: "",
        description: "",
        price: 0,
        category_id: "",
        image_url: "",
        preparation_time: 5,
        is_available: true,
        sort_order: 0,
      };

  const form = useForm<CreateProductData | UpdateProductData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: CreateProductData) => {
      console.log("📤 Creating product:", data);
      const response = await apiClient.createProduct(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toastHelpers.productCreated(form.getValues("name"));
      onSuccess?.();
    },
    onError: (error) => {
      console.error("❌ Create product error:", error);
      toastHelpers.apiError("Create product", error);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: UpdateProductData) => {
      if (!data.id) throw new Error("Product ID required");
      console.log("📤 Updating product:", data.id, data);
      const response = await apiClient.updateProduct(data.id.toString(), data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toastHelpers.productUpdated(form.getValues("name"));
      onSuccess?.();
    },
    onError: (error) => {
      console.error("❌ Update product error:", error);
      toastHelpers.apiError("Update product", error);
    },
  });

  const onSubmit = (data: CreateProductData | UpdateProductData) => {
    if (isEditing) {
      updateMutation.mutate(data as UpdateProductData);
    } else {
      createMutation.mutate(data as CreateProductData);
    }
  };

  const isLoading =
    createMutation.isPending || updateMutation.isPending || loadingCategories;

  if (loadingCategories) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading categories...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (categories.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Categories Found</h3>
            <p className="text-muted-foreground mb-4">
              You need to create at least one category before adding products.
            </p>
            <Button onClick={onCancel} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Package className="w-6 h-6" />
              {isEditing ? "Edit Product" : "Create New Product"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {isEditing
                ? "Update product information and pricing"
                : "Add a new product to your menu"}
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
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Basic Information
            </h3>

            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="e.g., Nasi Goreng Special"
                disabled={isLoading}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Describe the product..."
                rows={3}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <div className="flex gap-2">
                <Image className="w-5 h-5 text-muted-foreground mt-2" />
                <Input
                  id="image_url"
                  {...form.register("image_url")}
                  placeholder="https://example.com/image.jpg"
                  disabled={isLoading}
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Optional product image URL
              </p>
            </div>
          </div>

          {/* Pricing & Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Pricing & Details
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (Rp) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...form.register("price", { valueAsNumber: true })}
                  placeholder="0.00"
                  disabled={isLoading}
                />
                {form.formState.errors.price && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.price.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="preparation_time">Prep Time (minutes)</Label>
                <div className="flex gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground mt-2" />
                  <Input
                    id="preparation_time"
                    type="number"
                    {...form.register("preparation_time", {
                      valueAsNumber: true,
                    })}
                    min={1}
                    max={120}
                    disabled={isLoading}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category_id">Category *</Label>
                <Select
                  value={form.watch("category_id")?.toString() || ""}
                  onValueChange={(value) => form.setValue("category_id", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat: Category) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.category_id && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.category_id.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="is_available">Availability</Label>
                <Select
                  value={form.watch("is_available") ? "true" : "false"}
                  onValueChange={(value) =>
                    form.setValue("is_available", value === "true")
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
                        Available
                      </div>
                    </SelectItem>
                    <SelectItem value="false">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-600" />
                        Out of Stock
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort_order">Sort Order</Label>
              <Input
                id="sort_order"
                type="number"
                {...form.register("sort_order", { valueAsNumber: true })}
                min={0}
                disabled={isLoading}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">
                Lower numbers appear first in menus
              </p>
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
                  {isEditing ? "Update Product" : "Create Product"}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
