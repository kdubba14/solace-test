import { ilike, or, sql, eq, desc, asc } from "drizzle-orm";
import db from "../../../db";
import { advocates } from "../../../db/schema";
// import { advocateData } from "../../../db/seed/advocates";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const q = searchParams.get("q") || "";
  const sortParam = searchParams.get("sort");
  const sortParamSplit = sortParam && sortParam.split(",");
  const sort =
    Array.isArray(sortParamSplit) &&
    sortParamSplit?.length > 1 &&
    (sortParamSplit[1] === "desc" ? desc : asc)(advocates.lastName);
  const yearsOfExperience = parseInt(q || "0");
  const offset = (page - 1) * limit;

  const data = sort
    ? await db
        .select()
        .from(advocates)
        .where(
          q
            ? or(
                ilike(advocates.firstName, `%${q}%`),
                ilike(advocates.lastName, `%${q}%`),
                ilike(advocates.city, `%${q}%`),
                ilike(advocates.degree, `%${q}%`),
                // @ts-expect-error the text conversion throws a type error
                ilike(sql`${advocates.specialties}::text`, `%${q}%`), // TODO: is there a better way to do this?
                yearsOfExperience
                  ? eq(advocates.yearsOfExperience, yearsOfExperience)
                  : undefined
              )
            : undefined
        )
        .orderBy(sort)
        .limit(limit)
        .offset(offset)
    : await db
        .select()
        .from(advocates)
        .where(
          q
            ? or(
                ilike(advocates.firstName, `%${q}%`),
                ilike(advocates.lastName, `%${q}%`),
                ilike(advocates.city, `%${q}%`),
                ilike(advocates.degree, `%${q}%`),
                // @ts-expect-error the text conversion throws a type error
                ilike(sql`${advocates.specialties}::text`, `%${q}%`), // TODO: is there a better way to do this?
                yearsOfExperience
                  ? eq(advocates.yearsOfExperience, yearsOfExperience)
                  : undefined
              )
            : undefined
        )
        .limit(limit)
        .offset(offset);

  const total = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(advocates)
    .where(
      q
        ? or(
            ilike(advocates.firstName, `%${q}%`),
            ilike(advocates.lastName, `%${q}%`),
            ilike(advocates.city, `%${q}%`),
            ilike(advocates.degree, `%${q}%`),
            // @ts-expect-error the text conversion throws a type error
            ilike(sql`${advocates.specialties}::text`, `%${q}%`), // TODO: is there a better way to do this?
            yearsOfExperience
              ? eq(advocates.yearsOfExperience, yearsOfExperience)
              : undefined
          )
        : undefined
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
