import { NextResponse } from "next/server";
import { mockProducts, mockCategories } from "@/mock/products";

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

export async function GET() {
  // ── 1. Try local database ────────────────────────────────────────────
  try {
    const db = await getPrisma();
    if (db) {
      const products = await db.product.findMany({
        orderBy: { createdAt: "desc" },
      });
      const categories = [...new Set(products.map((p: any) => p.category))];
      return NextResponse.json({ products, categories });
    }
  } catch (e) {
    console.error("DB error:", e);
  }

  // ── 2. Fetch from live satyajan.com API ──────────────────────────────
  try {
    const liveRes = await fetch("https://satyajan.com/api/products", {
      next: { revalidate: 3600 }, // cache 1 hour
    });

    if (liveRes.ok) {
      const liveData = await liveRes.json();
      if (liveData?.products?.length) {
        return NextResponse.json(liveData);
      }
    }
  } catch (e) {
    console.error("Live API fetch error:", e);
  }

  // ── 3. Static mock fallback ──────────────────────────────────────────
  return NextResponse.json({
    products: mockProducts,
    categories: mockCategories,
  });
}