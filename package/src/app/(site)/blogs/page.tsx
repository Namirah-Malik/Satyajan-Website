import Blog from "@/components/Blog";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Power Solutions Blog | Satyajan",
    description: "Expert insights on inverters, batteries, solar power, and energy solutions.",
};

const page = () => {
    return (
        <>
            {/* Old HeroSub removed to match the Second Website design exactly */}
            <Blog />
        </>
    );
};

export default page;