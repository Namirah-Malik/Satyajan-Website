import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch all products from the database
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        images: true,
        salient_features: true,
        features: true,
        specifications: true,
        category: true,
      }
    });
    
    // Extract unique categories from products
    const categories = Array.from(
      new Set(
        products
          .map(p => p.category)
          .filter((cat): cat is string => !!cat && cat.trim() !== '')
      )
    ).sort();
    
    // Disable caching to ensure fresh data
    return NextResponse.json(
      { products, categories },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products', details: error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        images: body.images,
        salient_features: body.salient_features,
        features: body.features,
        specifications: body.specifications,
        category: body.category ?? undefined,
        SKU: body.SKU,
      },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add product', details: error }, { status: 500 });
  }
} 