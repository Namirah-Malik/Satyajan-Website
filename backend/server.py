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
        from reportlab.platypus import SimpleDocTemplate, Spacer, Paragraph
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT
        
        # Create PDF in memory
        buffer = BytesIO()
        
        # Fixed A4 document with consistent margins
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            leftMargin=45,
            rightMargin=45,
            topMargin=45,
            bottomMargin=45
        )
        
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
        if payback_years < 0 or payback_years > 50:
            payback_years = 0
        
        # Valid until date
        valid_date = datetime(now.year, now.month, now.day)
        if now.month < 12:
            valid_date = valid_date.replace(month=now.month + 1)
        else:
            valid_date = valid_date.replace(year=now.year + 1, month=1)
        
        # Story elements
        story = []
        
        # Styles
        styles = getSampleStyleSheet()
        
        # Custom styles
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=16,
            textColor=colors.HexColor('#0066CC'),
            spaceAfter=20,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        )
        
        # ===== 1. HEADER TABLE: Logo | Company Name & Tagline =====
        header_data = [
            [
                Paragraph('<font size=10 color="#0066CC"><b>SATYAJAN<br/>ENERGY<br/>SOLUTIONS</b></font>', styles['Normal']),
                Paragraph('<font size=18 color="#0066CC"><b>SATYAJAN ENERGY SOLUTIONS</b></font><br/><font size=8>Private Limited<br/>Clean Energy for a Sustainable Future</font>', 
                         ParagraphStyle('HeaderRight', parent=styles['Normal'], alignment=TA_RIGHT))
            ]
        ]
        
        header_table = Table(header_data, colWidths=[1.5*inch, 5*inch])
        header_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ]))
        story.append(header_table)
        story.append(Spacer(1, 0.2*inch))
        
        # ===== 2. TWO-COLUMN TABLE: Customer Details | Quotation Details =====
        customer_info = f'''<font size=9 color="#0066CC"><b>CUSTOMER INFORMATION</b></font><br/>
        <font size=10><b>{data.customerName}</b></font><br/>
        <font size=8>Phone: {data.phone}<br/>
        Email: {data.email or 'N/A'}</font>'''
        
        quotation_info = f'''<font size=9 color="#0066CC"><b>QUOTATION DETAILS</b></font><br/>
        <font size=8>Quotation No: <b>{quote_num}</b><br/>
        Date: <b>{now.strftime("%d %B %Y")}</b><br/>
        Valid Until: <b>{valid_date.strftime("%d %B %Y")}</b></font>'''
        
        info_data = [[
            Paragraph(customer_info, styles['Normal']),
            Paragraph(quotation_info, ParagraphStyle('QuoteInfo', parent=styles['Normal'], alignment=TA_RIGHT))
        ]]
        
        info_table = Table(info_data, colWidths=[3.25*inch, 3.25*inch])
        info_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LINEBELOW', (0, 0), (0, 0), 1, colors.HexColor('#0066CC')),
            ('LINEBELOW', (1, 0), (1, 0), 1, colors.HexColor('#0066CC')),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ]))
        story.append(info_table)
        story.append(Spacer(1, 0.3*inch))
        
        # ===== 3. TITLE: SOLAR SYSTEM QUOTATION =====
        story.append(Paragraph('SOLAR SYSTEM QUOTATION', title_style))
        story.append(Spacer(1, 0.2*inch))
        
        # ===== 4. ENERGY ANALYSIS TABLE =====
        energy_title = [[Paragraph('<font size=10 color="#0066CC"><b>ENERGY ANALYSIS & SAVINGS PROJECTION</b></font>', styles['Normal'])]]
        energy_title_table = Table(energy_title, colWidths=[6.5*inch])
        energy_title_table.setStyle(TableStyle([
            ('LINEBELOW', (0, 0), (-1, -1), 1, colors.HexColor('#0066CC')),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ]))
        story.append(energy_title_table)
        story.append(Spacer(1, 0.1*inch))
        
        energy_data = [
            ['Parameter', 'Value'],
            ['Current Monthly Electricity Bill', f'₹{int(data.monthlyBill):,}'],
            ['Recommended Solar System Capacity', f'{data.systemCapacity} kW'],
            ['Estimated Monthly Generation', f'{monthly_units} units'],
            ['Estimated Monthly Savings', f'₹{int(monthly_savings):,}'],
        ]
        
        if payback_years > 0:
            energy_data.append(['Estimated Payback Period', f'{payback_years} years'])
        
        energy_table = Table(energy_data, colWidths=[4*inch, 2.5*inch])
        energy_table.setStyle(TableStyle([
            # Header
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0066CC')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 9),
            ('ALIGN', (0, 0), (0, -1), 'LEFT'),
            ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
            # Body
            ('FONTNAME', (0, 1), (0, -1), 'Helvetica'),
            ('FONTNAME', (1, 1), (1, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 1), (-1, -1), 9),
            ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor('#F5F5F5')),
            ('BACKGROUND', (0, 3), (-1, 3), colors.HexColor('#F5F5F5')),
            ('BACKGROUND', (0, 5), (-1, 5), colors.HexColor('#F5F5F5')),
            # Borders
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#D0D0D0')),
            ('LINEABOVE', (0, 0), (-1, 0), 1, colors.HexColor('#0066CC')),
            # Padding
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ]))
        story.append(energy_table)
        story.append(Spacer(1, 0.3*inch))
        
        # ===== 5. SYSTEM CONFIGURATION & PRICING TABLE =====
        config_title = [[Paragraph('<font size=10 color="#0066CC"><b>SYSTEM CONFIGURATION & PRICING</b></font>', styles['Normal'])]]
        config_title_table = Table(config_title, colWidths=[6.5*inch])
        config_title_table.setStyle(TableStyle([
            ('LINEBELOW', (0, 0), (-1, -1), 1, colors.HexColor('#0066CC')),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ]))
        story.append(config_title_table)
        story.append(Spacer(1, 0.1*inch))
        
        config_data = [
            ['Description', 'Specification', 'Unit Price', 'Amount'],
            ['Solar System Type', data.systemType, '', ''],
            ['System Capacity', f'{data.systemCapacity} kW', '', ''],
            ['Solar Panel Type', data.panelType, '', ''],
            ['Inverter Specification', data.inverterType, '', ''],
            ['Complete Solar System', f'Quantity: {data.quantity}', 
             f'₹{int(data.price):,}', f'₹{int(subtotal):,}'],
        ]
        
        config_table = Table(config_data, colWidths=[2.3*inch, 2.0*inch, 1.2*inch, 1.0*inch])
        config_table.setStyle(TableStyle([
            # Header
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0066CC')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 9),
            ('ALIGN', (0, 0), (1, 0), 'LEFT'),
            ('ALIGN', (2, 0), (3, 0), 'RIGHT'),
            # Body
            ('FONTNAME', (0, 1), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (1, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 9),
            ('ALIGN', (2, 1), (3, -1), 'RIGHT'),
            ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
            ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
            ('BACKGROUND', (0, 5), (-1, 5), colors.HexColor('#E3F2FD')),
            ('FONTNAME', (0, 5), (-1, 5), 'Helvetica-Bold'),
            # Borders
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#D0D0D0')),
            ('LINEABOVE', (0, 0), (-1, 0), 1, colors.HexColor('#0066CC')),
            ('LINEBELOW', (0, -1), (-1, -1), 1, colors.HexColor('#0066CC')),
            # Padding
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ]))
        story.append(config_table)
        story.append(Spacer(1, 0.2*inch))
        
        # ===== 6. TOTALS SECTION WITH GRAND TOTAL =====
        totals_data = [
            ['Subtotal', f'₹{int(subtotal):,}'],
            [f'GST ({int(data.gstRate)}%)', f'₹{int(gst):,}'],
            ['GRAND TOTAL', f'₹{int(total):,}'],
        ]
        
        totals_table = Table(totals_data, colWidths=[4.5*inch, 2.0*inch])
        totals_table.setStyle(TableStyle([
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
            ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
            ('FONTNAME', (0, 0), (-1, 1), 'Helvetica'),
            # Grand Total row
            ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#0066CC')),
            ('TEXTCOLOR', (0, 2), (-1, 2), colors.whitesmoke),
            ('FONTNAME', (0, 2), (-1, 2), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 2), (-1, 2), 12),
            ('LINEABOVE', (0, 0), (-1, 0), 0.5, colors.grey),
            ('LINEABOVE', (0, 2), (-1, 2), 1, colors.HexColor('#0066CC')),
            ('LINEBELOW', (0, 2), (-1, 2), 1, colors.HexColor('#0066CC')),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ]))
        story.append(totals_table)
        story.append(Spacer(1, 0.3*inch))
        
        # ===== NOTES (if any) =====
        if data.notes:
            notes_title = [[Paragraph('<font size=9 color="#0066CC"><b>SPECIAL NOTES</b></font>', styles['Normal'])]]
            notes_title_table = Table(notes_title, colWidths=[6.5*inch])
            notes_title_table.setStyle(TableStyle([
                ('LINEBELOW', (0, 0), (-1, -1), 1, colors.HexColor('#0066CC')),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ]))
            story.append(notes_title_table)
            story.append(Spacer(1, 0.05*inch))
            
            notes_text = Paragraph(f'<font size=8>{data.notes[:200]}</font>', styles['Normal'])
            story.append(notes_text)
            story.append(Spacer(1, 0.2*inch))
        
        # ===== 7. TERMS & CONDITIONS =====
        terms_title = [[Paragraph('<font size=9 color="#0066CC"><b>TERMS & CONDITIONS</b></font>', styles['Normal'])]]
        terms_title_table = Table(terms_title, colWidths=[6.5*inch])
        terms_title_table.setStyle(TableStyle([
            ('LINEBELOW', (0, 0), (-1, -1), 1, colors.HexColor('#0066CC')),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ]))
        story.append(terms_title_table)
        story.append(Spacer(1, 0.05*inch))
        
        terms_text = '''<font size=7>
        1. Quotation validity: 30 days from date of issue.<br/>
        2. Payment terms: 50% advance, balance 50% on completion of installation.<br/>
        3. Prices inclusive of GST. Standard installation included.<br/>
        4. Solar panels: 25-year performance warranty | Inverter: 5-10 years.<br/>
        5. Structure: 10-year warranty | Free maintenance: First year.<br/>
        6. Net metering & subsidy assistance provided.
        </font>'''
        
        story.append(Paragraph(terms_text, styles['Normal']))
        story.append(Spacer(1, 0.3*inch))
        
        # ===== 8. SIGNATURE BLOCK AND FOOTER =====
        signature_data = [
            [
                Paragraph('<font size=8><b>For Satyajan Energy Solutions Pvt Ltd</b><br/><br/><br/>_________________________<br/>Authorized Signatory</font>', styles['Normal']),
                Paragraph('<font size=7 color="grey">[Company Seal]</font>', 
                         ParagraphStyle('SealRight', parent=styles['Normal'], alignment=TA_CENTER))
            ]
        ]
        
        signature_table = Table(signature_data, colWidths=[4*inch, 2.5*inch])
        signature_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('BOX', (1, 0), (1, 0), 1, colors.HexColor('#D0D0D0')),
        ]))
        story.append(signature_table)
        story.append(Spacer(1, 0.2*inch))
        
        # Footer
        footer_text = '''<para align=center>
        <font size=8 color="#0066CC"><b>Satyajan Energy Solutions Private Limited</b></font><br/>
        <font size=7>Phone: +91 8019179159 | Email: info@satyajanenergy.com | www.satyajanenergy.com</font>
        </para>'''
        story.append(Paragraph(footer_text, styles['Normal']))
        
        # Build PDF
        doc.build(story)
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
        import traceback
        traceback.print_exc()
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