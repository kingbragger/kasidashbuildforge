import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

// Packages, promotions and quotations live in Netlify Database. Staff auth stays on the
// existing login; every admin/sales call re-checks the caller's role on the server.

async function getDb() {
  const [{ db }, schema, orm] = await Promise.all([
    import("../../db/index"),
    import("../../db/schema"),
    import("drizzle-orm"),
  ]);
  return { db, ...schema, orm };
}

type AuthCtx = { supabase: any; userId: string };

async function requireRole(context: AuthCtx, allowed: string[]) {
  const { data } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId);
  const roles = ((data ?? []) as Array<{ role: string }>).map((r) => r.role);
  if (!roles.some((r) => allowed.includes(r))) throw new Error("Forbidden");
  return roles;
}

export const PACKAGE_CATEGORIES = {
  website_development: "Website Development",
  app_development: "App Development",
  business_automation: "Business Automation",
  ai_automation: "AI Automation",
  maintenance: "Maintenance",
  custom_services: "Custom Services",
} as const;

export const BILLING_TYPES = {
  once_off: "once off",
  from: "from",
  monthly: "per month",
  annual: "per year",
  hourly: "per hour",
  quote: "for pricing",
} as const;

export const PROMO_PLACEMENTS = {
  homepage: "Homepage promotions section",
  banner: "Top promotional banner",
  pricing: "Pricing section",
} as const;

const money = z.coerce.number().min(0).max(100_000_000).nullable().optional();
const optText = (max: number) => z.string().max(max).nullable().optional();

// ---------- Public ----------

export const listPublicPackages = createServerFn({ method: "GET" }).handler(async () => {
  const { db, packages, orm } = await getDb();
  return db.select().from(packages).where(orm.eq(packages.active, true)).orderBy(orm.asc(packages.sortOrder), orm.asc(packages.createdAt));
});

export const listPublicPromotions = createServerFn({ method: "GET" }).handler(async () => {
  const { db, promotions, orm } = await getDb();
  const now = new Date();
  const { and, eq, or, isNull, lte, gt, desc } = orm;
  // Scheduled (future start), expired, and unpublished promotions are never returned.
  return db
    .select()
    .from(promotions)
    .where(
      and(
        eq(promotions.published, true),
        or(isNull(promotions.startsAt), lte(promotions.startsAt, now)),
        or(isNull(promotions.endsAt), gt(promotions.endsAt, now)),
      ),
    )
    .orderBy(desc(promotions.featured), desc(promotions.createdAt));
});

// ---------- Packages (admin) ----------

const PackageInput = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(120),
  description: optText(1000),
  price: money,
  billingType: z.enum(Object.keys(BILLING_TYPES) as [keyof typeof BILLING_TYPES]),
  features: z.array(z.string().max(200)).max(30),
  category: z.enum(Object.keys(PACKAGE_CATEGORIES) as [keyof typeof PACKAGE_CATEGORIES]),
  active: z.boolean(),
  featured: z.boolean(),
  ctaText: optText(60),
  sortOrder: z.coerce.number().int().min(0).max(9999),
});

export const adminListPackages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    // Sales can read packages to build quotations; only admins can change them.
    await requireRole(context, ["admin", "sales_agent"]);
    const { db, packages, orm } = await getDb();
    return db.select().from(packages).orderBy(orm.asc(packages.sortOrder), orm.asc(packages.createdAt));
  });

export const savePackage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => PackageInput.parse(d))
  .handler(async ({ data, context }) => {
    await requireRole(context, ["admin"]);
    const { db, packages, orm } = await getDb();
    const { id, ...values } = data;
    const row = { ...values, price: values.price ?? null, description: values.description ?? null, ctaText: values.ctaText ?? null };
    if (id) {
      await db.update(packages).set({ ...row, updatedAt: new Date() }).where(orm.eq(packages.id, id));
    } else {
      await db.insert(packages).values(row);
    }
    return { success: true };
  });

export const deletePackage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await requireRole(context, ["admin"]);
    const { db, packages, orm } = await getDb();
    await db.delete(packages).where(orm.eq(packages.id, data.id));
    return { success: true };
  });

// ---------- Promotions (admin) ----------

const PromotionInput = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(160),
  shortDescription: optText(300),
  fullDescription: optText(4000),
  promoPrice: money,
  originalPrice: money,
  discountType: z.enum(["percent", "amount"]).nullable().optional(),
  discountValue: money,
  startsAt: z.string().nullable().optional(),
  endsAt: z.string().nullable().optional(),
  published: z.boolean(),
  featured: z.boolean(),
  ctaText: optText(60),
  ctaUrl: optText(500),
  imageUrl: z.string().url().max(1000).nullable().optional().or(z.literal("")),
  category: optText(60),
  placements: z.array(z.enum(Object.keys(PROMO_PLACEMENTS) as [keyof typeof PROMO_PLACEMENTS])).max(3),
});

function toDate(v: string | null | undefined) {
  if (!v) return null;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) throw new Error("Invalid date");
  return d;
}

export const adminListPromotions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireRole(context, ["admin", "sales_agent"]);
    const { db, promotions, orm } = await getDb();
    return db.select().from(promotions).orderBy(orm.desc(promotions.createdAt));
  });

