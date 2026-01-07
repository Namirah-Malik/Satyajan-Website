'use client';

import { Icon } from '@iconify/react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Tabs } from '@/components/ui/tabs';
import CallMeBackModal from '@/components/CallMeBackModal';
import { useScrollModal } from '@/hooks/useScrollModal';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

const ProductGallery = dynamic<{ images: { src: string }[]; name: string }>(
    () => import('@/components/Home/Product/ProductGallery'),
);

interface ProductDetailsClientProps {
  product: any;
  images: { src: string }[];
  formattedPrice: string;
  tabItems: any[];
}

export default function ProductDetailsClient({
  product,
  images,
  formattedPrice,
  tabItems,
}: ProductDetailsClientProps) {
  const { showModal, closeModal } = useScrollModal({ triggerTimeMs: 60000, showOnFooterReach: true }); // 60 seconds
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  const price = typeof product.price === 'number' ? product.price : Number(product.price) || 0;
  const mainImage = images && images.length > 0 ? images[0].src : '/images/fallback.jpg';

  const handleAddToCart = () => {
    setAdding(true);
    addToCart({
      id: product.id || product.SKU,
      name: product.name,
      SKU: product.SKU || `SKU-${product.id}`,
      price,
      image: mainImage,
    });
    setTimeout(() => setAdding(false), 500);
  };

  return (
    <>
      <section className="!pt-44 pb-20 relative bg-white">
        <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-10 mb-8">
            {/* Left: Image Gallery */}
            <div className="lg:col-span-4 flex flex-col items-center">
              <ProductGallery images={images} name={product.name} />
            </div>

            {/* Middle: Product Info */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <div className="">
                {product.category && (
                  <span className="inline-block text-xs font-medium text-primary/70 uppercase tracking-wide mb-3 px-3 py-1 bg-primary/10 rounded-full">
                    {product.category}
                  </span>
                )}
                <h1 className="text-3xl lg:text-4xl font-bold text-dark mb-2">{product.name}</h1>
                <p className="text-base text-gray-500 mb-2">SKU: {product.SKU}</p>
              </div>
              <span className="text-2xl font-semibold text-primary mb-2">{formattedPrice}</span>
              
              {/* Product Description Preview */}
              {product.description && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">About This Product</h3>
                  <p className="text-base text-gray-700 leading-relaxed">{product.description}</p>
                </div>
              )}
              <div className="flex flex-wrap gap-4 mb-4">
                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="py-3 px-8 bg-primary text-white rounded-full hover:bg-dark duration-300 text-base font-semibold shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                <Link href="https://wa.me/918019179159" className="py-3 px-8 bg-white text-primary border-2 border-primary rounded-full block text-center hover:bg-primary hover:text-white duration-300 text-base font-semibold shadow-md">
                  Inquire Now
                </Link>
              </div>
              <div className="rounded-2xl border border-primary flex justify-between sm:flex-row flex-col sm:gap-0 gap-6 p-4">
                {product.data && Array.isArray(product.data) && product.data.slice(0, 3).map((item: any, index: number) => {
                  if (
                    !item ||
                    typeof item !== 'object' ||
                    Array.isArray(item) ||
                    !('labal' in item) ||
                    !('value' in item)
                  ) {
                    return null;
                  }
                  return (
                    <div key={index} className="flex flex-col justify-center items-center md:flex-1">
                      <p className='text-black/60'>{String(item.labal)}</p>
                      <p className='text-black font-medium'>{String(item.value)}</p>
                    </div>
                  );
                })}
              </div>
              {/* Key Features Section */}
              {Array.isArray((product as any).salient_features) && (product as any).salient_features.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-dark mb-3">Key Highlights</h3>
                  <div className="flex flex-wrap gap-2">
                    {(product as any).salient_features.map((feature: string, idx: number) => (
                      <span key={idx} className="bg-primary/10 text-primary text-sm px-4 py-2 rounded-full font-medium flex items-center gap-2 hover:bg-primary hover:text-white transition-colors cursor-default group">
                        <Icon icon="ph:aperture" width={20} height={20} className="text-primary group-hover:text-white transition-colors" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* All Features Quick View */}
              {Array.isArray(product.features) && product.features.length > 0 && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="text-lg font-semibold text-dark mb-3 flex items-center gap-2">
                    <Icon icon="ph:list-bullets" width={24} height={24} className="text-primary" />
                    Product Features ({product.features.length})
                  </h3>
                  <ul className="space-y-2">
                    {product.features.slice(0, 5).map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <Icon icon="ph:check-circle-fill" width={18} height={18} className="text-primary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {product.features.length > 5 && (
                      <li className="text-sm text-primary font-medium mt-2">
                        + {product.features.length - 5} more features (see Features tab for complete list)
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="w-full mt-12">
            <Tabs
              tabs={tabItems}
              containerClassName="mb-4 border-b border-primary/30 flex flex-row justify-between"
              activeTabClassName="bg-white border-b-2 border-primary text-primary font-bold z-10"
              tabClassName="text-lg font-semibold px-6 py-3 bg-transparent rounded-none shadow-none border-none focus:outline-none"
              contentClassName="bg-white px-0 pt-8"
            />
          </div>
        </div>
      </section>
      <CallMeBackModal isOpen={showModal} onClose={closeModal} />
    </>
  );
}
