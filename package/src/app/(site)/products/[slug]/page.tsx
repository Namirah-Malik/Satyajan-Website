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

  const title = `${product.name} – Price, Specs & Buy Online | Satyajan`;
  const description = product.description
    ? `${product.description.slice(0, 140)}… Buy online at Satyajan Energy Solutions, Hyderabad.`
    : `Buy ${product.name} at Satyajan Energy Solutions. Best price in Hyderabad. EMI available.`;
  const image = product.images?.[0] ?? 'https://satyajan.com/images/og-default.jpg';
  const url = `https://satyajan.com/products/${product.slug ?? slug}`;

  return {
    title,
    description,
    keywords: [
      product.name,
      `${product.name} price`,
      `${product.name} Hyderabad`,
      `buy ${product.name}`,
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
      images: [{ url: image, width: 800, height: 600, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function Details({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dbProduct = await fetchProduct(slug);
  if (!dbProduct) return notFound();

  const product = {
    id: slug,
    name: dbProduct.name,
    price: dbProduct.price || 0,
    images: Array.isArray(dbProduct.images) ? dbProduct.images : [],
    salient_features: Array.isArray(dbProduct.salient_features) ? dbProduct.salient_features : [],
    features: Array.isArray(dbProduct.features) ? dbProduct.features : [],
    specifications: Array.isArray(dbProduct.specifications) ? dbProduct.specifications : [],
    description: dbProduct.description || '',
    category: categoryMap[dbProduct.category || ''] || dbProduct.category || '',
    categorySlug: dbProduct.category || '',
    SKU: dbProduct.SKU || `PROD-${dbProduct.id}`,
    data: Array.isArray(dbProduct.specifications)
      ? dbProduct.specifications.slice(0, 3)
      : []
  };

  const images = Array.isArray(product.images)
    ? product.images
      .filter((src: string) => !!src && (src.startsWith('/') || src.startsWith('http')))
      .map((src: string) => ({ src: src.replace(/^\/(https?:\/\/)/, '$1') }))
    : [];

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