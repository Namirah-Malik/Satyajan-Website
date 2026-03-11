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

  const mainImage = images[0]?.src || '/images/fallback.jpg';
  const formattedRate = Number(rate).toLocaleString('en-IN');
  const price = Number(rate);
  const SKU = slug && slug.trim() ? slug.toUpperCase().replace(/\s+/g, '-') : `PROD-${Date.now()}`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    addToCart({ id: slug, name, SKU, price, image: mainImage });
    setTimeout(() => setAdding(false), 500);
  };

  return (
    <div className="w-full transition-transform duration-300 hover:-translate-y-1">
      <div className="rounded-2xl border border-dark/10 group hover:shadow-2xl duration-300 bg-white overflow-hidden flex flex-col h-full">

        {/* ✅ Fixed aspect ratio — no horizontal scroll on mobile */}
        <div className="relative w-full aspect-[4/3] overflow-hidden flex-shrink-0">
          <Link href={`/products/${slug}`} className="block w-full h-full">
            <Image
              src={mainImage}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:brightness-75 group-hover:scale-105 transition duration-300"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />
          </Link>
          {category && (
            <span className="absolute top-3 left-3 text-xs font-semibold text-white bg-primary/80 backdrop-blur-sm px-3 py-1 rounded-full">
              {category}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1">
          <Link href={`/products/${slug}`}>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug group-hover:text-primary transition-colors line-clamp-2">
              {name}
            </h3>
          </Link>

          {description && (
            <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}

          {features && features.length > 0 && (
            <ul className="space-y-1.5">
              {features.slice(0, 3).map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                  <Icon icon="ph:check-circle-fill" width={14} className="text-primary mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-1">{feature}</span>
                </li>
              ))}
              {features.length > 3 && (
                <li className="text-xs text-primary/70 font-medium">+{features.length - 3} more</li>
              )}
            </ul>
          )}

          <div className="flex-1" />

          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2 mt-auto">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-base sm:text-lg font-bold text-primary">₹{formattedRate}</span>
              <Link href={`/products/${slug}`} className="inline-flex items-center gap-1 text-xs sm:text-sm text-primary font-semibold hover:underline">
                View Details <Icon icon="solar:arrow-right-linear" width={14} />
              </Link>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="w-full py-2.5 px-4 bg-primary text-white rounded-full hover:bg-dark duration-300 text-sm font-semibold shadow flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {adding
                ? <><Icon icon="svg-spinners:3-dots-fade" width={18} />Adding...</>
                : <><Icon icon="solar:cart-large-4-bold" width={18} />Add to Cart</>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;