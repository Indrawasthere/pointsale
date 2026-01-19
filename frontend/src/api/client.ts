import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import type {
  APIResponse,
  PaginatedResponse,
  LoginRequest,
  LoginResponse,
  User,
  Product,
  Category,
  DiningTable,
  Order,
  Payment,
  CreateOrderRequest,
  UpdateOrderStatusRequest,
  ProcessPaymentRequest,
  PaymentSummary,
  DashboardStats,
  SalesReportItem,
  OrdersReportItem,
} from "@/types";

class APIClient {
  private client: AxiosInstance;

  constructor() {
    const apiUrl =
      import.meta.env?.VITE_API_URL || "http://localhost:8080/api/v1";
    console.log("🔧 API Client baseURL:", apiUrl);

    this.client = axios.create({
      baseURL: apiUrl,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("pos_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(
          "📤 API Request:",
          config.method?.toUpperCase(),
          config.url,
        );
        return config;
      },
      (error) => {
        console.error("❌ Request error:", error);
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log("✅ API Response:", response.config.url, response.status);
        return response;
      },
      (error) => {
        console.error(
          "❌ Response error:",
          error.config?.url,
          error.response?.status,
        );
        if (error.response?.status === 401) {
          localStorage.removeItem("pos_token");
          localStorage.removeItem("pos_user");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      },
    );
  }

  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.request(config);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        console.error("API Error:", message);
        throw new Error(message);
      }
      throw error;
    }
  }

  // ==================== AUTH ====================
  async login(credentials: LoginRequest): Promise<APIResponse<LoginResponse>> {
    return this.request({
      method: "POST",
      url: "/auth/login",
      data: credentials,
    });
  }

  async logout(): Promise<APIResponse> {
    return this.request({
      method: "POST",
      url: "/auth/logout",
    });
  }

  async getCurrentUser(): Promise<APIResponse<User>> {
    return this.request({
      method: "GET",
      url: "/auth/me",
    });
  }

  // ==================== USERS (ADMIN) ====================
  async getUsers(): Promise<APIResponse<User[]>> {
    return this.request({
      method: "GET",
      url: "/admin/users",
    });
  }

  async createUser(
    userData: Partial<User> & { password: string },
  ): Promise<APIResponse<User>> {
    return this.request({
      method: "POST",
      url: "/admin/users",
      data: userData,
    });
  }

  async updateUser(
    id: string,
    userData: Partial<User>,
  ): Promise<APIResponse<User>> {
    return this.request({
      method: "PUT",
      url: `/admin/users/${id}`,
      data: userData,
    });
  }

  async deleteUser(id: string): Promise<APIResponse> {
    return this.request({
      method: "DELETE",
      url: `/admin/users/${id}`,
    });
  }

  // ==================== PRODUCTS ====================
  async getProducts(params?: any): Promise<any> {
    return this.request({
      method: "GET",
      url: "/products",
      params,
    });
  }

  async getProduct(id: string): Promise<APIResponse<Product>> {
    return this.request({
      method: "GET",
      url: `/products/${id}`,
    });
  }

  async getAdminProducts(params?: any): Promise<any> {
    return this.request({
      method: "GET",
      url: "/admin/products",
      params,
    });
  }

  async createProduct(productData: any): Promise<APIResponse<Product>> {
    return this.request({
      method: "POST",
      url: "/admin/products",
      data: productData,
    });
  }

  async updateProduct(
    id: string,
    productData: any,
  ): Promise<APIResponse<Product>> {
    return this.request({
      method: "PUT",
      url: `/admin/products/${id}`,
      data: productData,
    });
  }

  async deleteProduct(id: string): Promise<APIResponse> {
    return this.request({
      method: "DELETE",
      url: `/admin/products/${id}`,
    });
  }

  // ==================== CATEGORIES ====================
  async getCategories(activeOnly = true): Promise<APIResponse<Category[]>> {
    return this.request({
      method: "GET",
      url: "/categories",
      params: { active_only: activeOnly },
    });
  }

  async getAdminCategories(params?: any): Promise<any> {
    return this.request({
      method: "GET",
      url: "/admin/categories",
      params,
    });
  }

  async createCategory(categoryData: any): Promise<APIResponse<Category>> {
    return this.request({
      method: "POST",
      url: "/admin/categories",
      data: categoryData,
    });
  }

  async updateCategory(
    id: string,
    categoryData: any,
  ): Promise<APIResponse<Category>> {
    return this.request({
      method: "PUT",
      url: `/admin/categories/${id}`,
      data: categoryData,
    });
  }

  async deleteCategory(id: string): Promise<APIResponse> {
    return this.request({
      method: "DELETE",
      url: `/admin/categories/${id}`,
    });
  }

  async getProductsByCategory(
    categoryId: string,
    availableOnly = true,
  ): Promise<APIResponse<Product[]>> {
    return this.request({
      method: "GET",
      url: `/categories/${categoryId}/products`,
      params: { available_only: availableOnly },
    });
  }

  // ==================== TABLES ====================
  async getTables(params?: any): Promise<APIResponse<DiningTable[]>> {
    return this.request({
      method: "GET",
      url: "/tables",
      params,
    });
  }

  async getTable(id: string): Promise<APIResponse<DiningTable>> {
    return this.request({
      method: "GET",
      url: `/tables/${id}`,
    });
  }

  async getAdminTables(params?: any): Promise<any> {
    return this.request({
      method: "GET",
      url: "/admin/tables",
      params,
    });
  }

  async createTable(tableData: any): Promise<APIResponse<DiningTable>> {
    return this.request({
      method: "POST",
      url: "/admin/tables",
      data: tableData,
    });
  }

  async updateTable(
    id: string,
    tableData: any,
  ): Promise<APIResponse<DiningTable>> {
    return this.request({
      method: "PUT",
      url: `/admin/tables/${id}`,
      data: tableData,
    });
  }

  async deleteTable(id: string): Promise<APIResponse> {
    return this.request({
      method: "DELETE",
      url: `/admin/tables/${id}`,
    });
  }

  async getTablesByLocation(): Promise<APIResponse<any[]>> {
    return this.request({
      method: "GET",
      url: "/tables/by-location",
    });
  }

  async getTableStatus(): Promise<APIResponse<any>> {
    return this.request({
      method: "GET",
      url: "/tables/status",
    });
  }
  // ==================== KITCHEN ORDERS ====================
  async getKitchenOrders(
    status?: string,
  ): Promise<APIResponse<KitchenOrder[]>> {
    return this.request<APIResponse<KitchenOrder[]>>({
      method: "GET",
      url: "/kitchen/orders",
      params: status && status !== "all" ? { status } : {},
    });
  }

  async updateOrderItemStatus(
    orderId: string,
    itemId: string,
    status: string,
  ): Promise<APIResponse> {
    return this.request<APIResponse>({
      method: "PATCH",
      url: `/kitchen/orders/${orderId}/items/${itemId}/status`,
      data: { status },
    });
  }

  async updateKitchenOrderStatus(
    orderId: string,
    status: string,
    notes?: string,
  ): Promise<APIResponse<Order>> {
    return this.request<APIResponse<Order>>({
      method: "PATCH",
      url: `/orders/${orderId}/status`,
      data: { status, notes: notes || "Kitchen update" },
    });
  }

  // ==================== ORDERS ====================
  async getOrders(params?: any): Promise<any> {
    return this.request({
      method: "GET",
      url: "/orders",
      params,
    });
  }

  async getOrder(id: string): Promise<APIResponse<Order>> {
    return this.request({
      method: "GET",
      url: `/orders/${id}`,
    });
  }

  async createOrder(
    orderData: CreateOrderRequest,
  ): Promise<APIResponse<Order>> {
    return this.request({
      method: "POST",
      url: "/orders",
      data: orderData,
    });
  }

  async updateOrderStatus(
    id: string,
    status: string,
    notes?: string,
  ): Promise<APIResponse<Order>> {
    return this.request({
      method: "PATCH",
      url: `/orders/${id}/status`,
      data: { status, notes },
    });
  }

  // ==================== KITCHEN ====================
  async getKitchenOrders(status?: string): Promise<APIResponse<Order[]>> {
    return this.request({
      method: "GET",
      url: "/kitchen/orders",
      params: status && status !== "all" ? { status } : {},
    });
  }

  async updateOrderItemStatus(
    orderId: string,
    itemId: string,
    status: string,
  ): Promise<APIResponse> {
    return this.request({
      method: "PATCH",
      url: `/kitchen/orders/${orderId}/items/${itemId}/status`,
      data: { status },
    });
  }

  // ==================== PAYMENTS ====================
  async processPayment(
    orderId: string,
    payment: ProcessPaymentRequest,
  ): Promise<APIResponse<Payment>> {
    return this.request({
      method: "POST",
      url: `/orders/${orderId}/payments`,
      data: payment,
    });
  }

  async getPayments(orderId: string): Promise<APIResponse<Payment[]>> {
    return this.request({
      method: "GET",
      url: `/orders/${orderId}/payments`,
    });
  }

  async getPaymentSummary(
    orderId: string,
  ): Promise<APIResponse<PaymentSummary>> {
    return this.request({
      method: "GET",
      url: `/orders/${orderId}/payment-summary`,
    });
  }

  // ==================== ROLE-SPECIFIC ====================
  async createServerOrder(
    order: CreateOrderRequest,
  ): Promise<APIResponse<Order>> {
    return this.request({
      method: "POST",
      url: "/server/orders",
      data: order,
    });
  }

  async createCounterOrder(
    order: CreateOrderRequest,
  ): Promise<APIResponse<Order>> {
    return this.request({
      method: "POST",
      url: "/counter/orders",
      data: order,
    });
  }

  async processCounterPayment(
    orderId: string,
    payment: ProcessPaymentRequest,
  ): Promise<APIResponse<Payment>> {
    return this.request({
      method: "POST",
      url: `/counter/orders/${orderId}/payments`,
      data: payment,
    });
  }

  // ==================== DASHBOARD & REPORTS ====================
  async getDashboardStats(): Promise<APIResponse<DashboardStats>> {
    return this.request({
      method: "GET",
      url: "/admin/dashboard/stats",
    });
  }

  async getSalesReport(
    period: "today" | "week" | "month" = "today",
  ): Promise<APIResponse<SalesReportItem[]>> {
    return this.request({
      method: "GET",
      url: "/admin/reports/sales",
      params: { period },
    });
  }

  async getOrdersReport(): Promise<APIResponse<OrdersReportItem[]>> {
    return this.request({
      method: "GET",
      url: "/admin/reports/orders",
    });
  }

  async getIncomeReport(
    period: "today" | "week" | "month" | "year" = "today",
  ): Promise<APIResponse<any>> {
    return this.request({
      method: "GET",
      url: "/admin/reports/income",
      params: { period },
    });
  }

  // ==================== UTILITIES ====================
  setAuthToken(token: string): void {
    localStorage.setItem("pos_token", token);
  }

  clearAuth(): void {
    localStorage.removeItem("pos_token");
    localStorage.removeItem("pos_user");
  }

  getAuthToken(): string | null {
    return localStorage.getItem("pos_token");
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

export const apiClient = new APIClient();
export default apiClient;
