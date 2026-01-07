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

  // Use the first valid image or fallback
  const mainImage = images[0]?.src || '/images/fallback.jpg';

  // Format price for INR with commas
  const formattedRate = Number(rate).toLocaleString('en-IN');
  const price = Number(rate);

  // Generate SKU from slug - ensure slug exists and format properly
  const SKU = slug && slug.trim() ? slug.toUpperCase().replace(/\s+/g, '-') : `PROD-${Date.now()}`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    addToCart({
      id: slug,
      name,
      SKU,
      price,
      image: mainImage,
    });
    setTimeout(() => setAdding(false), 500);
  };

  return (
    <div className="transition-transform duration-300 hover:-translate-y-2">
      <div className="relative rounded-2xl border border-dark/10 group hover:shadow-3xl duration-300 bg-white">
        <div className="overflow-hidden rounded-t-2xl relative">
          <Link href={`/products/${slug}`}>
            {mainImage && (
              <Image
                src={mainImage}
                alt={name}
                width={440}
                height={300}
                className="w-full rounded-t-2xl group-hover:brightness-75 group-hover:scale-110 transition duration-300 delay-75"
                unoptimized={true}
              />
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent rounded-t-2xl pointer-events-none" />
          </Link>
          <div className="absolute top-6 right-6 p-4 bg-white rounded-full shadow-md hidden group-hover:block">
            <Icon
              icon={'solar:arrow-right-linear'}
              width={24}
              height={24}
              className='text-black'
            />
          </div>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {category && (
              <span className="text-xs font-medium text-primary/70 uppercase tracking-wide">
                {category}
              </span>
            )}
            <Link href={`/products/${slug}`}>
              <h3 className="text-2xl font-semibold text-black duration-300 group-hover:text-primary">
                {name}
              </h3>
            </Link>
          </div>
          
          {description && (
            <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
              {description}
            </p>
          )}

          {features && features.length > 0 && (
            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-semibold text-gray-800">Key Features:</h4>
              <ul className="space-y-1.5">
                {features.slice(0, 3).map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                    <Icon icon="ph:check-circle" width={16} height={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{feature}</span>
                  </li>
                ))}
                {features.length > 3 && (
                  <li className="text-xs text-primary/70 font-medium">
                    +{features.length - 3} more features
                  </li>
                )}
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-3 mt-2 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <button className="text-lg font-semibold text-primary px-6 py-2 rounded-full bg-primary/10 hover:bg-primary hover:text-white transition duration-300 shadow-sm">
                ₹{formattedRate}
              </button>
              <Link href={`/products/${slug}`} className="ml-2">
                <span className="inline-flex items-center gap-1 text-primary hover:underline text-sm font-medium">
                  View Details
                  <Icon icon="solar:arrow-right-linear" width={18} height={18} />
                </span>
              </Link>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="w-full py-3 px-6 bg-primary text-white rounded-full hover:bg-dark duration-300 text-base font-semibold shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {adding ? (
                <>
                  <Icon icon="svg-spinners:3-dots-fade" width={20} height={20} />
                  Adding...
                </>
              ) : (
                <>
                  <Icon icon="solar:cart-large-4-bold" width={20} height={20} />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyCard
