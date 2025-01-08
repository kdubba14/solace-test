import { ilike, or, sql, eq } from "drizzle-orm";
import db from "../../../db";
import { advocates } from "../../../db/schema";
// import { advocateData } from "../../../db/seed/advocates";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const q = searchParams.get("q") || "";
  const offset = (page - 1) * limit;

  const data = await db
    .select()
    .from(advocates)
    .where(
      or(
        ilike(advocates.firstName, q),
        ilike(advocates.lastName, q),
        ilike(advocates.city, q),
        ilike(advocates.degree, q),
        sql`EXISTS (
        SELECT 1
        FROM jsonb_array_elements_text(${advocates.specialties}) AS elem
        WHERE elem ILIKE ${q}
      )`,
        eq(advocates.yearsOfExperience, parseInt(q))
      )
    )
    .limit(limit)
    .offset(offset);

  const total = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(advocates)
    .where(
      or(
        ilike(advocates.firstName, q),
        ilike(advocates.lastName, q),
        ilike(advocates.city, q),
        ilike(advocates.degree, q),
        sql`EXISTS (
        SELECT 1
        FROM jsonb_array_elements_text(${advocates.specialties}) AS elem
        WHERE elem ILIKE ${q}
      )`,
        eq(advocates.yearsOfExperience, parseInt(q))
      )
    )
    .then((res) => res[0].count);

  const totalPages = Math.ceil(total / limit);

  return Response.json({
    data,
    total,
    currentPage: page,
    totalPages,
  });
}
