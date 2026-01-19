import { z } from "zod";

// Common validation patterns
export const emailSchema = z.string().email("Invalid email format");
export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters");
export const requiredStringSchema = z.string().min(1, "This field is required");
export const positiveNumberSchema = z
  .number()
  .min(0, "Must be a positive number");
export const priceSchema = z.number().min(0.01, "Price must be greater than 0");

// ==================== USER SCHEMAS ====================
export const userRoles = [
  "admin",
  "manager",
  "server",
  "counter",
  "kitchen",
] as const;
export const userRoleSchema = z.enum(userRoles);

export const createUserSchema = z.object({
  username: requiredStringSchema.min(
    3,
    "Username must be at least 3 characters",
  ),
  email: emailSchema,
  password: passwordSchema,
  first_name: requiredStringSchema,
  last_name: requiredStringSchema,
  role: userRoleSchema,
});

export const updateUserSchema = z.object({
  id: z.string().or(z.number()),
  username: requiredStringSchema
    .min(3, "Username must be at least 3 characters")
    .optional(),
  email: emailSchema.optional(),
  password: passwordSchema.optional(),
  first_name: requiredStringSchema.optional(),
  last_name: requiredStringSchema.optional(),
  role: userRoleSchema.optional(),
});

// ==================== PRODUCT SCHEMAS ====================
export const createProductSchema = z.object({
  name: requiredStringSchema.min(
    2,
    "Product name must be at least 2 characters",
  ),
  description: z.string().optional(),
  price: priceSchema,
  category_id: z.string().or(z.number()),
  image_url: z.string().url().optional().or(z.literal("")),
  preparation_time: z.number().min(0).max(120).default(5),
  is_available: z.boolean().default(true),
  sort_order: z.number().min(0).default(0),
});

export const updateProductSchema = z.object({
  id: z.string().or(z.number()),
  name: requiredStringSchema
    .min(2, "Product name must be at least 2 characters")
    .optional(),
  description: z.string().optional(),
  price: priceSchema.optional(),
  category_id: z.string().or(z.number()).optional(),
  image_url: z.string().url().optional().or(z.literal("")),
  preparation_time: z.number().min(0).max(120).optional(),
  is_available: z.boolean().optional(),
  sort_order: z.number().min(0).optional(),
});

// ==================== CATEGORY SCHEMAS ====================
export const createCategorySchema = z.object({
  name: requiredStringSchema.min(
    2,
    "Category name must be at least 2 characters",
  ),
  description: z.string().optional(),
  color: z.string().optional(),
  sort_order: z.number().min(0).default(0),
  is_active: z.boolean().default(true),
});

export const updateCategorySchema = z.object({
  id: z.string().or(z.number()),
  name: requiredStringSchema
    .min(2, "Category name must be at least 2 characters")
    .optional(),
  description: z.string().optional(),
  color: z.string().optional(),
  sort_order: z.number().min(0).optional(),
  is_active: z.boolean().optional(),
});

// ==================== TABLE SCHEMAS ====================
export const createTableSchema = z.object({
  table_number: requiredStringSchema.min(1, "Table number is required"),
  seating_capacity: z
    .number()
    .min(1, "Table must have at least 1 seat")
    .max(20, "Maximum 20 seats per table"),
  location: z.string().optional(),
  is_occupied: z.boolean().default(false),
});

export const updateTableSchema = z.object({
  id: z.string().or(z.number()),
  table_number: requiredStringSchema
    .min(1, "Table number is required")
    .optional(),
  seating_capacity: z.number().min(1).max(20).optional(),
  location: z.string().optional(),
  is_occupied: z.boolean().optional(),
});

// ==================== ORDER SCHEMAS ====================
export const orderTypeValues = ["dine_in", "takeout", "delivery"] as const;
export const orderTypeSchema = z.enum(orderTypeValues);

export const orderStatusValues = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "served",
  "completed",
  "cancelled",
] as const;
export const orderStatusSchema = z.enum(orderStatusValues);

export const orderItemSchema = z.object({
  product_id: z.number(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  notes: z.string().optional(),
});

export const createOrderSchema = z.object({
  table_id: z.number().optional(),
  customer_name: z.string().optional(),
  order_type: orderTypeSchema,
  notes: z.string().optional(),
  items: z.array(orderItemSchema).min(1, "Order must have at least one item"),
});

// ==================== SETTINGS SCHEMAS ====================
export const posSettingsSchema = z.object({
  restaurant_name: requiredStringSchema,
  address: z.string().optional(),
  phone: z.string().optional(),
  email: emailSchema.optional(),
  tax_rate: z.number().min(0).max(1),
  currency_symbol: requiredStringSchema.default("$"),
  receipt_footer: z.string().optional(),
  auto_print_receipts: z.boolean().default(false),
  order_timeout_minutes: z.number().min(1).max(120).default(30),
});

// ==================== LOGIN SCHEMA ====================
export const loginSchema = z.object({
  username: requiredStringSchema,
  password: requiredStringSchema,
});

// ==================== EXPORT TYPES ====================
export type CreateUserData = z.infer<typeof createUserSchema>;
export type UpdateUserData = z.infer<typeof updateUserSchema>;
export type CreateProductData = z.infer<typeof createProductSchema>;
export type UpdateProductData = z.infer<typeof updateProductSchema>;
export type CreateCategoryData = z.infer<typeof createCategorySchema>;
export type UpdateCategoryData = z.infer<typeof updateCategorySchema>;
export type CreateTableData = z.infer<typeof createTableSchema>;
export type UpdateTableData = z.infer<typeof updateTableSchema>;
export type CreateOrderData = z.infer<typeof createOrderSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type POSSettingsData = z.infer<typeof posSettingsSchema>;
