import { NextResponse } from "next/server";

let prisma: any = null;

async function getPrisma() {
  if (!process.env.DATABASE_URL) return null;
  if (prisma) return prisma;
  try {
    const { PrismaClient } = await import("@prisma/client");
    prisma = new PrismaClient();
    return prisma;
  } catch {
    return null;
  }
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  // ── 1. Try local database ────────────────────────────────────────────
  try {
    const db = await getPrisma();
    if (db) {
      const product = await db.product.findFirst({
        where: { OR: [{ id: slug }, { slug: slug }] },
      });
      if (product) return NextResponse.json({ product });
    }
  } catch (e) {
    console.error("DB error:", e);
  }

  // ── 2. Fetch from live satyajan.com API ──────────────────────────────
  try {
    const liveRes = await fetch(`https://satyajan.com/api/products/${slug}`, {
      next: { revalidate: 3600 }, // cache 1 hour
    });

    if (liveRes.ok) {
      const liveData = await liveRes.json();
      if (liveData?.product) {
        return NextResponse.json({ product: liveData.product });
      }
    }
  } catch (e) {
    console.error("Live API fetch error:", e);
  }

  // ── 3. Nothing found ─────────────────────────────────────────────────
  return NextResponse.json({ error: "Product not found" }, { status: 404 });
}