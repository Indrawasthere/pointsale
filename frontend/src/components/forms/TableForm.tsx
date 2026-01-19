import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  createTableSchema,
  updateTableSchema,
  type CreateTableData,
  type UpdateTableData,
} from "@/lib/form-schemas";
import { toastHelpers } from "@/lib/toast-helpers";
import apiClient from "@/api/client";
import type { DiningTable } from "@/types";
import { Grid3X3, Users, MapPin, Save, ArrowLeft } from "lucide-react";

interface TableFormProps {
  table?: any; // Use any to handle both DiningTable and extended version with status
  onSuccess?: () => void;
  onCancel?: () => void;
  mode?: "create" | "edit";
}

export function TableForm({
  table,
  onSuccess,
  onCancel,
  mode = "create",
}: TableFormProps) {
  const queryClient = useQueryClient();
  const isEditing = mode === "edit" && table;

  const schema = isEditing ? updateTableSchema : createTableSchema;
  const defaultValues = isEditing
    ? {
        id: table.id,
        table_number: table.table_number,
        seating_capacity: table.seating_capacity || table.capacity || 4,
        location: table.location || table.location_notes || "",
        is_occupied: table.is_occupied || false,
      }
    : {
        table_number: "",
        seating_capacity: 4,
        location: "",
        is_occupied: false,
      };

  const form = useForm<CreateTableData | UpdateTableData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: CreateTableData) => {
      console.log("📤 Creating table:", data);
      const response = await apiClient.createTable(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tables"] });
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      queryClient.invalidateQueries({ queryKey: ["tables-summary"] });
      toastHelpers.tableCreated(form.getValues("table_number"));
      onSuccess?.();
    },
    onError: (error) => {
      console.error("❌ Create table error:", error);
      toastHelpers.apiError("Create table", error);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: UpdateTableData) => {
      if (!data.id) throw new Error("Table ID required");
      console.log("📤 Updating table:", data.id, data);
      const response = await apiClient.updateTable(data.id.toString(), data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tables"] });
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      queryClient.invalidateQueries({ queryKey: ["tables-summary"] });
      toastHelpers.tableUpdated(form.getValues("table_number"));
      onSuccess?.();
    },
    onError: (error) => {
      console.error("❌ Update table error:", error);
      toastHelpers.apiError("Update table", error);
    },
  });

  const onSubmit = (data: CreateTableData | UpdateTableData) => {
    if (isEditing) {
      updateMutation.mutate(data as UpdateTableData);
    } else {
      createMutation.mutate(data as CreateTableData);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Grid3X3 className="w-6 h-6" />
              {isEditing ? "Edit Table" : "Create New Table"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {isEditing
                ? "Update table information and capacity"
                : "Add a new dining table to your restaurant"}
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
          {/* Table Identification */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Grid3X3 className="w-5 h-5" />
              Table Information
            </h3>

            <div className="space-y-2">
              <Label htmlFor="table_number">Table Number *</Label>
              <Input
                id="table_number"
                {...form.register("table_number")}
                placeholder="e.g., T1, Table 5, A1"
                disabled={isLoading}
              />
              {form.formState.errors.table_number && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.table_number.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Unique identifier for this table
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location/Notes</Label>
              <div className="flex gap-2">
                <MapPin className="w-5 h-5 text-muted-foreground mt-2" />
                <Textarea
                  id="location"
                  {...form.register("location")}
                  placeholder="e.g., By the window, Near kitchen, Private section"
                  rows={2}
                  disabled={isLoading}
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Optional location description or special notes
              </p>
            </div>
          </div>

          {/* Table Capacity */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5" />
              Capacity
            </h3>

            <div className="space-y-2">
              <Label htmlFor="seating_capacity">Number of Seats *</Label>
              <Input
                id="seating_capacity"
                type="number"
                {...form.register("seating_capacity", { valueAsNumber: true })}
                min={1}
                max={20}
                disabled={isLoading}
                placeholder="4"
              />
              {form.formState.errors.seating_capacity && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.seating_capacity.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Maximum seating capacity (1-20 seats)
              </p>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">
              💡 Table Management Tips:
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use clear, consistent numbering (T1, T2, T3...)</li>
              <li>• Group tables by location for easier management</li>
              <li>
                • Set accurate seating capacity for better table assignment
              </li>
              <li>• Add location notes to help staff find tables quickly</li>
            </ul>
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
                  {isEditing ? "Update Table" : "Create Table"}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
