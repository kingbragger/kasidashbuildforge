import {
  boolean,
  date,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const appRole = pgEnum("app_role", [
  "admin",
  "developer",
  "sales_agent",
  "designer",
  "qa",
  "customer",
]);

export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().unique(),
    employeeId: text("employee_id").notNull().unique(),
    fullName: text("full_name"),
    surname: text("surname"),
    email: text("email").notNull(),
    phone: text("phone"),
    idNumber: text("id_number"),
    avatarUrl: text("avatar_url"),
    bio: text("bio"),
    mustChangePassword: boolean("must_change_password").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("profiles_user_id_idx").on(table.userId)],
);

export const userRoles = pgTable(
  "user_roles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    role: appRole("role").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("user_roles_user_id_role_idx").on(table.userId, table.role)],
);

export const enquiries = pgTable("enquiries", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  businessName: text("business_name"),
  projectType: text("project_type"),
  budgetRange: text("budget_range"),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"),
  assignedTo: uuid("assigned_to"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  assignedTo: uuid("assigned_to"),
  assignedBy: uuid("assigned_by"),
  roleTarget: appRole("role_target"),
  status: text("status").notNull().default("todo"),
  priority: text("priority").notNull().default("normal"),
  dueDate: date("due_date"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const packages = pgTable("packages", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 12, scale: 2, mode: "number" }),
  billingType: text("billing_type").notNull().default("once_off"),
  features: jsonb("features").$type<string[]>().notNull().default([]),
  category: text("category").notNull().default("website_development"),
  active: boolean("active").notNull().default(true),
  featured: boolean("featured").notNull().default(false),
  ctaText: text("cta_text"),
  sortOrder: numeric("sort_order", { mode: "number" }).notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const promotions = pgTable("promotions", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  shortDescription: text("short_description"),
  fullDescription: text("full_description"),
  promoPrice: numeric("promo_price", { precision: 12, scale: 2, mode: "number" }),
  originalPrice: numeric("original_price", { precision: 12, scale: 2, mode: "number" }),
  discountType: text("discount_type"), // "percent" | "amount" | null
  discountValue: numeric("discount_value", { precision: 12, scale: 2, mode: "number" }),
  startsAt: timestamp("starts_at", { withTimezone: true }),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  published: boolean("published").notNull().default(false),
  featured: boolean("featured").notNull().default(false),
  ctaText: text("cta_text"),
  ctaUrl: text("cta_url"),
  imageUrl: text("image_url"),
  category: text("category"),
  placements: jsonb("placements").$type<string[]>().notNull().default(["homepage"]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type QuoteItem = { description: string; packageId?: string | null; unitPrice: number; qty: number };
export type QuotePromotion = {
  id: string; title: string; promoPrice: number | null; discountType: string | null; discountValue: number | null;
};

// Quotations store snapshots (items, promotion) so later package/promotion edits never change them.
export const quotations = pgTable("quotations", {
  id: uuid("id").primaryKey().defaultRandom(),
  quoteNumber: text("quote_number").notNull().unique(),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email"),
  clientPhone: text("client_phone"),
  businessName: text("business_name"),
  enquiryId: uuid("enquiry_id"),
  items: jsonb("items").$type<QuoteItem[]>().notNull().default([]),
  promotion: jsonb("promotion").$type<QuotePromotion | null>(),
  subtotal: numeric("subtotal", { precision: 12, scale: 2, mode: "number" }).notNull().default(0),
  discount: numeric("discount", { precision: 12, scale: 2, mode: "number" }).notNull().default(0),
  total: numeric("total", { precision: 12, scale: 2, mode: "number" }).notNull().default(0),
  notes: text("notes"),
  status: text("status").notNull().default("draft"),
  validUntil: date("valid_until"),
  createdBy: uuid("created_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
