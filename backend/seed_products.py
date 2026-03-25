"""
Seed script to populate MongoDB with initial product data
Run this once to migrate mock data to the database
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Product data (from mock/productData.js)
PRODUCTS = [
    # Inverter / Home UPS
    {
        "id": "inv-001",
        "name": "Pure Sine Wave Home Inverter 900VA",
        "sku": "SJES-INV-900",
        "category": "inverter",
        "image": "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=500",
        "images": [
            "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
        ],
        "description": "Capacity range from 700VA to 2000VA.",
        "features": [
            "Pure sine wave output for sensitive electronics",
            "Smart battery charging with multi-stage technology",
            "Overload and short circuit protection",
        ],
        "offerPrice": 4999,
        "mrp": 6999,
        "specifications": {
            "Capacity": "900VA",
            "Output Waveform": "Pure Sine Wave",
            "Input Voltage": "140V - 270V",
            "Battery Type": "12V Tubular",
            "Charging Current": "10A",
            "Dimensions": "265 x 185 x 95 mm",
        },
        "warranty": "2 Years Manufacturer Warranty",
        "inStock": True,
    },
    {
        "id": "inv-002",
        "name": "Home Inverter 1500VA with LCD Display",
        "sku": "SJES-INV-1500",
        "category": "inverter",
        "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        "images": [
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
            "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800",
        ],
        "description": "Capacity range from 700VA to 2000VA.",
        "features": [
            "LCD display for real-time monitoring",
            "Fast charging technology",
            "Suitable for home and small office use",
        ],
        "offerPrice": 7499,
        "mrp": 9999,
        "specifications": {
            "Capacity": "1500VA",
            "Output Waveform": "Pure Sine Wave",
            "Input Voltage": "130V - 280V",
            "Battery Type": "12V Tubular",
            "Charging Current": "15A",
            "Dimensions": "285 x 205 x 110 mm",
        },
        "warranty": "3 Years Manufacturer Warranty",
        "inStock": True,
    },
    # Jumbo UPS
    {
        "id": "jumbo-001",
        "name": "Jumbo UPS 3KVA High Capacity",
        "sku": "SJES-JUMBO-3K",
        "category": "jumbo-ups",
        "image": "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=500",
        "images": [
            "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=800",
        ],
        "description": "High capacity 2KVA to 10KVA for extended backup.",
        "features": [
            "Smart overload sense and short circuit protection",
            "Perfect for offices, shops, and large homes",
            "Extended battery backup support",
        ],
        "offerPrice": 18999,
        "mrp": 24999,
        "specifications": {
            "Capacity": "3KVA / 2400W",
            "Output Waveform": "Pure Sine Wave",
            "Input Voltage": "140V - 270V",
            "Battery Configuration": "24V / 48V",
            "Charging Current": "20A",
            "Dimensions": "450 x 220 x 320 mm",
        },
        "warranty": "2 Years Comprehensive Warranty",
        "inStock": True,
    },
    {
        "id": "jumbo-002",
        "name": "Jumbo UPS 7.5KVA Industrial Grade",
        "sku": "SJES-JUMBO-7.5K",
        "category": "jumbo-ups",
        "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        "images": [
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
        ],
        "description": "High capacity 2KVA to 10KVA for extended backup.",
        "features": [
            "Industrial-grade heavy-duty design",
            "Supports multiple battery banks",
            "Digital display with complete diagnostics",
        ],
        "offerPrice": 42999,
        "mrp": 54999,
        "specifications": {
            "Capacity": "7.5KVA / 6000W",
            "Output Waveform": "Pure Sine Wave",
            "Input Voltage": "130V - 280V",
            "Battery Configuration": "48V / 96V",
            "Charging Current": "30A",
            "Dimensions": "550 x 280 x 420 mm",
        },
        "warranty": "3 Years Comprehensive Warranty",
        "inStock": True,
    },
    # Online UPS
    {
        "id": "online-001",
        "name": "Online UPS 3KVA Double Conversion",
        "sku": "SJES-ONLINE-3K",
        "category": "online-ups",
        "image": "https://images.unsplash.com/photo-1589276534126-adef63a95e05?w=500",
        "images": [
            "https://images.unsplash.com/photo-1589276534126-adef63a95e05?w=800",
        ],
        "description": "Wide range of Online UPS from 1KVA to 120KVA using the world's latest technology.",
        "features": [
            "True online double conversion technology",
            "Zero transfer time for critical equipment protection",
            "Suitable for servers, data centers, and medical equipment",
        ],
        "offerPrice": 28999,
        "mrp": 37999,
        "specifications": {
            "Capacity": "3KVA / 2700W",
            "Technology": "Online Double Conversion",
            "Input Voltage Range": "110V - 290V",
            "Output Voltage": "220V ± 1%",
            "Battery Type": "Internal 12V x 4 / External",
            "Transfer Time": "0ms",
            "Dimensions": "440 x 195 x 360 mm",
        },
        "warranty": "2 Years Onsite Warranty",
        "inStock": True,
    },
    {
        "id": "online-002",
        "name": "Online UPS 10KVA Three Phase",
        "sku": "SJES-ONLINE-10K",
        "category": "online-ups",
        "image": "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=500",
        "images": [
            "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800",
        ],
        "description": "Wide range of Online UPS from 1KVA to 120KVA using the world's latest technology.",
        "features": [
            "Three-phase input/output for industrial applications",
            "Advanced battery management system",
            "Remote monitoring capability",
        ],
        "offerPrice": 89999,
        "mrp": 119999,
        "specifications": {
            "Capacity": "10KVA / 9000W",
            "Technology": "Online Double Conversion",
            "Input": "Three Phase 380V/400V/415V",
            "Output": "Three Phase 380V/400V/415V",
            "Battery Configuration": "External 192V",
            "Transfer Time": "0ms",
            "Dimensions": "600 x 300 x 800 mm",
        },
        "warranty": "3 Years Onsite Warranty",
        "inStock": True,
    },
    # Tubular Batteries
    {
        "id": "batt-001",
        "name": "Tubular Battery 150Ah Tall Tubular",
        "sku": "SJES-BATT-150",
        "category": "battery",
        "image": "https://images.unsplash.com/photo-1592318348310-f31b61a931c8?w=500",
        "images": [
            "https://images.unsplash.com/photo-1592318348310-f31b61a931c8?w=800",
        ],
        "description": "Long-lasting tubular inverter batteries with capacities from 80Ah to 220Ah.",
        "features": [
            "Extended warranty from 36 to 60 months",
            "Compatible with all inverter brands",
            "Low maintenance with high efficiency and durability",
        ],
        "offerPrice": 12999,
        "mrp": 15999,
        "specifications": {
            "Capacity": "150Ah @ C20",
            "Voltage": "12V",
            "Technology": "Tall Tubular",
            "Weight": "~52 kg",
            "Dimensions": "504 x 191 x 450 mm",
            "Warranty": "48 Months",
        },
        "warranty": "48 Months Warranty",
        "inStock": True,
    },
    {
        "id": "batt-002",
        "name": "Tubular Battery 200Ah Jumbo",
        "sku": "SJES-BATT-200",
        "category": "battery",
        "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        "images": [
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
        ],
        "description": "Long-lasting tubular inverter batteries with capacities from 80Ah to 220Ah.",
        "features": [
            "High capacity for extended backup",
            "Corrosion-resistant design",
            "60 months warranty",
        ],
        "offerPrice": 17999,
        "mrp": 21999,
        "specifications": {
            "Capacity": "200Ah @ C20",
            "Voltage": "12V",
            "Technology": "Jumbo Tubular",
            "Weight": "~65 kg",
            "Dimensions": "504 x 220 x 475 mm",
            "Warranty": "60 Months",
        },
        "warranty": "60 Months Warranty",
        "inStock": True,
    },
    # Solar Solutions
    {
        "id": "solar-001",
        "name": "Solar Hybrid Inverter 3KW with MPPT",
        "sku": "SJES-SOLAR-3K",
        "category": "solar",
        "image": "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500",
        "images": [
            "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800",
        ],
        "description": "Complete solar solutions for retail and commercial users.",
        "features": [
            "MPPT solar charge controller built-in",
            "Grid + Solar + Battery hybrid operation",
            "Net metering compatible",
        ],
        "offerPrice": 34999,
        "mrp": 44999,
        "specifications": {
            "Capacity": "3KW / 3000VA",
            "Solar Input": "3600W (Max)",
            "MPPT Voltage Range": "60V - 115V",
            "Battery Type": "48V",
            "Technology": "PWM + MPPT Hybrid",
            "Dimensions": "480 x 240 x 360 mm",
        },
        "warranty": "5 Years Warranty",
        "inStock": True,
    },
    {
        "id": "solar-002",
        "name": "Off-Grid Solar Kit 5KW Complete System",
        "sku": "SJES-SOLAR-5K-KIT",
        "category": "solar",
        "image": "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=500",
        "images": [
            "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=800",
        ],
        "description": "Complete solar solutions for retail and commercial users.",
        "features": [
            "Complete off-grid solar system",
            "Includes panels, inverter, batteries, mounting",
            "Installation support available",
        ],
        "offerPrice": 249999,
        "mrp": 299999,
        "specifications": {
            "Solar Panel": "10 x 540W Mono PERC",
            "Inverter": "5KW Hybrid Solar Inverter",
            "Battery": "4 x 150Ah Tubular",
            "Mounting": "Galvanized Iron Structure",
            "Expected Generation": "20-25 units/day",
        },
        "warranty": "25 Years Panel, 5 Years Inverter, 4 Years Battery",
        "inStock": True,
    },
    # Combos
    {
        "id": "combo-001",
        "name": "Inverter + Battery Combo 900VA + 150Ah",
        "sku": "SJES-COMBO-900-150",
        "category": "combos",
        "image": "https://images.unsplash.com/photo-1548337138-e87d889cc369?w=500",
        "images": [
            "https://images.unsplash.com/photo-1548337138-e87d889cc369?w=800",
        ],
        "description": "Inverter + Battery combo packs designed for optimal backup performance.",
        "features": [
            "Pre-matched inverter and battery combinations",
            "Cost-effective package deals with warranty",
            "Ready-to-install solutions for immediate backup",
        ],
        "offerPrice": 16999,
        "mrp": 21999,
        "specifications": {
            "Inverter": "900VA Pure Sine Wave",
            "Battery": "150Ah Tubular",
            "Expected Backup": "4-6 hours (400W load)",
            "Warranty": "2 Years Inverter + 4 Years Battery",
        },
        "warranty": "2 Years Inverter + 4 Years Battery",
        "inStock": True,
    },
    {
        "id": "combo-002",
        "name": "Jumbo Combo 3KVA + Dual 150Ah Batteries",
        "sku": "SJES-COMBO-3K-DUAL",
        "category": "combos",
        "image": "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=500",
        "images": [
            "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800",
        ],
        "description": "Inverter + Battery combo packs designed for optimal backup performance.",
        "features": [
            "High-capacity combo for extended backup",
            "Dual battery configuration for longer runtime",
            "Ideal for shops, offices, and large homes",
        ],
        "offerPrice": 42999,
        "mrp": 54999,
        "specifications": {
            "Inverter": "3KVA Jumbo UPS",
            "Batteries": "2 x 150Ah Tubular (24V)",
            "Expected Backup": "6-8 hours (1500W load)",
            "Warranty": "2 Years Inverter + 4 Years Battery",
        },
        "warranty": "2 Years Inverter + 4 Years Battery",
        "inStock": True,
    },
]


async def seed_products():
    """Seed the database with initial product data"""
    try:
        # Check if products already exist
        existing_count = await db.products.count_documents({})
        
        if existing_count > 0:
            print(f"⚠️  Database already has {existing_count} products. Skipping seed.")
            print("   If you want to reseed, delete existing products first.")
            return
        
        # Add timestamps to all products
        now = datetime.now(timezone.utc).isoformat()
        for product in PRODUCTS:
            product['createdAt'] = now
            product['updatedAt'] = now
        
        # Insert all products
        result = await db.products.insert_many(PRODUCTS)
        
        print(f"✅ Successfully seeded {len(result.inserted_ids)} products to the database!")
        print(f"   Collection: {db.name}.products")
        
    except Exception as e:
        print(f"❌ Error seeding products: {e}")
    finally:
        client.close()


if __name__ == "__main__":
    print("🌱 Starting product database seeding...")
    asyncio.run(seed_products())
