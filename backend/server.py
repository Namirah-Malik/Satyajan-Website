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
        
        # Professional margins
        left_margin = 45
        right_margin = width - 45
        col_split = width / 2
        
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
        if payback_years < 0 or payback_years > 50:
            payback_years = 0
        
        # ===== HEADER =====
        # Blue header bar
        pdf.setFillColorRGB(0, 0.4, 0.8)
        pdf.rect(0, height - 55, width, 55, fill=1)
        
        # Company name and tagline
        pdf.setFillColorRGB(1, 1, 1)
        pdf.setFont("Helvetica-Bold", 20)
        pdf.drawCentredString(width/2, height - 28, "SATYAJAN ENERGY SOLUTIONS")
        pdf.setFont("Helvetica", 8)
        pdf.drawCentredString(width/2, height - 42, "Private Limited")
        
        # ===== DOCUMENT TITLE =====
        pdf.setFillColorRGB(0, 0, 0)
        pdf.setFont("Helvetica-Bold", 14)
        pdf.drawCentredString(width/2, height - 75, "SOLAR SYSTEM QUOTATION")
        
        # ===== QUOTATION INFO & CUSTOMER INFO (Two Columns) =====
        y_pos = height - 105
        
        # Left column - Customer Information
        pdf.setFont("Helvetica-Bold", 9)
        pdf.setFillColorRGB(0, 0.4, 0.8)
        pdf.drawString(left_margin, y_pos, "CUSTOMER INFORMATION")
        
        # Subtle blue bar under header
        pdf.setFillColorRGB(0, 0.4, 0.8)
        pdf.rect(left_margin, y_pos - 3, 220, 1, fill=1)
        
        y_pos -= 15
        pdf.setFillColorRGB(0, 0, 0)
        pdf.setFont("Helvetica-Bold", 10)
        pdf.drawString(left_margin, y_pos, data.customerName)
        
        y_pos -= 12
        pdf.setFont("Helvetica", 8)
        pdf.drawString(left_margin, y_pos, f"Phone: {data.phone}")
        
        y_pos -= 10
        pdf.drawString(left_margin, y_pos, f"Email: {data.email or 'N/A'}")
        
        # Right column - Quotation Details
        y_pos = height - 105
        pdf.setFont("Helvetica-Bold", 9)
        pdf.setFillColorRGB(0, 0.4, 0.8)
        pdf.drawString(col_split, y_pos, "QUOTATION DETAILS")
        
        pdf.setFillColorRGB(0, 0.4, 0.8)
        pdf.rect(col_split, y_pos - 3, 220, 1, fill=1)
        
        y_pos -= 15
        pdf.setFillColorRGB(0, 0, 0)
        pdf.setFont("Helvetica", 8)
        
        info_label_x = col_split
        info_value_x = col_split + 80
        
        pdf.drawString(info_label_x, y_pos, "Quotation No:")
        pdf.setFont("Helvetica-Bold", 8)
        pdf.drawString(info_value_x, y_pos, quote_num)
        
        y_pos -= 12
        pdf.setFont("Helvetica", 8)
        pdf.drawString(info_label_x, y_pos, "Date:")
        pdf.setFont("Helvetica-Bold", 8)
        pdf.drawString(info_value_x, y_pos, now.strftime("%d %B %Y"))
        
        y_pos -= 10
        pdf.setFont("Helvetica", 8)
        pdf.drawString(info_label_x, y_pos, "Valid Until:")
        valid_date = datetime(now.year, now.month, now.day)
        if now.month < 12:
            valid_date = valid_date.replace(month=now.month + 1)
        else:
            valid_date = valid_date.replace(year=now.year + 1, month=1)
        pdf.setFont("Helvetica-Bold", 8)
        pdf.drawString(info_value_x, y_pos, valid_date.strftime("%d %B %Y"))
        
        # ===== ENERGY ANALYSIS TABLE =====
        y_pos = height - 180
        
        pdf.setFont("Helvetica-Bold", 10)
        pdf.setFillColorRGB(0, 0.4, 0.8)
        pdf.drawString(left_margin, y_pos, "ENERGY ANALYSIS & SAVINGS PROJECTION")
        
        pdf.setFillColorRGB(0, 0.4, 0.8)
        pdf.rect(left_margin, y_pos - 3, right_margin - left_margin, 1, fill=1)
        
        # Energy Analysis Table
        energy_data = [
            ['Parameter', 'Value'],
            ['Current Monthly Electricity Bill', f'₹{int(data.monthlyBill):,}'],
            ['Recommended Solar System Capacity', f'{data.systemCapacity} kW'],
            ['Estimated Monthly Generation', f'{monthly_units} units'],
            ['Estimated Monthly Savings', f'₹{int(monthly_savings):,}'],
        ]
        
        if payback_years > 0:
            energy_data.append(['Estimated Payback Period', f'{payback_years} years'])
        
        energy_table = Table(energy_data, colWidths=[3.5*inch, 3.0*inch])
        energy_table.setStyle(TableStyle([
            # Header row
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0066CC')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 9),
            ('ALIGN', (0, 0), (-1, 0), 'LEFT'),
            
            # Body rows
            ('FONTNAME', (0, 1), (0, -1), 'Helvetica'),
            ('FONTNAME', (1, 1), (1, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 1), (-1, -1), 9),
            ('ALIGN', (1, 1), (1, -1), 'RIGHT'),
            
            # Alternating backgrounds
            ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor('#F5F5F5')),
            ('BACKGROUND', (0, 3), (-1, 3), colors.HexColor('#F5F5F5')),
            ('BACKGROUND', (0, 5), (-1, 5), colors.HexColor('#F5F5F5')),
            
            # Borders
            ('LINEABOVE', (0, 0), (-1, 0), 1, colors.HexColor('#0066CC')),
            ('LINEBELOW', (0, -1), (-1, -1), 0.5, colors.grey),
            ('INNERGRID', (0, 0), (-1, -1), 0.25, colors.HexColor('#D0D0D0')),
            
            # Padding
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ]))
        
        energy_table.wrapOn(pdf, width, height)
        energy_table.drawOn(pdf, left_margin, y_pos - 100)
        
        # ===== SYSTEM CONFIGURATION & PRICING =====
        y_pos = y_pos - 140
        
        pdf.setFont("Helvetica-Bold", 10)
        pdf.setFillColorRGB(0, 0.4, 0.8)
        pdf.drawString(left_margin, y_pos, "SYSTEM CONFIGURATION & PRICING")
        
        pdf.setFillColorRGB(0, 0.4, 0.8)
        pdf.rect(left_margin, y_pos - 3, right_margin - left_margin, 1, fill=1)
        
        # System Configuration Table
        config_data = [
            ['Description', 'Specification', 'Unit Price', 'Amount'],
            ['Solar System Type', data.systemType, '', ''],
            ['System Capacity', f'{data.systemCapacity} kW', '', ''],
            ['Solar Panel Type', data.panelType, '', ''],
            ['Inverter Specification', data.inverterType, '', ''],
            ['Complete Solar System', f'Quantity: {data.quantity}', 
             f'₹{int(data.price):,}', f'₹{int(subtotal):,}'],
        ]
        
        config_table = Table(config_data, colWidths=[2.3*inch, 2.0*inch, 1.3*inch, 1.0*inch])
        config_table.setStyle(TableStyle([
            # Header row
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0066CC')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 9),
            ('ALIGN', (0, 0), (1, 0), 'LEFT'),
            ('ALIGN', (2, 0), (3, 0), 'RIGHT'),
            
            # Body rows
            ('FONTNAME', (0, 1), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (1, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 9),
            ('ALIGN', (2, 1), (3, -1), 'RIGHT'),
            
            # Alternating backgrounds
            ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
            ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
            
            # Total row
            ('BACKGROUND', (0, 5), (-1, 5), colors.HexColor('#E3F2FD')),
            ('FONTNAME', (0, 5), (-1, 5), 'Helvetica-Bold'),
            
            # Borders
            ('LINEABOVE', (0, 0), (-1, 0), 1, colors.HexColor('#0066CC')),
            ('LINEBELOW', (0, -1), (-1, -1), 1, colors.HexColor('#0066CC')),
            ('INNERGRID', (0, 0), (-1, -1), 0.25, colors.HexColor('#D0D0D0')),
            
            # Padding
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ]))
        
        config_table.wrapOn(pdf, width, height)
        config_table.drawOn(pdf, left_margin, y_pos - 110)
        
        # ===== PRICING SUMMARY =====
        y_pos = y_pos - 140
        
        # Summary table
        summary_data = [
            ['Subtotal', f'₹{int(subtotal):,}'],
            [f'GST ({int(data.gstRate)}%)', f'₹{int(gst):,}'],
            ['GRAND TOTAL', f'₹{int(total):,}'],
        ]
        
        summary_table = Table(summary_data, colWidths=[4.6*inch, 2.0*inch])
        summary_table.setStyle(TableStyle([
            # All rows
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
            ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
            
            # Subtotal and GST
            ('FONTNAME', (0, 0), (-1, 1), 'Helvetica'),
            ('TEXTCOLOR', (0, 0), (-1, 1), colors.black),
            
            # Grand Total row
            ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#0066CC')),
            ('TEXTCOLOR', (0, 2), (-1, 2), colors.whitesmoke),
            ('FONTNAME', (0, 2), (-1, 2), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 2), (-1, 2), 12),
            
            # Borders
            ('LINEABOVE', (0, 0), (-1, 0), 0.5, colors.grey),
            ('LINEABOVE', (0, 2), (-1, 2), 0.5, colors.grey),
            ('LINEBELOW', (0, 2), (-1, 2), 1, colors.HexColor('#0066CC')),
            
            # Padding
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ]))
        
        summary_table.wrapOn(pdf, width, height)
        summary_table.drawOn(pdf, left_margin, y_pos)
        
        # ===== NOTES =====
        if data.notes:
            y_pos = y_pos - 30
            
            pdf.setFont("Helvetica-Bold", 9)
            pdf.setFillColorRGB(0, 0.4, 0.8)
            pdf.drawString(left_margin, y_pos, "SPECIAL NOTES")
            
            pdf.setFillColorRGB(0, 0.4, 0.8)
            pdf.rect(left_margin, y_pos - 3, right_margin - left_margin, 1, fill=1)
            
            y_pos -= 12
            pdf.setFillColorRGB(0, 0, 0)
            pdf.setFont("Helvetica", 8)
            notes_lines = data.notes[:200].split('\n')
            for line in notes_lines[:3]:
                pdf.drawString(left_margin, y_pos, line[:95])
                y_pos -= 10
        
        # ===== TERMS & CONDITIONS =====
        y_pos = y_pos - 20 if data.notes else y_pos - 50
        
        pdf.setFont("Helvetica-Bold", 9)
        pdf.setFillColorRGB(0, 0.4, 0.8)
        pdf.drawString(left_margin, y_pos, "TERMS & CONDITIONS")
        
        pdf.setFillColorRGB(0, 0.4, 0.8)
        pdf.rect(left_margin, y_pos - 3, right_margin - left_margin, 1, fill=1)
        
        y_pos -= 12
        pdf.setFillColorRGB(0, 0, 0)
        pdf.setFont("Helvetica", 7)
        
        terms = [
            "1. Quotation validity: 30 days from date of issue.",
            "2. Payment terms: 50% advance, balance 50% on completion of installation.",
            "3. Prices inclusive of GST. Standard installation included.",
            "4. Solar panels: 25-year performance warranty | Inverter: 5-10 years.",
            "5. Structure: 10-year warranty | Free maintenance: First year.",
            "6. Net metering & subsidy assistance provided.",
        ]
        
        for term in terms:
            pdf.drawString(left_margin, y_pos, term)
            y_pos -= 9
        
        # ===== SIGNATURE =====
        y_pos = 105
        
        pdf.setFont("Helvetica-Bold", 8)
        pdf.drawString(left_margin, y_pos, "For Satyajan Energy Solutions Pvt Ltd")
        
        pdf.setStrokeColorRGB(0, 0, 0)
        pdf.setLineWidth(0.3)
        pdf.line(left_margin, y_pos - 20, left_margin + 120, y_pos - 20)
        
        pdf.setFont("Helvetica", 7)
        pdf.drawString(left_margin, y_pos - 28, "Authorized Signatory")
        
        # Stamp placeholder
        pdf.setStrokeColorRGB(0.75, 0.75, 0.75)
        pdf.setDash(1, 2)
        pdf.rect(right_margin - 80, y_pos - 30, 80, 35, fill=0, stroke=1)
        pdf.setDash()
        
        pdf.setFont("Helvetica", 6)
        pdf.setFillColorRGB(0.6, 0.6, 0.6)
        pdf.drawCentredString(right_margin - 40, y_pos - 10, "Company Seal")
        
        # ===== FOOTER =====
        pdf.setFillColorRGB(0, 0.4, 0.8)
        pdf.rect(0, 0, width, 30, fill=1)
        
        pdf.setFillColorRGB(1, 1, 1)
        pdf.setFont("Helvetica-Bold", 8)
        pdf.drawCentredString(width/2, 18, "Satyajan Energy Solutions Private Limited")
        
        pdf.setFont("Helvetica", 7)
        pdf.drawCentredString(width/2, 9, 
                            "Phone: +91 8019179159 | Email: info@satyajanenergy.com | www.satyajanenergy.com")
        
        # Save PDF
        pdf.save()
        buffer.seek(0)
        
        # Return PDF
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