'use client';

import HeroSub from "@/components/shared/HeroSub";
import ProductList from "@/components/Properties/ProductList";
import React from "react";
import CallMeBackModal from "@/components/CallMeBackModal";
import { useScrollModal } from "@/hooks/useScrollModal";

const page = () => {
    const { showModal, closeModal } = useScrollModal({ triggerTimeMs: 60000, showOnFooterReach: true }); // 60 seconds

    return (
        <>
            <HeroSub
                title="Discover Our Products."
                description="Explore our exclusive range of products, crafted to deliver quality, innovation, and satisfaction for every need."
                badge="Products"
            />
            <ProductList />
            <CallMeBackModal isOpen={showModal} onClose={closeModal} />
        </>
    );
};

export default page;
