'use client';

import { PropertyHomes } from '@/types/properyHomes'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useState } from 'react'

function proxyImageUrl(src: string | null): string | null {
  if (!src) return null;
  let resolved = src;
  try {
    if (src.includes('/_next/image')) {
      const parsed = new URL(src);
      const inner = parsed.searchParams.get('url');
      if (inner) resolved = decodeURIComponent(inner);
    }
  } catch { }
  if (resolved.startsWith('http://') || resolved.startsWith('https://')) {
    return `/api/image-proxy?url=${encodeURIComponent(resolved)}`;
  }
  return resolved;
}

const PropertyCard: React.FC<{ item: PropertyHomes }> = ({ item }) => {
  const { name, rate, slug, images, features, category, description } = item
  const { addToCart } = useCart()
  const [adding, setAdding] = useState(false)
  const [imgError, setImgError] = useState(false)

  const rawImage = (() => {
    if (!Array.isArray(images) || images.length === 0) return null;
    for (const img of images) {
      const src = typeof img === 'string' ? img : (img as any)?.src;
      if (src && typeof src === 'string' && src.trim().length > 0) return src.trim();
    }
    return null;
  })();

  const mainImage = proxyImageUrl(rawImage);
  const showImage = mainImage && !imgError;

  const formattedRate = rate && !isNaN(Number(rate))
    ? Number(rate).toLocaleString('en-IN')
    : null;

  const price = Number(rate) || 0;
  const SKU = slug && slug.trim()
    ? slug.toUpperCase().replace(/\s+/g, '-')
    : `PROD-${Date.now()}`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    addToCart({ id: slug, name, SKU, price, image: mainImage || '/images/fallback.jpg' });
    setTimeout(() => setAdding(false), 500);
  };

  return (
    <div className="w-full transition-transform duration-200 sm:hover:-translate-y-0.5">
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-shadow duration-200">

        {/* IMAGE
            Mobile  → 4:3 ratio (wider, prominent like Microtek)
            Desktop → square (original) */}
        <Link href={slug ? `/products/${slug}` : '#'} className="block flex-shrink-0">
          <div className="relative w-full bg-gray-50 overflow-hidden aspect-[4/3] sm:aspect-square">
            {showImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={mainImage}
                alt={name}
                loading="lazy"
                onError={() => setImgError(true)}
                className="w-full h-full object-contain p-3 sm:p-3 hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <Icon icon="ph:lightning-fill" className="text-gray-300" width={40} />
              </div>
            )}
            {category && (
              <span className="absolute top-1.5 left-1.5 text-[9px] sm:text-[10px] font-bold text-white bg-primary/90 px-1.5 py-0.5 rounded-full z-10">
                {category}
              </span>
            )}
          </div>
        </Link>

        {/* CONTENT */}
        <div className="p-3 sm:p-4 flex flex-col gap-2 flex-1 border-t border-gray-100">

          {/* Name — centered on mobile, left on desktop */}
          <Link href={slug ? `/products/${slug}` : '#'}>
            <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 hover:text-primary transition-colors text-center sm:text-left">
              {name}
            </h3>
          </Link>

          {/* SKU — show on mobile only */}
          <p className="text-[10px] text-gray-400 text-center sm:hidden">
            SKU: {SKU.slice(0, 24)}
          </p>

          {/* Description — desktop only */}
          {description && (
            <p className="hidden sm:block text-xs text-gray-500 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}

          {/* Features — desktop only */}
          {features && features.length > 0 && (
            <ul className="hidden sm:flex flex-col gap-1 flex-1">
              {features.slice(0, 2).map((feature, idx) => (
                <li key={idx} className="flex items-start gap-1 text-xs text-gray-500">
                  <Icon icon="ph:check-circle-fill" width={11} className="text-primary mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-1">{feature}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="flex-1" />

          {/* Price
              Mobile  → centered with tax note
              Desktop → left-aligned, no tax note */}
          <div className="mt-1">
            {/* Mobile price */}
            <div className="flex flex-col items-center sm:hidden">
              {formattedRate ? (
                <>
                  <span className="text-lg font-extrabold text-primary">₹{formattedRate}</span>
                  <p className="text-[10px] text-gray-400">Inclusive of all Taxes</p>
                </>
              ) : (
                <span className="text-xs text-gray-400">Price on request</span>
              )}
            </div>
            {/* Desktop price */}
            <div className="hidden sm:flex items-center justify-between gap-1">
              {formattedRate ? (
                <span className="text-base font-extrabold text-primary">₹{formattedRate}</span>
              ) : (
                <span className="text-xs text-gray-400">Price on request</span>
              )}
              <Link
                href={slug ? `/products/${slug}` : '#'}
                className="text-xs text-primary font-semibold hover:underline whitespace-nowrap"
              >
                Details →
              </Link>
            </div>
          </div>

          {/* Buttons
              Mobile  → "View More" + "Add to Cart" side by side (Microtek style)
              Desktop → single "Add to Cart" full width */}

          {/* Mobile buttons */}
          <div className="flex gap-2 sm:hidden mt-1">
            <Link
              href={slug ? `/products/${slug}` : '#'}
              className="flex-1 text-center py-2 border border-primary text-primary rounded-lg text-xs font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              View More
            </Link>
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="flex-1 py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-dark transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
            >
              {adding
                ? <Icon icon="svg-spinners:3-dots-fade" width={14} />
                : <><Icon icon="solar:cart-large-4-bold" width={14} /> Cart</>
              }
            </button>
          </div>

          {/* Desktop button */}
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="hidden sm:flex w-full py-2 px-2 bg-primary text-white rounded-full hover:bg-dark duration-200 text-xs font-semibold items-center justify-center gap-1 disabled:opacity-50 active:scale-95 transition-transform"
          >
            {adding
              ? <><Icon icon="svg-spinners:3-dots-fade" width={14} /> Adding…</>
              : <><Icon icon="solar:cart-large-4-bold" width={14} /> Add to Cart</>
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;