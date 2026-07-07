CREATE TYPE "app_role" AS ENUM('admin', 'developer', 'sales_agent', 'designer', 'qa', 'customer');--> statement-breakpoint
CREATE TABLE "enquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"business_name" text,
	"project_type" text,
	"budget_range" text,
	"message" text NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"assigned_to" uuid,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL UNIQUE,
	"employee_id" text NOT NULL UNIQUE,
	"full_name" text,
	"surname" text,
	"email" text NOT NULL,
	"phone" text,
	"id_number" text,
	"avatar_url" text,
	"bio" text,
	"must_change_password" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" text NOT NULL,
	"description" text,
	"assigned_to" uuid,
	"assigned_by" uuid,
	"role_target" "app_role",
	"status" text DEFAULT 'todo' NOT NULL,
	"priority" text DEFAULT 'normal' NOT NULL,
	"due_date" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"role" "app_role" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "profiles_user_id_idx" ON "profiles" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_roles_user_id_role_idx" ON "user_roles" ("user_id","role");