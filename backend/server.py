from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone
from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import Table, TableStyle


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str


# Product Models
class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    sku: str
    category: str
    image: str
    images: List[str]
    description: str
    features: List[str]
    offerPrice: float
    mrp: float
    specifications: Dict[str, str]
    warranty: str
    inStock: bool
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updatedAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ProductCreate(BaseModel):
    name: str
    sku: str
    category: str
    image: str
    images: List[str]
    description: str
    features: List[str]
    offerPrice: float
    mrp: float
    specifications: Dict[str, str]
    warranty: str
    inStock: bool = True


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    sku: Optional[str] = None
    category: Optional[str] = None
    image: Optional[str] = None
    images: Optional[List[str]] = None
    description: Optional[str] = None
    features: Optional[List[str]] = None
    offerPrice: Optional[float] = None
    mrp: Optional[float] = None
    specifications: Optional[Dict[str, str]] = None
    warranty: Optional[str] = None
    inStock: Optional[bool] = None


# Solar Quotation Model
class SolarQuotationRequest(BaseModel):
    customerName: str
    phone: str
    email: Optional[str] = None
    monthlyBill: float
    systemType: str
    systemCapacity: float
    panelType: str
    inverterType: str
    quantity: int = 1
    price: float
    gstRate: float = 18
    notes: Optional[str] = None

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


# Product API Endpoints

