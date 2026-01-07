import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        
        // slug is just the product ID
        const product = await prisma.product.findUnique({
            where: { id: slug }
        });
        
        await prisma.$disconnect();
        
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
        
        return NextResponse.json({ product });
    } catch (error) {
        console.error('Error fetching product:', error);
        await prisma.$disconnect();
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}
