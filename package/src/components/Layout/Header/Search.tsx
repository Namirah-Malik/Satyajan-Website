import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { PropertyHomes } from '@/types/properyHomes';

// Add sticky prop type
type SearchProps = {
    sticky?: boolean;
    isHomepage?: boolean;
};

const Search: React.FC<SearchProps> = ({ sticky, isHomepage }) => {
    const [query, setQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [products, setProducts] = useState<PropertyHomes[]>([]);
    const [loading, setLoading] = useState(false);
    const fetchedRef = useRef(false);

    // Fetch products from API and map to PropertyHomes structure
    const fetchProducts = async () => {
        if (fetchedRef.current) return;
        setLoading(true);
        try {
            const res = await fetch('/api/products');
            const data = await res.json();

            // Fix: Access data.products from the API response object
            const productList = data.products || [];

            // Map API data to PropertyHomes structure - just use ID as slug
            const mapped: PropertyHomes[] = Array.isArray(productList)
                ? productList.map((product: any) => ({
                    name: product.name,
                    slug: product.id,
                    location: '',
                    rate: product.price?.toString() || '',
                    beds: 0,
                    baths: 0,
                    area: 0,
                    images: Array.isArray(product.images)
                        ? product.images.filter((src: string) => !!src && (src.startsWith('/') || src.startsWith('http'))).map((src: string) => ({ src }))
                        : [],
                    features: product.features || [],
                    category: product.category || '',
                }))
                : [];
            setProducts(mapped);
            fetchedRef.current = true;
        } catch (e) {
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const filtered = products.filter((item) => {
        const searchTerm = query.toLowerCase();
        return (
            item.name.toLowerCase().includes(searchTerm) ||
            item.category?.toLowerCase().includes(searchTerm) ||
            item.features?.some(f => f.toLowerCase().includes(searchTerm))
        );
    });

    return (
        <div className="relative w-full max-w-xs">
            <input
                type="text"
                className={`w-full px-4 py-2 border focus:outline-none focus:ring rounded-full transition-colors duration-200 ${(!isHomepage || sticky) ? 'bg-white text-dark border-dark placeholder:text-dark/60' : 'bg-transparent text-white border-white placeholder:text-white/60'}`}
                placeholder="Search..."
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setShowResults(true);
                }}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
                onFocus={() => {
                    setShowResults(true);
                    fetchProducts();
                }}
            />
            {showResults && query && (
                <div className="absolute left-1/2 -translate-x-1/2 bg-white border rounded shadow z-20 max-h-[400px] overflow-y-auto p-4 w-[90vw] sm:w-[600px] md:w-[700px]">
                    {loading ? (
                        <div className="px-4 py-2 text-gray-500">Loading...</div>
                    ) : filtered.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                            {filtered.map((item) => (
                                <Link
                                    key={item.slug}
                                    href={`/products/${item.slug}`}
                                    className="flex flex-col items-center rounded-lg p-4 hover:bg-gray-100 transition"
                                    onClick={() => setShowResults(false)}
                                >
                                    {item.images && item.images[0]?.src && (
                                        <Image
                                            src={item.images[0].src}
                                            alt={item.name}
                                            width={250}
                                            height={205}
                                            className="rounded object-cover mb-2"
                                            unoptimized={true}
                                        />
                                    )}
                                    <span className="text-center font-semibold text-black mt-2 text-base">{item.name}</span>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="px-4 py-2 text-gray-500">No results found.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Search; 