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

// ── Fix a single image URL ────────────────────────────────────────────────────
function fixImageUrl(raw: any): string {
  if (!raw) return '';
  // Extract src string from any shape
  let url = typeof raw === 'string' ? raw : (raw?.src || raw?.url || raw?.image || '');
  if (typeof url !== 'string') return '';
  // Remove spaces that corrupt encoded URLs e.g. "https%3A%2F%2 Fcms..." → "https%3A%2F%2Fcms..."
  url = url.replace(/\s+/g, '');
  // Fix protocol-relative URLs
  if (url.startsWith('//')) url = `https:${url}`;
  // Fix double-slash artifacts like /https://
  if (url.startsWith('/http')) url = url.replace(/^\//, '');
  return url;
}

// ── Clean a single product ────────────────────────────────────────────────────
function cleanProduct(raw: any) {
  // images → always { src: string }[] with valid, space-free URLs
  const rawImages: any[] = Array.isArray(raw.images) ? raw.images : [];
  const images = rawImages
    .map((img: any) => ({ src: fixImageUrl(img) }))
    .filter(img => img.src && (img.src.startsWith('http') || img.src.startsWith('/')));

  // name — strip "wishlist shareicon" UI artifacts
  const name = (raw.name || '')
    .replace(/\s*wishlist\s*shareicon\s*/gi, '')
    .replace(/\s*shareicon\s*/gi, '')
    .replace(/\s*wishlist\s*/gi, '')
    // Also deduplicate repeated name segments (some products repeat name 5x)
    .split(' | ')[0]  // take only first segment if massively repeated
    .trim();

  // features → plain string[]
  const features: string[] = Array.isArray(raw.features)
    ? raw.features
        .map((f: any) => (typeof f === 'string' ? f : f?.value || f?.label || f?.text || ''))
        .filter(Boolean)
    : [];

  // salient_features → plain string[]
  const salient_features: string[] = Array.isArray(raw.salient_features)
    ? raw.salient_features
        .map((f: any) => (typeof f === 'string' ? f : f?.value || f?.label || f?.text || ''))
        .filter(Boolean)
    : [];

  // slug: prefer slug field, fallback to id
  const slug = raw.slug || raw.id || '';

  // price: ensure number
  const price = Number(raw.price || raw.rate || 0);

  return {
    ...raw,
    name,
    images,
    features,
    salient_features,
    slug,
    price,
  };
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function GET() {

  // ── 1. Try local database ─────────────────────────────────────────────
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

  // ── 2. Fetch from live satyajan.com API ───────────────────────────────
  try {
    const liveRes = await fetch("https://satyajan.com/api/products", {
      next: { revalidate: 3600 },
    });

    if (liveRes.ok) {
      const liveData = await liveRes.json();
      if (liveData?.products?.length) {
        const products = liveData.products.map(cleanProduct);
        const categories = [...new Set(products.map((p: any) => p.category).filter(Boolean))];
        return NextResponse.json({ products, categories });
      }
    }
  } catch (e) {
    console.error("Live API fetch error:", e);
  }

  // ── 3. Static mock fallback ───────────────────────────────────────────
  return NextResponse.json({
    products: mockProducts.map(cleanProduct),
    categories: mockCategories,
  });
}