@api_router.get("/products", response_model=List[Product])
async def get_products(category: Optional[str] = None):
    """Get all products or filter by category"""
    query = {} if not category or category == 'all' else {"category": category}
    products = await db.products.find(query, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for product in products:
        if isinstance(product.get('createdAt'), str):
            product['createdAt'] = datetime.fromisoformat(product['createdAt'])
        if isinstance(product.get('updatedAt'), str):
            product['updatedAt'] = datetime.fromisoformat(product['updatedAt'])
    
    return products


@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    """Get a single product by ID"""
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    
    if not product:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Convert ISO strings to datetime
    if isinstance(product.get('createdAt'), str):
        product['createdAt'] = datetime.fromisoformat(product['createdAt'])
    if isinstance(product.get('updatedAt'), str):
        product['updatedAt'] = datetime.fromisoformat(product['updatedAt'])
    
    return product


@api_router.post("/products", response_model=Product)
async def create_product(input: ProductCreate):
    """Create a new product"""
    product_dict = input.model_dump()
    product_obj = Product(**product_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = product_obj.model_dump()
    doc['createdAt'] = doc['createdAt'].isoformat()
    doc['updatedAt'] = doc['updatedAt'].isoformat()
    
    await db.products.insert_one(doc)
    return product_obj


@api_router.put("/products/{product_id}", response_model=Product)
async def update_product(product_id: str, input: ProductUpdate):
    """Update an existing product"""
    from fastapi import HTTPException
    
    # Check if product exists
    existing_product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not existing_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Get only the fields that were provided
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    
    if update_data:
        update_data['updatedAt'] = datetime.now(timezone.utc).isoformat()
        await db.products.update_one({"id": product_id}, {"$set": update_data})
    
    # Fetch and return updated product
    updated_product = await db.products.find_one({"id": product_id}, {"_id": 0})
    
    # Convert ISO strings to datetime
    if isinstance(updated_product.get('createdAt'), str):
        updated_product['createdAt'] = datetime.fromisoformat(updated_product['createdAt'])
    if isinstance(updated_product.get('updatedAt'), str):
        updated_product['updatedAt'] = datetime.fromisoformat(updated_product['updatedAt'])
    
    return updated_product


@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str):
    """Delete a product"""
    from fastapi import HTTPException
    
    result = await db.products.delete_one({"id": product_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return {"message": "Product deleted successfully", "id": product_id}


# Solar Quotation PDF Generation Endpoint
@api_router.post("/generate-solar-quotation")
async def generate_solar_quotation(data: SolarQuotationRequest):
    """Generate professional solar quotation PDF"""
    try:
        # Create PDF in memory
        buffer = BytesIO()
        pdf = canvas.Canvas(buffer, pagesize=A4)
        width, height = A4
        
        # Generate quotation number
        now = datetime.now()
        quote_num = f"SJES-SOLAR-{now.strftime('%Y%m')}-{now.strftime('%H%M%S')[-3:]}"
        
        # Calculate solar metrics
        monthly_units = round(data.systemCapacity * 4.5 * 30)
        monthly_savings = min(monthly_units * 8, data.monthlyBill)
        subtotal = data.quantity * data.price
        gst = subtotal * data.gstRate / 100
        total = subtotal + gst
        payback_years = round(total / (monthly_savings * 12), 1) if monthly_savings > 0 else 0
        
        # Header - Blue gradient effect
        pdf.setFillColorRGB(0, 0.4, 0.8)
        pdf.rect(0, height - 100, width, 100, fill=1)
        
        # Draw sun icon
        pdf.setFillColorRGB(1, 0.76, 0.03)
        pdf.circle(50, height - 50, 20, fill=1)
        
        # Draw sun rays
        pdf.setStrokeColorRGB(1, 0.76, 0.03)
        pdf.setLineWidth(3)
        for i in range(8):
            angle = i * 45
            import math
            x1 = 50 + 25 * math.cos(math.radians(angle))
            y1 = height - 50 + 25 * math.sin(math.radians(angle))
            x2 = 50 + 35 * math.cos(math.radians(angle))
            y2 = height - 50 + 35 * math.sin(math.radians(angle))
            pdf.line(x1, y1, x2, y2)
        
        # Company name
        pdf.setFillColorRGB(1, 1, 1)
        pdf.setFont("Helvetica-Bold", 24)
        pdf.drawCentredString(width/2, height - 40, "SATYAJAN ENERGY SOLUTIONS")
        
        pdf.setFont("Helvetica", 10)
        pdf.drawCentredString(width/2, height - 55, "Private Limited")
        pdf.drawCentredString(width/2, height - 70, "Professional Solar & Power Backup Solutions")
        pdf.drawCentredString(width/2, height - 85, "Clean Energy for a Sustainable Future")
        
        # Title
        pdf.setFillColorRGB(0, 0.4, 0.8)
        pdf.setFont("Helvetica-Bold", 18)
        pdf.drawCentredString(width/2, height - 120, "SOLAR SYSTEM QUOTATION")
        
        # Quotation details box
        pdf.setFillColorRGB(0.98, 0.98, 0.98)
        pdf.rect(400, height - 180, 150, 60, fill=1, stroke=1)
        
        pdf.setFillColorRGB(0, 0, 0)
        pdf.setFont("Helvetica-Bold", 9)
        pdf.drawString(410, height - 145, "Quotation No:")
        pdf.drawString(410, height - 160, "Date:")
        pdf.drawString(410, height - 175, "Valid Until:")
        
        pdf.setFont("Helvetica", 9)
        pdf.drawString(485, height - 145, quote_num)
        pdf.drawString(485, height - 160, now.strftime("%d %B %Y"))
        valid_date = datetime(now.year, now.month, now.day) 
        if now.day > 1:
            valid_date = valid_date.replace(day=now.day - 1)
        valid_date = valid_date.replace(month=now.month + 1 if now.month < 12 else 1, 
                                       year=now.year if now.month < 12 else now.year + 1)
        pdf.drawString(485, height - 175, valid_date.strftime("%d %B %Y"))
        
        # Customer details box
        pdf.setFillColorRGB(0.96, 0.97, 1)
        pdf.rect(50, height - 180, 330, 60, fill=1, stroke=1)
        
        pdf.setFillColorRGB(0, 0.4, 0.8)
        pdf.setFont("Helvetica-Bold", 11)
        pdf.drawString(60, height - 135, "Customer Details:")
        
        pdf.setFillColorRGB(0, 0, 0)
        pdf.setFont("Helvetica-Bold", 10)
        pdf.drawString(60, height - 150, data.customerName)
        pdf.setFont("Helvetica", 9)
        pdf.drawString(60, height - 163, f"Phone: {data.phone}")
        pdf.drawString(60, height - 176, f"Email: {data.email or 'N/A'}")
        
        # Energy analysis box
        pdf.setFillColorRGB(1, 0.98, 0.92)
        pdf.setStrokeColorRGB(1, 0.76, 0.03)
        pdf.setLineWidth(2)
        pdf.rect(50, height - 230, 500, 40, fill=1, stroke=1)
        
        pdf.setFillColorRGB(0.8, 0.4, 0)
        pdf.setFont("Helvetica-Bold", 10)
        pdf.drawString(60, height - 205, "Energy Analysis & Savings Estimate")
        
        pdf.setFillColorRGB(0, 0, 0)
        pdf.setFont("Helvetica", 9)
        pdf.drawString(60, height - 218, f"Current Monthly Bill: ₹{int(data.monthlyBill):,}")
        pdf.drawString(60, height - 228, f"Recommended System: {data.systemCapacity} kW")
        pdf.drawString(250, height - 218, f"Est. Monthly Generation: {monthly_units} units")
        pdf.drawString(250, height - 228, f"Est. Monthly Savings: ₹{int(monthly_savings):,}")
        
        pdf.setFont("Helvetica-Bold", 9)
        pdf.setFillColorRGB(0, 0.5, 0)
        pdf.drawString(440, height - 223, f"Payback: ~{payback_years} yrs")
        
        # System specifications table
        table_data = [
            ['Component', 'Specification', 'Unit Price', 'Amount'],
            ['System Type', data.systemType, '', ''],
            ['System Capacity', f'{data.systemCapacity} kW', '', ''],
            ['Solar Panel Type', data.panelType, '', ''],
            ['Inverter Type', data.inverterType, '', ''],
            ['Complete Solar System', f'Qty: {data.quantity}', 
             f'₹{int(data.price):,}', f'₹{int(subtotal):,}'],
        ]
        
        table = Table(table_data, colWidths=[2.5*inch, 2.2*inch, 1.2*inch, 1.2*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0066CC')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('ALIGN', (2, 0), (3, -1), 'RIGHT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('FONTNAME', (0, 1), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 1), (-1, -1), 9),
            ('BACKGROUND', (0, 5), (-1, 5), colors.HexColor('#F0F8FF')),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        
        table.wrapOn(pdf, width, height)
        table.drawOn(pdf, 50, height - 430)
        
        # Pricing summary
        pdf.setFillColorRGB(0.97, 0.97, 0.97)
        pdf.rect(350, height - 470, 200, 70, fill=1, stroke=1)
        
        pdf.setFillColorRGB(0, 0, 0)
        pdf.setFont("Helvetica-Bold", 10)
        pdf.drawString(360, height - 443, "Subtotal:")
        pdf.drawString(360, height - 458, f"GST ({data.gstRate}%):")
        
        pdf.setFont("Helvetica", 10)
        pdf.drawRightString(540, height - 443, f"₹{int(subtotal):,}")
        pdf.drawRightString(540, height - 458, f"₹{int(gst):,}")
        
        # Grand total box
        pdf.setFillColorRGB(0, 0.4, 0.8)
        pdf.rect(350, height - 485, 200, 25, fill=1)
        
        pdf.setFillColorRGB(1, 1, 1)
        pdf.setFont("Helvetica-Bold", 11)
        pdf.drawString(360, height - 476, "GRAND TOTAL:")
        pdf.setFont("Helvetica-Bold", 13)
        pdf.drawRightString(540, height - 477, f"₹{int(total):,}")
        
        # Notes section
        if data.notes:
            pdf.setFillColorRGB(0, 0.4, 0.8)
            pdf.setFont("Helvetica-Bold", 10)
            pdf.drawString(50, height - 510, "Special Notes:")
            
            pdf.setFillColorRGB(0, 0, 0)
            pdf.setFont("Helvetica", 9)
            notes_lines = data.notes[:200].split('\n')
            y_pos = height - 523
            for line in notes_lines[:3]:
                pdf.drawString(50, y_pos, line[:80])
                y_pos -= 12
        
        # Terms & Conditions
        terms_y = height - 570 if data.notes else height - 520
        pdf.setFillColorRGB(0, 0.4, 0.8)
        pdf.setFont("Helvetica-Bold", 10)
        pdf.drawString(50, terms_y, "Terms & Conditions:")
        
        pdf.setFillColorRGB(0, 0, 0)
        pdf.setFont("Helvetica", 8)
        terms = [
            "• Quotation valid for 30 days from date of issue.",
            "• Payment: 50% advance, 50% on installation completion.",
            "• Prices inclusive of GST. Installation included (standard conditions).",
            "• Solar panels: 25-year performance warranty.",
            "• Inverter: 5-10 years warranty (as per manufacturer).",
            "• Structure: 10-year warranty against rust/corrosion.",
            "• Free maintenance for first year. Annual maintenance available.",
            "• Net metering assistance provided (government subsidy support available).",
        ]
        
        y_pos = terms_y - 12
        for term in terms:
            pdf.drawString(50, y_pos, term)
            y_pos -= 11
        
        # Signature section
        pdf.setFont("Helvetica-Bold", 9)
        pdf.drawString(50, 120, "For Satyajan Energy Solutions Pvt Ltd")
        
        pdf.setStrokeColorRGB(0, 0.4, 0.8)
        pdf.line(50, 105, 150, 105)
        
        pdf.setFont("Helvetica", 8)
        pdf.drawString(50, 95, "Authorized Signatory")
        
        # Stamp placeholder
        pdf.setStrokeColorRGB(0.6, 0.6, 0.6)
        pdf.setDash(3, 3)
        pdf.rect(380, 95, 80, 50, fill=0, stroke=1)
        pdf.setDash()
        
        pdf.setFont("Helvetica", 7)
        pdf.setFillColorRGB(0.5, 0.5, 0.5)
        pdf.drawCentredString(420, 120, "Company")
        pdf.drawCentredString(420, 112, "Stamp")
        
        # Footer
        pdf.setFillColorRGB(0, 0.4, 0.8)
        pdf.rect(0, 0, width, 30, fill=1)
        
        pdf.setFillColorRGB(1, 1, 1)
        pdf.setFont("Helvetica", 8)
        pdf.drawCentredString(width/2, 12, 
                            "Phone: +91 8019179159 | Email: info@satyajanenergy.com | www.satyajanenergy.com")
        
        # Save PDF
        pdf.save()
        buffer.seek(0)
        
        # Return PDF as downloadable file
        filename = f"Solar_Quotation_{quote_num}_{data.customerName.replace(' ', '_')}.pdf"
        
        return StreamingResponse(
            buffer,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"',
                "Cache-Control": "no-cache"
            }
        )
        
    except Exception as e:
        print(f"Error generating PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating PDF: {str(e)}")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()