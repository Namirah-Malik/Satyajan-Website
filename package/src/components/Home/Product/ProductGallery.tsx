"use client";
import React, { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: { src: string }[];
  name: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, name }) => {
  const [selected, setSelected] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 w-full items-center">
      {/* Main Image */}
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-dark/10">
        <Image
          src={images[selected].src}
          alt={name}
          width={500}
          height={375}
          className="object-cover w-full h-full"
          unoptimized={true}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
      </div>
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-2 w-full justify-center">
          {images.slice(0, 5).map((img, idx) => (
            <button
              key={idx}
              className={`w-20 h-20 rounded-lg overflow-hidden border transition-all duration-200 ${selected === idx ? 'border-primary ring-2 ring-primary' : 'border-dark/10'}`}
              onClick={() => setSelected(idx)}
              aria-label={`Show image ${idx + 1}`}
              type="button"
            >
              <Image
                src={img.src}
                alt={`Thumbnail ${idx + 1}`}
                width={80}
                height={80}
                className="object-cover w-full h-full"
                unoptimized={true}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery; 