'use client';

import React, { Suspense } from "react";
import CallMeBackModal from "@/components/CallMeBackModal";
import { useScrollModal } from "@/hooks/useScrollModal";
import { useSearchParams } from "next/navigation";
import ProductList from "@/components/Properties/ProductList";

// ✅ Inner component reads search params — must be inside Suspense
const ProductsContent = () => {
    const searchParams = useSearchParams();
    const category = searchParams.get('category') || undefined;
    return <ProductList initialCategory={category} />;
};

const ProductsClient = () => {
    const { showModal, closeModal } = useScrollModal({ triggerTimeMs: 60000, showOnFooterReach: true });

    return (
        <>
            {/* Suspense required by Next.js when using useSearchParams */}
            <Suspense fallback={
                <div className="text-center py-12 text-gray-500">Loading products...</div>
            }>
                <ProductsContent />
            </Suspense>
            <CallMeBackModal isOpen={showModal} onClose={closeModal} />
        </>
    );
};

export default ProductsClient;