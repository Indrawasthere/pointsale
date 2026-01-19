import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  MapPin,
  AlertCircle,
  Loader,
  CheckCircle,
  Clock,
  Settings,
} from "lucide-react";
import apiClient from "@/api/client";
import { toastHelpers } from "@/lib/toast-helpers";
import type { DiningTable } from "@/types";

export function AdminTableManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isSearching, setIsSearching] = useState(false);

  const queryClient = useQueryClient();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setIsSearching(false);
    }, 500);
    if (searchTerm !== debouncedSearch) setIsSearching(true);
    return () => clearTimeout(timer);
  }, [searchTerm, debouncedSearch]);

  // Fetch tables
  const {
    data: tablesData,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["tables"],
    queryFn: () => apiClient.getTables().then((res: any) => res.data),
  });

  // Fetch table status for stats
  const { data: statusData, isLoading: isLoadingStatus } = useQuery({
    queryKey: ["table-status"],
    queryFn: () => apiClient.getTableStatus().then((res: any) => res.data),
  });

  // Extract data
  const allTables = Array.isArray(tablesData) ? tablesData : [];

  // Filter tables based on search and status
  const filteredTables = allTables.filter((table: any) => {
    const matchesSearch =
      !debouncedSearch ||
      table.table_number
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase()) ||
      table.location?.toLowerCase().includes(debouncedSearch.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (table.is_occupied && filterStatus === "occupied") ||
      (!table.is_occupied && filterStatus === "available");

    return matchesSearch && matchesStatus;
  });

  // Delete table mutation
  const deleteTableMutation = useMutation({
    mutationFn: (id: string) => apiClient.deleteTable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      queryClient.invalidateQueries({ queryKey: ["table-status"] });
      toastHelpers.apiSuccess("Delete", "Table deleted successfully");
    },
    onError: (error: any) => {
      toastHelpers.apiError("Delete table", error);
    },
  });

  const handleDeleteTable = (table: DiningTable) => {
    if ((table as any).is_occupied) {
      toastHelpers.warning(
        "Cannot Delete Table",
        `Table ${table.table_number} is currently occupied.`,
      );
      return;
    }
    if (
      confirm(`Are you sure you want to delete Table ${table.table_number}?`)
    ) {
      deleteTableMutation.mutate(table.id.toString());
    }
  };

  const getStatusColor = (isOccupied: boolean) => {
    return isOccupied
      ? "bg-blue-100 text-blue-800"
      : "bg-green-100 text-green-800";
  };

  const stats = {
    total: statusData?.total_tables || 0,
    available: statusData?.available_tables || 0,
    occupied: statusData?.occupied_tables || 0,
  };

  const ErrorState = () => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800">Failed to load tables</p>
            <p className="text-sm text-red-700 mt-1">{error?.message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Table Management
          </h2>
          <p className="text-muted-foreground">
            Manage your restaurant's dining tables and seating
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Table
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {isLoadingStatus ? (
          <>
            <Card>
              <CardContent className="pt-6">
                <Loader className="h-8 w-8 animate-spin" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Loader className="h-8 w-8 animate-spin" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Loader className="h-8 w-8 animate-spin" />
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </div>
                <p className="text-xs text-muted-foreground">Total Tables</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.available}
                </div>
                <p className="text-xs text-muted-foreground">Available</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.occupied}
                </div>
                <p className="text-xs text-muted-foreground">Occupied</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Search and Filter */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 min-w-max">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by table number or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
          {isSearching && (
            <div className="absolute right-2 top-2.5">
              <Loader className="h-4 w-4 animate-spin" />
            </div>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filterStatus === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("all")}
          >
            All ({stats.total})
          </Button>
          <Button
            variant={filterStatus === "available" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("available")}
          >
            Available ({stats.available})
          </Button>
          <Button
            variant={filterStatus === "occupied" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("occupied")}
          >
            Occupied ({stats.occupied})
          </Button>
        </div>
      </div>

      {/* Tables Grid */}
      {error ? (
        <ErrorState />
      ) : isLoading ? (
        <div className="flex justify-center py-12">
          <Loader className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : filteredTables.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Settings className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No tables found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {debouncedSearch || filterStatus !== "all"
                  ? "No tables match your filters."
                  : "Get started by adding your first table."}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTables.map((table: any) => (
            <Card
              key={table.id}
              className="hover:shadow-md transition-shadow overflow-hidden"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Table {table.table_number}
                    </CardTitle>
                    <Badge
                      className={`${getStatusColor(table.is_occupied)} gap-1 mt-2`}
                    >
                      {table.is_occupied ? (
                        <>
                          <Clock className="h-3 w-3" />
                          Occupied
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-3 w-3" />
                          Available
                        </>
                      )}
                    </Badge>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    {table.seating_capacity} seats
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {table.location && (
                  <div className="flex items-start gap-2 mb-4">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      {table.location}
                    </span>
                  </div>
                )}

                {table.current_order && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs font-semibold text-blue-900">
                      Active Order
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      #{table.current_order.order_number}
                    </p>
                  </div>
                )}

                <div className="flex gap-2 pt-2 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-1"
                    disabled={isFetching}
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteTable(table)}
                    disabled={
                      deleteTableMutation.isPending ||
                      table.is_occupied ||
                      isFetching
                    }
                    className="flex-1 gap-1 text-red-600 hover:text-red-700 hover:border-red-300"
                  >
                    {deleteTableMutation.isPending ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
