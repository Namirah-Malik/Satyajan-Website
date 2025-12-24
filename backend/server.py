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
        left_margin = 50
        right_margin = width - 50
        
        # Generate quotation number
        now = datetime.now()
        quote_num = f"SJES-SOLAR-{now.strftime('%Y%m')}-{now.strftime('%H%M%S')[-3:]}"
        
        # Calculate solar metrics
        monthly_units = round(data.systemCapacity * 4.5 * 30)
        monthly_savings = min(monthly_units * 8, data.monthlyBill)
        subtotal = data.quantity * data.price
        gst = subtotal * data.gstRate / 100
        total = subtotal + gst
        # Fix payback calculation - ensure it's realistic
        payback_years = round(total / (monthly_savings * 12), 1) if monthly_savings > 0 else 0
        if payback_years < 0 or payback_years > 50:
            payback_years = 0
        
        # ===== HEADER SECTION =====
        # Blue header bar (thin)
        pdf.setFillColorRGB(0, 0.4, 0.8)
        pdf.rect(0, height - 60, width, 60, fill=1)
        
        # Company name
        pdf.setFillColorRGB(1, 1, 1)
        pdf.setFont("Helvetica-Bold", 22)
        pdf.drawCentredString(width/2, height - 30, "SATYAJAN ENERGY SOLUTIONS")
        pdf.setFont("Helvetica", 9)
        pdf.drawCentredString(width/2, height - 45, "Private Limited | Clean Energy for a Sustainable Future")
        
        # ===== DOCUMENT TITLE =====
        pdf.setFillColorRGB(0, 0.4, 0.8)
        pdf.setFont("Helvetica-Bold", 16)
        pdf.drawCentredString(width/2, height - 85, "SOLAR SYSTEM QUOTATION")
        
        # Thin blue line under title
        pdf.setStrokeColorRGB(0, 0.4, 0.8)
        pdf.setLineWidth(1)
        pdf.line(left_margin, height - 92, right_margin, height - 92)
        
        # ===== QUOTATION DETAILS & CUSTOMER INFO (Side by side) =====
        y_pos = height - 115
        
        # Left: Customer Details
        pdf.setFillColorRGB(0, 0, 0)
        pdf.setFont("Helvetica-Bold", 10)
        pdf.drawString(left_margin, y_pos, "BILL TO:")
        
        y_pos -= 15
        pdf.setFont("Helvetica-Bold", 11)
        pdf.drawString(left_margin, y_pos, data.customerName)
        
        y_pos -= 13
        pdf.setFont("Helvetica", 9)
        pdf.drawString(left_margin, y_pos, f"Phone: {data.phone}")
        
        y_pos -= 12
        pdf.drawString(left_margin, y_pos, f"Email: {data.email or 'N/A'}")
        
        # Right: Quotation Details (aligned to right)
        y_pos = height - 115
        pdf.setFont("Helvetica", 9)
        pdf.setFillColorRGB(0.3, 0.3, 0.3)
        
        label_x = right_margin - 140
        value_x = right_margin
        
        pdf.drawString(label_x, y_pos, "Quotation No:")
        pdf.drawRightString(value_x, y_pos, quote_num)
        
        y_pos -= 13
        pdf.drawString(label_x, y_pos, "Date:")
        pdf.drawRightString(value_x, y_pos, now.strftime("%d %B %Y"))
        
        y_pos -= 13
        pdf.drawString(label_x, y_pos, "Valid Until:")
        valid_date = datetime(now.year, now.month, now.day)
        if now.month < 12:
            valid_date = valid_date.replace(month=now.month + 1)
        else:
            valid_date = valid_date.replace(year=now.year + 1, month=1)
        pdf.drawRightString(value_x, y_pos, valid_date.strftime("%d %B %Y"))
        
        # ===== ENERGY ANALYSIS SECTION =====
        y_pos = height - 190
        
        # Section header
        pdf.setFillColorRGB(0, 0.4, 0.8)
        pdf.setFont("Helvetica-Bold", 11)
        pdf.drawString(left_margin, y_pos, "ENERGY ANALYSIS & SAVINGS")
        
        # Thin line under header
        pdf.setStrokeColorRGB(0.9, 0.9, 0.9)
        pdf.setLineWidth(0.5)
        pdf.line(left_margin, y_pos - 3, right_margin, y_pos - 3)
        
        y_pos -= 20
        pdf.setFillColorRGB(0, 0, 0)
        pdf.setFont("Helvetica", 9)
        
        # Energy data in two columns
        col1_x = left_margin
        col2_x = width/2 + 20
        
        pdf.drawString(col1_x, y_pos, "Current Monthly Bill:")
        pdf.setFont("Helvetica-Bold", 9)
        pdf.drawString(col1_x + 110, y_pos, f"₹{int(data.monthlyBill):,}")
        
        pdf.setFont("Helvetica", 9)
        pdf.drawString(col2_x, y_pos, "Est. Monthly Generation:")
        pdf.setFont("Helvetica-Bold", 9)
        pdf.drawString(col2_x + 120, y_pos, f"{monthly_units} units")
        
        y_pos -= 13
        pdf.setFont("Helvetica", 9)
        pdf.drawString(col1_x, y_pos, "Recommended System:")
        pdf.setFont("Helvetica-Bold", 9)
        pdf.drawString(col1_x + 110, y_pos, f"{data.systemCapacity} kW")
        
        pdf.setFont("Helvetica", 9)
        pdf.drawString(col2_x, y_pos, "Est. Monthly Savings:")
        pdf.setFont("Helvetica-Bold", 9)
        pdf.drawString(col2_x + 120, y_pos, f"₹{int(monthly_savings):,}")
        
        # Payback period (highlighted)
        if payback_years > 0:
            y_pos -= 13
            pdf.setFont("Helvetica", 9)
            pdf.drawString(col1_x, y_pos, "Payback Period:")
            pdf.setFont("Helvetica-Bold", 10)
            pdf.setFillColorRGB(0, 0.5, 0)
            pdf.drawString(col1_x + 110, y_pos, f"~{payback_years} years")
        
        # ===== SYSTEM SPECIFICATIONS TABLE =====
        y_pos -= 35
        
        # Section header
        pdf.setFillColorRGB(0, 0.4, 0.8)
        pdf.setFont("Helvetica-Bold", 11)
        pdf.drawString(left_margin, y_pos, "SYSTEM SPECIFICATIONS")
        
        pdf.setStrokeColorRGB(0.9, 0.9, 0.9)
        pdf.line(left_margin, y_pos - 3, right_margin, y_pos - 3)
        
        # Clean table
        table_data = [
            ['Component', 'Specification', 'Unit Price', 'Amount'],
            ['System Type', data.systemType, '', ''],
            ['System Capacity', f'{data.systemCapacity} kW', '', ''],
            ['Solar Panel Type', data.panelType, '', ''],
            ['Inverter Type', data.inverterType, '', ''],
            ['Complete Solar System', f'Quantity: {data.quantity}', 
             f'₹{int(data.price):,}', f'₹{int(subtotal):,}'],
        ]
        
        table = Table(table_data, colWidths=[2.6*inch, 2.4*inch, 1*inch, 1*inch])
        table.setStyle(TableStyle([
            # Header row
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0066CC')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 9),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
            ('TOPPADDING', (0, 0), (-1, 0), 8),
            
            # Body rows
            ('FONTNAME', (0, 1), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (1, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 9),
            ('ALIGN', (2, 1), (3, -1), 'RIGHT'),
            ('TOPPADDING', (0, 1), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 6),
            
            # Light gray alternating rows
            ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F9F9F9')),
            ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F9F9F9')),
            
            # Total row highlight
            ('BACKGROUND', (0, 5), (-1, 5), colors.HexColor('#E8F4FD')),
            ('FONTNAME', (0, 5), (-1, 5), 'Helvetica-Bold'),
            
            # Clean borders
            ('LINEABOVE', (0, 0), (-1, 0), 1, colors.HexColor('#0066CC')),
            ('LINEBELOW', (0, 0), (-1, 0), 1, colors.HexColor('#0066CC')),
            ('LINEBELOW', (0, -1), (-1, -1), 1, colors.grey),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E0E0E0')),
        ]))
        
        table.wrapOn(pdf, width, height)
        table.drawOn(pdf, left_margin, y_pos - 130)
        
        # ===== PRICING SUMMARY =====
        y_pos = y_pos - 160
        
        # Summary box with clean design
        summary_x = right_margin - 180
        
        pdf.setFont("Helvetica", 10)
        pdf.setFillColorRGB(0, 0, 0)
        
        pdf.drawString(summary_x, y_pos, "Subtotal:")
        pdf.drawRightString(right_margin, y_pos, f"₹{int(subtotal):,}")
        
        y_pos -= 15
        pdf.drawString(summary_x, y_pos, f"GST ({int(data.gstRate)}%):")
        pdf.drawRightString(right_margin, y_pos, f"₹{int(gst):,}")
        
        # Thin line
        y_pos -= 5
        pdf.setStrokeColorRGB(0.8, 0.8, 0.8)
        pdf.line(summary_x, y_pos, right_margin, y_pos)
        
        # Grand Total - Highlighted
        y_pos -= 15
        pdf.setFont("Helvetica-Bold", 12)
        pdf.setFillColorRGB(0, 0.4, 0.8)
        pdf.drawString(summary_x, y_pos, "GRAND TOTAL:")
        pdf.setFillColorRGB(0, 0.4, 0.8)
        pdf.setFont("Helvetica-Bold", 14)
        pdf.drawRightString(right_margin, y_pos, f"₹{int(total):,}")
        
        # ===== NOTES SECTION =====
        if data.notes:
            y_pos -= 30
            pdf.setFillColorRGB(0, 0.4, 0.8)
            pdf.setFont("Helvetica-Bold", 10)
            pdf.drawString(left_margin, y_pos, "SPECIAL NOTES")
            
            pdf.setStrokeColorRGB(0.9, 0.9, 0.9)
            pdf.line(left_margin, y_pos - 3, right_margin, y_pos - 3)
            
            y_pos -= 15
            pdf.setFillColorRGB(0, 0, 0)
            pdf.setFont("Helvetica", 9)
            notes_lines = data.notes[:200].split('\n')
            for line in notes_lines[:3]:
                pdf.drawString(left_margin, y_pos, line[:90])
                y_pos -= 12
        
        # ===== TERMS & CONDITIONS =====
        y_pos -= 20 if data.notes else 40
        
        pdf.setFillColorRGB(0, 0.4, 0.8)
        pdf.setFont("Helvetica-Bold", 10)
        pdf.drawString(left_margin, y_pos, "TERMS & CONDITIONS")
        
        pdf.setStrokeColorRGB(0.9, 0.9, 0.9)
        pdf.line(left_margin, y_pos - 3, right_margin, y_pos - 3)
        
        y_pos -= 15
        pdf.setFillColorRGB(0, 0, 0)
        pdf.setFont("Helvetica", 8)
        
        terms = [
            "1. This quotation is valid for 30 days from the date of issue.",
            "2. Payment Terms: 50% advance payment, 50% on completion of installation.",
            "3. All prices are inclusive of GST.",
            "4. Installation charges included (subject to standard site conditions).",
            "5. Solar panel warranty: 25 years performance warranty.",
            "6. Inverter warranty: As per manufacturer (typically 5-10 years).",
            "7. Structure warranty: 10 years against rust and corrosion.",
            "8. Free maintenance for the first year. Net metering assistance provided.",
        ]
        
        for term in terms:
            pdf.drawString(left_margin, y_pos, term)
            y_pos -= 11
        
        # ===== SIGNATURE SECTION =====
        y_pos = 115
        
        pdf.setFont("Helvetica-Bold", 9)
        pdf.drawString(left_margin, y_pos, "For Satyajan Energy Solutions Pvt Ltd")
        
        pdf.setStrokeColorRGB(0, 0, 0)
        pdf.setLineWidth(0.5)
        pdf.line(left_margin, y_pos - 25, left_margin + 150, y_pos - 25)
        
        pdf.setFont("Helvetica", 8)
        pdf.drawString(left_margin, y_pos - 35, "Authorized Signatory")
        
        # Stamp area (subtle)
        pdf.setStrokeColorRGB(0.8, 0.8, 0.8)
        pdf.setDash(2, 2)
        pdf.rect(right_margin - 100, y_pos - 40, 100, 40, fill=0, stroke=1)
        pdf.setDash()
        
        pdf.setFont("Helvetica", 7)
        pdf.setFillColorRGB(0.6, 0.6, 0.6)
        pdf.drawCentredString(right_margin - 50, y_pos - 15, "Company Stamp")
        
        # ===== FOOTER =====
        pdf.setFillColorRGB(0, 0.4, 0.8)
        pdf.rect(0, 0, width, 35, fill=1)
        
        pdf.setFillColorRGB(1, 1, 1)
        pdf.setFont("Helvetica", 8)
        pdf.drawCentredString(width/2, 20, "Satyajan Energy Solutions Private Limited")
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