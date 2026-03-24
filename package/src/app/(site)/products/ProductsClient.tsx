'use client';

import React, { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import CallMeBackModal from '@/components/CallMeBackModal';
import { useScrollModal } from '@/hooks/useScrollModal';
import PropertyCard from '@/components/Home/Product/Card/Card';
import type { PropertyHomes } from '@/types/properyHomes';
import { Icon } from '@iconify/react';

const GlassCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/40 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 transition-all duration-300 hover:shadow-2xl ${className}`}>
    {children}
  </div>
);

// ── Image URL fixer ───────────────────────────────────────────────────────────
// Converts wrapped Next.js image URLs to direct cms.microtek.in URLs
// Before: https://www.microtek.in/_next/image?url=https%3A%2F%2Fcms.microtek.in%2Fupload%2Fproduct%2Ffilename.jpg&w=3840&q=75
// After:  https://cms.microtek.in/upload/product/filename.jpg
function resolveImageUrl(src: string): string {
  if (!src) return '';
  try {
    if (src.includes('/_next/image')) {
      const parsed = new URL(src);
      const inner = parsed.searchParams.get('url');
      if (inner) return decodeURIComponent(inner);
    }
  } catch {
    // fall through and return original
  }
  return src;
}

// ── Normalize any product shape → PropertyHomes ───────────────────────────────
function normalizeProduct(raw: any): PropertyHomes {
  const rawImages: any[] = Array.isArray(raw.images) ? raw.images : [];
  const images = rawImages
    .map((img: any) => {
      let src = '';
      if (typeof img === 'string') src = img;
      else if (img?.src)   src = img.src;
      else if (img?.url)   src = img.url;
      else if (img?.image) src = img.image;

      // ✅ Unwrap Next.js image optimization URL → direct cms.microtek.in URL
      src = resolveImageUrl(src);

// Route through local proxy to avoid hotlink blocking
if (src && src.startsWith('http')) {
  src = `/api/image-proxy?url=${encodeURIComponent(src)}`;
}

return src ? { src } : null;

    })
    .filter(Boolean) as { src: string }[];

  const slug = raw.slug || raw.id || '';
  const rate = raw.rate ?? raw.price ?? 0;

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

  const name = (raw.name || '')
    .replace(/\s*wishlist\s*shareicon\s*/gi, '')
    .replace(/\s*shareicon\s*/gi, '')
    .replace(/\s*wishlist\s*/gi, '')
    .trim();

  return {
    ...raw,
    slug,
    rate,
    images,
    features,
    salient_features,
    name,
    category: raw.category || '',
    description: raw.description || '',
  };
}

// ── Maps search keywords → actual API category values ────────────────────────
const CATEGORY_MAP: Record<string, string[]> = {
  'solar':    ['Solar', 'Solar Inverter', 'Solar Battery'],
  'inverter': ['Inverter', 'Solar Inverter'],
  'battery':  ['Battery', 'New Lithium Battery', 'Solar Battery'],
  'lithium':  ['New Lithium Battery'],
  'ups':      ['ONLINE UPS', 'High Capacity UPS'],
  'online':   ['ONLINE UPS'],
  'jumbo':    ['High Capacity UPS'],
  'combo':    ['Combos'],
  'combos':   ['Combos'],
};

function resolveCategories(q: string): string[] {
  const lower = q.toLowerCase().trim();
  if (!lower) return [];
  if (CATEGORY_MAP[lower]) return CATEGORY_MAP[lower];
  return Object.entries(CATEGORY_MAP)
    .filter(([key]) => key.includes(lower) || lower.includes(key))
    .flatMap(([, cats]) => cats);
}

// ── Inner component ───────────────────────────────────────────────────────────
const ProductsContent = () => {
  const searchParams = useSearchParams();
  const urlCategory  = searchParams.get('category') || '';
  const urlSearch    = searchParams.get('search') || '';

  const [products,   setProducts]   = useState<PropertyHomes[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading,    setLoading]    = useState(true);

  const [filter, setFilter] = useState<string>(() => {
    if (urlCategory) return urlCategory;
    if (urlSearch) {
      const cats = resolveCategories(urlSearch);
      if (cats.length === 1) return cats[0];
    }
    return 'all';
  });

  // Sync filter when URL params change (browser back/forward)
  useEffect(() => {
    if (urlCategory) {
      setFilter(urlCategory);
    } else if (urlSearch) {
      const cats = resolveCategories(urlSearch);
      setFilter(cats.length === 1 ? cats[0] : 'all');
    } else {
      setFilter('all');
    }
  }, [urlCategory, urlSearch]);

  // Fetch & normalize products
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          const raw: any[] = Array.isArray(data?.products)
            ? data.products
            : Array.isArray(data) ? data : [];

          const normalized = raw.map(normalizeProduct);
          setProducts(normalized);

          const cats = Array.from(
            new Set(normalized.map(p => p.category).filter(Boolean))
          ) as string[];
          setCategories(cats);
        }
      } catch (e) {
        console.error('Failed to load products:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Build filtered list
  const filtered = useMemo(() => {
    let base = products;

    // Apply category tab filter
    if (filter !== 'all') {
      base = base.filter(p => p.category?.toLowerCase() === filter.toLowerCase());
    }

    // Apply free-text search if no single category resolved
    if (urlSearch && filter === 'all') {
      const q = urlSearch.toLowerCase().trim();
      const mappedCats = resolveCategories(q).map(c => c.toLowerCase());
      base = base.filter(p => {
        const nameLower = p.name?.toLowerCase() || '';
        const catLower  = p.category?.toLowerCase() || '';
        const descLower = (p.description || '').toLowerCase();
        if (mappedCats.length > 0 && mappedCats.includes(catLower)) return true;
        if (nameLower.includes(q)) return true;
        if (catLower.includes(q)) return true;
        if (descLower.includes(q)) return true;
        return false;
      });
    }

    return base;
  }, [products, filter, urlSearch]);

  const headingText = useMemo(() => {
    if (filter !== 'all') return filter;
    if (urlSearch) return `Results for "${urlSearch}"`;
    return 'All Products';
  }, [filter, urlSearch]);

  const FILTERS = [
    { label: 'All Products', value: 'all' },
    ...categories.map(cat => ({ label: cat, value: cat })),
  ];

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="flex flex-col items-center gap-3">
        <Icon icon="ph:circle-notch-bold" className="text-primary animate-spin" width={40} />
        <p className="text-gray-500 text-sm font-medium">Loading products…</p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen">
      <section className="px-3 sm:px-4 max-w-7xl mx-auto !pt-0 pb-12 sm:pb-16">

        {/* Filter tabs */}
        <GlassCard className="p-3 sm:p-4 mb-6 sm:mb-8">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none snap-x">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                type="button"
                className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0 snap-start ${
                  filter === f.value
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white/60 text-gray-700 hover:bg-primary/10 hover:text-primary border border-white/40'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Heading */}
        <div className="mb-5 sm:mb-10">
          <h2 className="text-xl sm:text-4xl font-extrabold text-gray-900 mb-1 sm:mb-2 drop-shadow-lg tracking-tight">
            {headingText}
          </h2>
          <p className="text-xs sm:text-lg text-gray-600 font-medium">
            {filtered.length} product{filtered.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <GlassCard className="p-10 sm:p-16 text-center">
            <div className="flex flex-col items-center gap-3 text-gray-400">
              <Icon icon="ph:magnifying-glass" width={40} />
              <p className="text-gray-500 text-base sm:text-lg font-medium">No products found.</p>
              {urlSearch && (
                <p className="text-sm text-gray-400">
                  No results for &quot;{urlSearch}&quot; — try browsing by category above.
                </p>
              )}
            </div>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            {filtered.map((item, idx) => (
              <PropertyCard key={idx} item={item} />
            ))}
          </div>
        )}

      </section>
    </main>
  );
};

// ── Main export ───────────────────────────────────────────────────────────────
const ProductsClient = () => {
  const { showModal, closeModal } = useScrollModal({ triggerTimeMs: 60000, showOnFooterReach: true });
  return (
    <>
      <Suspense fallback={
        <div className="flex items-center justify-center py-24">
          <Icon icon="ph:circle-notch-bold" className="text-primary animate-spin" width={40} />
        </div>
      }>
        <ProductsContent />
      </Suspense>
      <CallMeBackModal isOpen={showModal} onClose={closeModal} />
    </>
  );
};

export default ProductsClient;