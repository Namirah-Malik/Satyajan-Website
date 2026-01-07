import { notFound } from 'next/navigation';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import ProductDetailsClient from '@/components/ProductDetailsClient';
import { headers } from 'next/headers';

// Map category to display name
const categoryMap: Record<string, string> = {
  'solar': 'Solar Solutions',
  'inverter': 'Home UPS',
  'jumbo-ups': 'Jumbo UPS',
  'online-ups': 'Online UPS',
  'battery': 'Tubular Battery',
  'lithium': 'Lithium Batteries',
  'combos': 'Combos'
};

export default async function Details({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    
    // Get the host from headers for API call
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    
    // Fetch product from API
    const res = await fetch(`${protocol}://${host}/api/products/${slug}`, {
        cache: 'no-store'
    });
    
    if (!res.ok) {
        return notFound();
    }
    
    const data = await res.json();
    const dbProduct = data.product;
    
    if (!dbProduct) return notFound();
    
    // Map database product to expected format
    const product = {
        id: slug,
        name: dbProduct.name,
        price: dbProduct.price || 0,
        images: Array.isArray(dbProduct.images) ? dbProduct.images : [],
        salient_features: Array.isArray(dbProduct.salient_features) ? dbProduct.salient_features : [],
        features: Array.isArray(dbProduct.features) ? dbProduct.features : [],
        specifications: Array.isArray(dbProduct.specifications) ? dbProduct.specifications : [],
        description: dbProduct.description || '',
        category: categoryMap[dbProduct.category || ''] || dbProduct.category || '',
        categorySlug: dbProduct.category || '',
        SKU: dbProduct.SKU || `PROD-${dbProduct.id}`,
        data: Array.isArray(dbProduct.specifications) 
            ? dbProduct.specifications.slice(0, 3) 
            : []
    };

    // Map images to { src } and filter invalids
    const images = Array.isArray(product.images)
        ? product.images
            .filter((src: string) => !!src && (src.startsWith('/') || src.startsWith('http')))
            .map((src: string) => ({ src: src.replace(/^\/(https?:\/\/)/, '$1') }))
        : [];

    // Format price for INR with commas
    const formattedPrice = product.price ? `₹${Number(product.price).toLocaleString('en-IN')}` : 'No price listed';

    // Prepare tab contents
    const tabItems = [
        {
            title: 'Description',
            value: 'description',
            content: (
                <div className="text-dark/80 text-base mb-4 leading-relaxed">
                    <p className="mb-4">{product.description || 'No description available.'}</p>
                    {product.category && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm font-semibold text-gray-700 mb-1">Category:</p>
                            <p className="text-base text-primary font-medium">{product.category}</p>
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: 'Features',
            value: 'features',
            content: (
                <div className="mb-4">
                    {Array.isArray(product.features) && product.features.length > 0 ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {product.features.map((feature: string, idx: number) => (
                                    <div key={idx} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="w-6 h-6 flex-shrink-0 mt-0.5">
                                            <Icon icon="ph:check-circle-fill" width={24} height={24} className="text-primary" />
                                        </div>
                                        <p className="text-base text-dark leading-relaxed">{feature}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                                <p className="text-sm font-semibold text-primary mb-2">Total Features:</p>
                                <p className="text-lg font-bold text-dark">{product.features.length} Key Features</p>
                            </div>
                        </div>
                    ) : (
                        <span className="text-base text-dark">No features listed.</span>
                    )}
                </div>
            ),
        },
        {
            title: 'Specifications',
            value: 'specifications',
            content: (
                <div className="mb-4">
                    {Array.isArray((product as any).specifications) && (product as any).specifications.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                                <thead className="bg-primary/10">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">Specification</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(product as any).specifications.map((spec: any, idx: number) => (
                                        <tr key={idx} className={idx % 2 === 0 ? "bg-white hover:bg-gray-50" : "bg-gray-50 hover:bg-gray-100"} style={{ transition: 'background-color 0.2s' }}>
                                            <td className="px-6 py-4 font-medium text-gray-900 border-b border-gray-200">{spec.labal}</td>
                                            <td className="px-6 py-4 text-gray-700 border-b border-gray-200">{spec.value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-6 bg-gray-50 rounded-lg text-center">
                            <span className="text-base text-dark">No specifications listed.</span>
                        </div>
                    )}
                </div>
            ),
        },
    ];

    return (
        <ProductDetailsClient
          product={product}
          images={images}
          formattedPrice={formattedPrice}
          tabItems={tabItems}
        />
    );
}
