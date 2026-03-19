'use client';

import React, { Suspense, useState, useEffect } from 'react';
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

// ── Normalize any product shape → PropertyHomes ───────────────────────────────
function normalizeProduct(raw: any): PropertyHomes {

  // images: handle string[], {src}[], {url}[], {image}[] — all possible shapes
  const rawImages: any[] = Array.isArray(raw.images) ? raw.images : [];
  const images = rawImages
    .map((img: any) => {
      if (typeof img === 'string') return { src: img };
      if (img?.src)   return { src: img.src };
      if (img?.url)   return { src: img.url };
      if (img?.image) return { src: img.image };
      return { src: '' };
    })
    .filter(img => img.src && typeof img.src === 'string' && img.src.startsWith('http'));

  // slug
  const slug = raw.slug || raw.id || '';

  // price
  const rate = raw.rate ?? raw.price ?? 0;

  // features — normalize to plain strings
  const features: string[] = Array.isArray(raw.features)
    ? raw.features
        .map((f: any) => (typeof f === 'string' ? f : f?.value || f?.label || f?.text || ''))
        .filter(Boolean)
    : [];

  // salient_features — also normalize
  const salient_features: string[] = Array.isArray(raw.salient_features)
    ? raw.salient_features
        .map((f: any) => (typeof f === 'string' ? f : f?.value || f?.label || f?.text || ''))
        .filter(Boolean)
    : [];

  // name — strip "wishlist shareicon" UI artifacts from live API scraper
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

// ── Inner component ───────────────────────────────────────────────────────────
const ProductsContent = () => {
  const searchParams = useSearchParams();
  const urlCategory  = searchParams.get('category') || 'all';

  const [products,   setProducts]   = useState<PropertyHomes[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filter,     setFilter]     = useState<string>(urlCategory);
  const [loading,    setLoading]    = useState(true);

  // Sync filter when URL changes
  useEffect(() => { setFilter(urlCategory); }, [urlCategory]);

  // Fetch products
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

  const FILTERS = [
    { label: 'All Products', value: 'all' },
    ...categories.map(cat => ({ label: cat, value: cat })),
  ];

  const filtered =
    filter === 'all'
      ? products
      : products.filter(p => p.category?.toLowerCase() === filter.toLowerCase());

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
              <button key={f.value} onClick={() => setFilter(f.value)} type="button"
                className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0 snap-start ${
                  filter === f.value
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white/60 text-gray-700 hover:bg-primary/10 hover:text-primary border border-white/40'
                }`}>
                {f.label}
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Heading */}
        <div className="mb-5 sm:mb-10">
          <h2 className="text-xl sm:text-4xl font-extrabold text-gray-900 mb-1 sm:mb-2 drop-shadow-lg tracking-tight">
            {filter === 'all' ? 'All Products' : filter}
          </h2>
          <p className="text-xs sm:text-lg text-gray-600 font-medium">
            {filtered.length} product{filtered.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <GlassCard className="p-10 sm:p-16 text-center">
            <p className="text-gray-500 text-base sm:text-lg font-medium">No products found.</p>
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