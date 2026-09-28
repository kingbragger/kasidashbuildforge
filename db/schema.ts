import {
  boolean,
  date,
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
