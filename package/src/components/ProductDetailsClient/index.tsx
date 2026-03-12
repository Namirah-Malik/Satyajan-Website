'use client';

import { Icon } from '@iconify/react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import CallMeBackModal from '@/components/CallMeBackModal';
import { useScrollModal } from '@/hooks/useScrollModal';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import EMICalculator from '@/components/EMI/EMICalculator';


const ProductGallery = dynamic<{ images: { src: string }[]; name: string }>(
  () => import('@/components/Home/Product/ProductGallery'),
);

interface Props {
  product: any;
  images: { src: string }[];
  formattedPrice: string;
  tabItems: any[];
}

export default function ProductDetailsClient({ product, images, formattedPrice, tabItems }: Props) {
  const { showModal, closeModal } = useScrollModal({ triggerTimeMs: 60000, showOnFooterReach: true });
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  // ✅ NEW: tab state for image vs video
  const [mediaTab, setMediaTab] = useState<'images' | 'video'>('images');

  const price = typeof product.price === 'number' ? product.price : Number(product.price) || 0;
  const mainImage = images?.[0]?.src || '/images/fallback.jpg';

  const VIDEO_SKUS = ['899-951-1075']; // ✅ only add SKUs that have videos
const [videoExists, setVideoExists] = useState(true);
const videoUrl = VIDEO_SKUS.includes(product.SKU) ? `/videos/${product.SKU}.mp4` : null;
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
      <main className="min-h-screen pt-28 sm:pt-36 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

<div className="flex flex-row gap-8 items-start">

            {/* LEFT: Image/Video gallery */}

<div className="w-[45%] flex-shrink-0 sticky top-28">

              {/* ✅ Tab switcher — only show if product has a video */}
              {videoUrl && (
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => setMediaTab('images')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      mediaTab === 'images'
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon icon="ph:images-fill" width={16} />
                    Photos
                  </button>
                  <button
                    onClick={() => setMediaTab('video')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      mediaTab === 'video'
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon icon="ph:play-circle-fill" width={16} />
                    Video
                  </button>
                </div>
              )}
              <div className="rounded-2xl border border-gray-200 bg-white shadow p-4">
                {mediaTab === 'images' || !videoUrl ? (
                  <ProductGallery images={images} name={product.name} />
                ) : (


<div className="relative w-full rounded-xl overflow-hidden bg-black" style={{ height: '420px' }}>
                  <video
  src={videoUrl!}
  controls
  autoPlay
  loop
  muted
  playsInline
  controlsList="nodownload noremoteplayback"
  disablePictureInPicture

  className="w-full h-full object-cover absolute inset-0"

  poster={mainImage}
  onError={() => setVideoExists(false)}
>
  Your browser does not support the video tag.
</video>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Product info — unchanged */}
            <div className="flex-1 flex flex-col gap-5">

              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-2">
                  {product.name}
                </h1>
                <p className="text-sm text-gray-400">SKU: {product.SKU}</p>
              </div>

              <div>
                <span className="text-3xl sm:text-4xl font-bold text-primary">
                  {formattedPrice}
                </span>
              </div>

              {price > 0 && <EMICalculator price={price} />}

              {product.description && (
                <div className="border border-gray-200 rounded-xl p-5 bg-gray-50">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                    About This Product
                  </p>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="flex-1 bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-dark transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
                >
                  {adding
                    ? <><Icon icon="svg-spinners:3-dots-fade" width={20} />Adding...</>
                    : <><Icon icon="solar:cart-large-4-bold" width={20} />Add to Cart</>
                  }
                </button>
                <Link
                  href="https://wa.me/918019179159"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 border-2 border-primary text-primary px-6 py-3 rounded-full font-semibold hover:bg-primary hover:text-white transition-colors text-center text-sm sm:text-base"
                >
                  Inquire Now
                </Link>
              </div>

              {product.data && Array.isArray(product.data) && product.data.some((i: any) => i?.labal) && (
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="grid grid-cols-3 divide-x divide-gray-200">
                    {product.data.slice(0, 3).map((item: any, i: number) => {
                      if (!item?.labal) return null;
                      return (
                        <div key={i} className="flex flex-col items-center py-4 px-3 text-center bg-white">
                          <p className="text-xs text-gray-400 font-medium mb-1">{String(item.labal)}</p>
                          <p className="text-xs sm:text-sm font-bold text-gray-900">{String(item.value)}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {Array.isArray(product.salient_features) && product.salient_features.length > 0 && (
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-3">Key Highlights</h3>
                  <div className="flex flex-col gap-2">
                    {product.salient_features.map((f: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 px-4 py-2.5 bg-primary/5 border border-primary/20 rounded-full">
                        <Icon icon="ph:seal-check-fill" className="text-primary mt-0.5 flex-shrink-0" width={16} />
                        <p className="text-xs sm:text-sm text-primary font-medium leading-snug">{f}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {Array.isArray(product.features) && product.features.length > 0 && (
                <div className="border border-gray-200 rounded-xl p-5 bg-blue-50/40">
                  <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Icon icon="ph:list-checks-fill" className="text-primary" width={18} />
                    Product Features ({product.features.length})
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {product.features.map((f: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <Icon icon="ph:check-circle-fill" className="text-primary mt-0.5 flex-shrink-0" width={18} />
                        <p className="text-sm text-gray-700 leading-snug">{f}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {Array.isArray(product.specifications) && product.specifications.length > 0 && (
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-3">Specifications</h3>
                  <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full text-sm">
                      <tbody>
                        {product.specifications.map((spec: any, i: number) => (
                          <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-4 py-3 font-medium text-gray-700 border-b border-gray-100 w-1/2">{spec.labal}</td>
                            <td className="px-4 py-3 text-gray-600 border-b border-gray-100">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>

      <CallMeBackModal isOpen={showModal} onClose={closeModal} />
    </>
  );
}