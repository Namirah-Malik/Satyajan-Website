"use client";

import { useState } from "react";
import PropertyCard from '@/components/Home/Product/Card/Card';
import type { PropertyHomes } from '@/types/properyHomes';

interface ProductListClientProps {
  propertyHomes: PropertyHomes[];
  categories: string[];
  initialFilter?: string;
}

const ProductListClient = ({ propertyHomes, categories, initialFilter }: ProductListClientProps) => {
  const [filter, setFilter] = useState<string>(initialFilter || "all");

  // Create dynamic filters based on categories from the database
  const FILTERS = [
    { label: "All Products", value: "all" },
    ...categories.map(cat => ({
      label: cat,
      value: cat
    }))
  ];

  const filtered =
    filter === "all"
      ? propertyHomes
      : propertyHomes.filter((item) =>
        item.category?.toLowerCase() === filter.toLowerCase()
      );

  // Group products into arrays of 3
  const groups: PropertyHomes[][] = [];
  for (let i = 0; i < filtered.length; i += 3) {
    groups.push(filtered.slice(i, i + 3));
  }

  return (
    <section className="pt-0">
      <div className="container max-w-8xl mx-auto px-5 2xl:px-0">
        <div className="mb-6 flex gap-4">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              className={`px-4 py-2 rounded border cursor-pointer ${filter === f.value
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-800 border-gray-300"
                }`}
              onClick={() => setFilter(f.value)}
              type="button"
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="grid gap-8">
          {groups.map((group, groupIdx) => (
            <div key={groupIdx} className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {group.map((item, idx) => (
                <PropertyCard key={idx} item={item} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductListClient; 