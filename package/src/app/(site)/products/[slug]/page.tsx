import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetailsClient from '@/components/ProductDetailsClient';

export const dynamic = 'force-dynamic';

const categoryMap: Record<string, string> = {
  'solar': 'Solar Solutions',
  'inverter': 'Home UPS',
  'jumbo-ups': 'Jumbo UPS',
  'online-ups': 'Online UPS',
  'battery': 'Tubular Battery',
  'lithium': 'Lithium Batteries',
  'combos': 'Combos'
};

let prisma: any = null;
async function getPrisma() {
  if (!process.env.DATABASE_URL) return null;
  if (prisma) return prisma;
  try {
    const { PrismaClient } = await import('@prisma/client');
    prisma = new PrismaClient();
    return prisma;
  } catch { return null; }
}

async function fetchProduct(slug: string): Promise<any | null> {
  try {
    const db = await getPrisma();
    if (db) {
      const product = await db.product.findFirst({
        where: { OR: [{ id: slug }, { slug: slug }] },
      });
      if (product) return product;
    }
  } catch (e) { console.error('DB error:', e); }

  try {
    const res = await fetch(`https://satyajan.com/api/products/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.product) return data.product;
    }
  } catch (e) { console.error('Live API error:', e); }

  return null;
}

// ── Extract a valid URL from any image shape ──────────────────────────────────
// Live API returns images as objects: { src, alt, width, height }
// DB may return plain strings
function extractImageSrc(img: any): string {
  if (!img) return '';
  if (typeof img === 'string') return img;
  // object shapes from live API
  return img.src || img.url || img.image || img.href || '';
}

// ── Strip "wishlist shareicon" UI artifacts ───────────────────────────────────
function cleanName(name: string): string {
  return (name || '')
    .replace(/\s*wishlist\s*shareicon\s*/gi, '')
    .replace(/\s*shareicon\s*/gi, '')
    .replace(/\s*wishlist\s*/gi, '')
    .trim();
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) {
    return {
      title: 'Product Not Found | Satyajan',
      description: 'The product you are looking for is not available.',
      robots: { index: false, follow: false },
    };
  }

  const name  = cleanName(product.name);
  const title = `${name} – Price, Specs & Buy Online | Satyajan`;
  const description = product.description
    ? `${product.description.slice(0, 140)}… Buy online at Satyajan Energy Solutions, Hyderabad.`
    : `Buy ${name} at Satyajan Energy Solutions. Best price in Hyderabad. EMI available.`;

  // Safe image extraction for OG
  const rawFirstImage = Array.isArray(product.images) ? product.images[0] : null;
  const ogImage = extractImageSrc(rawFirstImage) || 'https://satyajan.com/images/og-default.jpg';
  const url = `https://satyajan.com/products/${product.slug ?? slug}`;

  return {
    title,
    description,
    keywords: [
      name,
      `${name} price`,
      `${name} Hyderabad`,
      `buy ${name}`,
      product.category ?? 'energy product',
      'Satyajan Energy Solutions',
      'Microtek dealer Hyderabad',
    ],
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: 'Satyajan Energy Solutions',
      images: [{ url: ogImage, width: 800, height: 600, alt: name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function Details({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dbProduct = await fetchProduct(slug);
  if (!dbProduct) return notFound();

  // ── Clean name ──────────────────────────────────────────────────────────────
  const name = cleanName(dbProduct.name);

  // ── Normalize images → always { src: string }[] with valid URLs ─────────────
  const rawImages: any[] = Array.isArray(dbProduct.images) ? dbProduct.images : [];
  const images = rawImages
    .map(img => {
      const src = extractImageSrc(img);
      // Fix protocol-relative URLs like "//microtek.in/..."
      if (src.startsWith('//')) return { src: `https:${src}` };
      // Fix double-slash artifacts like "/https://..."
      if (src.startsWith('/http')) return { src: src.replace(/^\//, '') };
      return { src };
    })
    .filter(img =>
      img.src &&
      (img.src.startsWith('http') || img.src.startsWith('/'))
    );

  const product = {
    id: slug,
    name,
    price: dbProduct.price || 0,
    images: rawImages, // keep raw for reference — images variable is what we pass
    salient_features: Array.isArray(dbProduct.salient_features)
      ? dbProduct.salient_features.map((f: any) =>
          typeof f === 'string' ? f : f?.value || f?.label || f?.text || ''
        ).filter(Boolean)
      : [],
    features: Array.isArray(dbProduct.features)
      ? dbProduct.features.map((f: any) =>
          typeof f === 'string' ? f : f?.value || f?.label || f?.text || ''
        ).filter(Boolean)
      : [],
    specifications: Array.isArray(dbProduct.specifications) ? dbProduct.specifications : [],
    description: dbProduct.description || '',
    category: categoryMap[dbProduct.category || ''] || dbProduct.category || '',
    categorySlug: dbProduct.category || '',
    SKU: dbProduct.SKU || `PROD-${dbProduct.id}`,
    data: Array.isArray(dbProduct.specifications)
      ? dbProduct.specifications.slice(0, 3)
      : [],
  };

  const formattedPrice = product.price
    ? `₹${Number(product.price).toLocaleString('en-IN')}`
    : 'No price listed';

  return (
    <ProductDetailsClient
      product={product}
      images={images}
      formattedPrice={formattedPrice}
      tabItems={[]}
    />
  );
}