export const savePromotion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => PromotionInput.parse(d))
  .handler(async ({ data, context }) => {
    await requireRole(context, ["admin"]);
    const { db, promotions, orm } = await getDb();
    const { id, ...v } = data;
    const startsAt = toDate(v.startsAt);
    const endsAt = toDate(v.endsAt);
    if (startsAt && endsAt && endsAt <= startsAt) throw new Error("End date must be after the start date");
    const row = {
      ...v,
      shortDescription: v.shortDescription || null,
      fullDescription: v.fullDescription || null,
      promoPrice: v.promoPrice ?? null,
      originalPrice: v.originalPrice ?? null,
      discountType: v.discountType ?? null,
      discountValue: v.discountType ? (v.discountValue ?? null) : null,
      ctaText: v.ctaText || null,
      ctaUrl: v.ctaUrl || null,
      imageUrl: v.imageUrl || null,
      category: v.category || null,
      startsAt,
      endsAt,
    };
    if (id) {
      await db.update(promotions).set({ ...row, updatedAt: new Date() }).where(orm.eq(promotions.id, id));
    } else {
      await db.insert(promotions).values(row);
    }
    return { success: true };
  });

export const setPromotionPublished = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid(), published: z.boolean() }).parse(d))
  .handler(async ({ data, context }) => {
    await requireRole(context, ["admin"]);
    const { db, promotions, orm } = await getDb();
    await db.update(promotions).set({ published: data.published, updatedAt: new Date() }).where(orm.eq(promotions.id, data.id));
    return { success: true };
  });

export const deletePromotion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await requireRole(context, ["admin"]);
    const { db, promotions, orm } = await getDb();
    await db.delete(promotions).where(orm.eq(promotions.id, data.id));
    return { success: true };
  });

// ---------- Quotations (admin + sales) ----------

const QuotationInput = z.object({
  clientName: z.string().min(1).max(160),
  clientEmail: z.string().email().max(200).nullable().optional().or(z.literal("")),
  clientPhone: optText(40),
  businessName: optText(160),
  enquiryId: z.string().uuid().nullable().optional(),
  items: z
    .array(
      z.object({
        packageId: z.string().uuid().nullable().optional(),
        description: z.string().max(300).optional(),
        unitPrice: z.coerce.number().min(0).max(100_000_000).optional(),
        qty: z.coerce.number().int().min(1).max(1000),
      }),
    )
    .max(50),
  promotionId: z.string().uuid().nullable().optional(),
  notes: optText(4000),
  validUntil: z.string().nullable().optional(),
});

const round2 = (n: number) => Math.round(n * 100) / 100;

export const listQuotations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireRole(context, ["admin", "sales_agent"]);
    const { db, quotations, orm } = await getDb();
    return db.select().from(quotations).orderBy(orm.desc(quotations.createdAt));
  });

export const createQuotation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => QuotationInput.parse(d))
  .handler(async ({ data, context }) => {
    await requireRole(context, ["admin", "sales_agent"]);
    const { db, packages, promotions, quotations, orm } = await getDb();

    // Package lines always use the package's current price from the database (never the client's),
    // and are copied into the quotation so later price changes don't affect it.
    const pkgIds = data.items.map((i) => i.packageId).filter((x): x is string => !!x);
    const pkgRows = pkgIds.length ? await db.select().from(packages).where(orm.inArray(packages.id, pkgIds)) : [];
    const pkgById = new Map(pkgRows.map((p) => [p.id, p]));

    const items = data.items.map((i) => {
      if (i.packageId) {
        const p = pkgById.get(i.packageId);
        if (!p) throw new Error("Selected package no longer exists");
        return { description: p.name, packageId: p.id, unitPrice: Number(p.price ?? 0), qty: i.qty };
      }
      if (!i.description) throw new Error("Custom line items need a description");
      return { description: i.description, packageId: null, unitPrice: Number(i.unitPrice ?? 0), qty: i.qty };
    });

    let promotion = null;
    if (data.promotionId) {
      const [p] = await db.select().from(promotions).where(orm.eq(promotions.id, data.promotionId));
      if (!p) throw new Error("Selected promotion no longer exists");
      promotion = {
        id: p.id,
        title: p.title,
        promoPrice: p.promoPrice == null ? null : Number(p.promoPrice),
        discountType: p.discountType,
        discountValue: p.discountValue == null ? null : Number(p.discountValue),
      };
      if (promotion.promoPrice != null) {
        items.push({ description: `Promotion: ${p.title}`, packageId: null, unitPrice: promotion.promoPrice, qty: 1 });
      }
    }
    if (items.length === 0) throw new Error("Add at least one line item or a promotional price");

    const subtotal = round2(items.reduce((s, i) => s + i.unitPrice * i.qty, 0));
    let discount = 0;
    if (promotion?.discountType === "percent" && promotion.discountValue) discount = (subtotal * promotion.discountValue) / 100;
    if (promotion?.discountType === "amount" && promotion.discountValue) discount = promotion.discountValue;
    discount = round2(Math.min(discount, subtotal));

    const d = new Date();
    const quoteNumber = `KD-Q-${d.toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const [row] = await db
      .insert(quotations)
      .values({
        quoteNumber,
        clientName: data.clientName,
        clientEmail: data.clientEmail || null,
        clientPhone: data.clientPhone || null,
        businessName: data.businessName || null,
        enquiryId: data.enquiryId || null,
        items,
        promotion,
        subtotal,
        discount,
        total: round2(subtotal - discount),
        notes: data.notes || null,
        validUntil: data.validUntil || null,
        createdBy: context.userId,
      })
      .returning();
    return row;
  });

export const updateQuotationStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(["draft", "sent", "accepted", "declined"]) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await requireRole(context, ["admin", "sales_agent"]);
    const { db, quotations, orm } = await getDb();
    // Only status changes are allowed; amounts are immutable once created.
    await db.update(quotations).set({ status: data.status }).where(orm.eq(quotations.id, data.id));
    return { success: true };
  });
