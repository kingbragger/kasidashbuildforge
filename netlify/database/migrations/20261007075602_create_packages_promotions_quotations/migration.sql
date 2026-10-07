CREATE TABLE "packages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"description" text,
	"price" numeric(12,2),
	"billing_type" text DEFAULT 'once_off' NOT NULL,
	"features" jsonb DEFAULT '[]' NOT NULL,
	"category" text DEFAULT 'website_development' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"cta_text" text,
	"sort_order" numeric DEFAULT '0' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "promotions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" text NOT NULL,
	"short_description" text,
	"full_description" text,
	"promo_price" numeric(12,2),
	"original_price" numeric(12,2),
	"discount_type" text,
	"discount_value" numeric(12,2),
	"starts_at" timestamp with time zone,
	"ends_at" timestamp with time zone,
	"published" boolean DEFAULT false NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"cta_text" text,
	"cta_url" text,
	"image_url" text,
	"category" text,
	"placements" jsonb DEFAULT '["homepage"]' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quotations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"quote_number" text NOT NULL UNIQUE,
	"client_name" text NOT NULL,
	"client_email" text,
	"client_phone" text,
	"business_name" text,
	"enquiry_id" uuid,
	"items" jsonb DEFAULT '[]' NOT NULL,
	"promotion" jsonb,
	"subtotal" numeric(12,2) DEFAULT '0' NOT NULL,
	"discount" numeric(12,2) DEFAULT '0' NOT NULL,
	"total" numeric(12,2) DEFAULT '0' NOT NULL,
	"notes" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"valid_until" date,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
INSERT INTO "packages" ("name","description","price","billing_type","features","category","featured","cta_text","sort_order") VALUES
('Starter','A clean one-page site to get your business online.',2500,'once_off','["Single page website","Mobile responsive design","Contact form & WhatsApp button","Basic SEO setup","Domain name & business email setup available at a fee","Delivered in 5 to 7 days"]','website_development',false,'Start with Starter',1),
('Business','A polished multi-page site for growing businesses.',6500,'once_off','["Up to 6 pages","Custom design & branding","Blog or news section","Google Analytics & SEO","Contact & booking forms","1 month free support"]','website_development',true,'Choose Business',2),
('E-commerce','Sell products or services online with a full store.',12500,'from','["Full product catalogue","Secure card & EFT payments","Order & stock management","Customer accounts","Shipping & delivery zones","Admin dashboard"]','website_development',false,'Launch a Store',3),
('Custom','Bespoke web platforms, dashboards and integrations.',NULL,'quote','["Discovery workshop","Custom architecture","Third-party integrations","User roles & permissions","Dedicated project manager","Long-term partnership"]','custom_services',false,'Enquire for Pricing',4);
