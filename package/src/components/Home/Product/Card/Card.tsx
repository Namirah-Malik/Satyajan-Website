'use client';

import { PropertyHomes } from '@/types/properyHomes'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useState } from 'react'

const PropertyCard: React.FC<{ item: PropertyHomes }> = ({ item }) => {
  const { name, rate, slug, images, features, category, description } = item
  const { addToCart } = useCart()
  const [adding, setAdding] = useState(false)
  const [imgError, setImgError] = useState(false)

  // Safely get first valid image src
  const mainImage = (() => {
    if (!Array.isArray(images) || images.length === 0) return null;
    for (const img of images) {
      const src = typeof img === 'string' ? img : img?.src;
      if (src && typeof src === 'string' && src.startsWith('http')) return src;
    }
    return null;
  })();

  const formattedRate = rate && !isNaN(Number(rate))
    ? Number(rate).toLocaleString('en-IN')
    : null;

  const price = Number(rate) || 0;
  const SKU = slug && slug.trim() ? slug.toUpperCase().replace(/\s+/g, '-') : `PROD-${Date.now()}`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    addToCart({ id: slug, name, SKU, price, image: mainImage || '/images/fallback.jpg' });
    setTimeout(() => setAdding(false), 500);
  };

  const showImage = mainImage && !imgError;

  return (
    <div className="w-full transition-transform duration-300 hover:-translate-y-1">
      <div className="rounded-2xl border border-dark/10 group hover:shadow-2xl duration-300 bg-white overflow-hidden flex flex-col h-full">

        {/* ── IMAGE ── */}
        <Link href={slug ? `/products/${slug}` : '#'} className="block">
          <div className="relative w-full aspect-square bg-gray-50 flex-shrink-0 overflow-hidden">
            {showImage ? (
              <Image
                src={mainImage}
                alt={name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                className="object-contain p-3 group-hover:scale-105 transition duration-300"
                unoptimized
                onError={() => setImgError(true)}
              />
            ) : (
              /* Placeholder when no image */
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gray-50">
                <Icon icon="ph:image-broken" className="text-gray-300" width={40} />
                <span className="text-[10px] text-gray-300 font-medium">No image</span>
              </div>
            )}

            {/* Category badge */}
            {category && (
              <span className="absolute top-2 left-2 text-[10px] sm:text-xs font-semibold text-white bg-primary/80 backdrop-blur-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full z-10">
                {category}
              </span>
            )}
          </div>
        </Link>

        {/* ── CONTENT ── */}
        <div className="p-3 sm:p-5 flex flex-col gap-2 sm:gap-3 flex-1">

          {/* Name */}
          <Link href={slug ? `/products/${slug}` : '#'}>
            <h3 className="text-xs sm:text-base font-bold text-gray-900 leading-snug group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
              {name}
            </h3>
          </Link>

          {/* Description */}
          {description && (
            <p className="text-[10px] sm:text-sm text-gray-500 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}

          {/* Features */}
          {features && features.length > 0 && (
            <ul className="space-y-1 flex-1">
              {features.slice(0, 3).map((feature, idx) => (
                <li key={idx} className="flex items-start gap-1.5 text-[10px] sm:text-xs text-gray-600">
                  <Icon icon="ph:check-circle-fill" width={12} className="text-primary mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2">{feature}</span>
                </li>
              ))}
              {features.length > 3 && (
                <li className="text-[10px] sm:text-xs text-primary/70 font-medium">
                  +{features.length - 3} more features
                </li>
              )}
            </ul>
          )}

          <div className="flex-1" />

          {/* ── PRICE + ACTIONS ── */}
          <div className="pt-2 sm:pt-3 border-t border-gray-100 flex flex-col gap-2 mt-auto">

            <div className="flex items-center justify-between gap-1">
              {formattedRate ? (
                <span className="text-sm sm:text-lg font-extrabold text-primary">₹{formattedRate}</span>
              ) : (
                <span className="text-xs text-gray-400 font-medium">Price on request</span>
              )}
              {slug && (
                <Link
                  href={`/products/${slug}`}
                  className="inline-flex items-center gap-0.5 text-[10px] sm:text-sm text-primary font-semibold hover:underline"
                >
                  Details <Icon icon="solar:arrow-right-linear" width={12} />
                </Link>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="w-full py-2 sm:py-2.5 px-3 sm:px-4 bg-primary text-white rounded-full hover:bg-dark duration-300 text-xs sm:text-sm font-semibold shadow flex items-center justify-center gap-1.5 disabled:opacity-50 active:scale-95 transition-transform"
            >
              {adding
                ? <><Icon icon="svg-spinners:3-dots-fade" width={16} /> Adding…</>
                : <><Icon icon="solar:cart-large-4-bold" width={16} /> Add to Cart</>
              }
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;