import type { Config } from "@netlify/functions";
import { sql } from "drizzle-orm";
import { db } from "../../db/index.js";

export default async () => {
  try {
    await db.execute(sql`select 1`);

    return Response.json({
      ok: true,
      database: "netlify",
    });
  } catch (error) {
    console.error("Database health check failed", error);

    return Response.json(
      {
        ok: false,
        database: "netlify",
      },
      { status: 500 },
    );
  }
};

export const config: Config = {
  path: "/api/database-health",
};
