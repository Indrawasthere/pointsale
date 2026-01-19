import { useState, useEffect, useCallback } from "react";
import apiClient from "@/api/client";
import type { KitchenOrder } from "@/types";
import { useToast } from "@/hooks/use-toast";

export function useKitchenOrders(status?: string) {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchOrders = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);

      const response = await apiClient.getKitchenOrders(status);

      if (response.success) {
        setOrders(response.data || []);
      } else {
        setError(response.message || "Failed to fetch orders");
        toast({
          title: "Error",
          description: response.message || "Failed to fetch orders",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      setError(error.message || "Network error");
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [status, toast]);

  const updateItemStatus = useCallback(
    async (orderId: string, itemId: string, newStatus: string) => {
      try {
        const response = await apiClient.updateOrderItemStatus(
          orderId,
          itemId,
          newStatus,
        );

        if (response.success) {
          toast({
            title: "Success",
            description: `Item status updated to ${newStatus}`,
            variant: "success",
          });

          // Refresh orders after update
          fetchOrders();
          return true;
        } else {
          toast({
            title: "Error",
            description: response.message || "Failed to update item status",
            variant: "destructive",
          });
          return false;
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to update item status",
          variant: "destructive",
        });
        return false;
      }
    },
    [toast, fetchOrders],
  );

  const updateOrderStatus = useCallback(
    async (orderId: string, newStatus: string, notes?: string) => {
      try {
        const response = await apiClient.updateOrderStatus(
          orderId,
          newStatus,
          notes,
        );

        if (response.success) {
          toast({
            title: "Success",
            description: `Order status updated to ${newStatus}`,
            variant: "success",
          });

          // Refresh orders after update
          fetchOrders();
          return true;
        } else {
          toast({
            title: "Error",
            description: response.message || "Failed to update order status",
            variant: "destructive",
          });
          return false;
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to update order status",
          variant: "destructive",
        });
        return false;
      }
    },
    [toast, fetchOrders],
  );

  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Auto-refresh every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrders();
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchOrders]);

  return {
    orders,
    loading,
    refreshing,
    error,
    fetchOrders,
    updateItemStatus,
    updateOrderStatus,
  };
}
