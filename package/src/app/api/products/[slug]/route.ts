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

function cleanProduct(raw: any) {
  // Images must already be clean direct URLs (e.g. https://cms.microtek.in/upload/...)
  const images: { src: string }[] = (Array.isArray(raw.images) ? raw.images : [])
    .map((img: any) => {
      const src = typeof img === 'string' ? img : (img?.src || '');
      return { src: src.trim() };
    })
    .filter((img: any) => img.src.startsWith('http'));

  const name = (raw.name || '')
    .replace(/\s*wishlist\s*shareicon\s*/gi, '')
    .replace(/\s*shareicon\s*/gi, '')
    .replace(/\s*wishlist\s*/gi, '')
    .split(' | ')[0]
    .trim();

  const features: string[] = Array.isArray(raw.features)
    ? raw.features
        .map((f: any) => (typeof f === 'string' ? f : f?.value || f?.label || f?.text || ''))
        .filter(Boolean)
    : [];

  const salient_features: string[] = Array.isArray(raw.salient_features)
    ? raw.salient_features
        .map((f: any) => (typeof f === 'string' ? f : f?.value || f?.label || f?.text || ''))
        .filter(Boolean)
    : [];

  const slug = raw.slug || raw.id || '';
  const price = Number(raw.price || raw.rate || 0);

  return { ...raw, name, images, features, salient_features, slug, price };
}

export async function GET() {
  // 1. Try local database
  try {
    const db = await getPrisma();
    if (db) {
      const raw = await db.product.findMany({ orderBy: { createdAt: "desc" } });
      const products = raw.map(cleanProduct);
      const categories = [...new Set(products.map((p: any) => p.category).filter(Boolean))];
      return NextResponse.json({ products, categories });
    }
  } catch (e) {
    console.error("DB error:", e);
  }

  // 2. Static mock fallback
  return NextResponse.json({
    products: mockProducts.map(cleanProduct),
    categories: mockCategories,
  });
}