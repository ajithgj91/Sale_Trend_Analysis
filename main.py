from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import create_engine, Column, Integer, String, Text, Float, Date, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.sql import func
from fastapi import FastAPI, Depends, Query
import datetime
from datetime import date
from typing import Dict
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_
from reportlab.lib.pagesizes import landscape, letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Spacer, Paragraph
from fastapi.responses import StreamingResponse
from reportlab.lib.styles import getSampleStyleSheet
from fastapi import FastAPI, Depends, Query, HTTPException
from io import StringIO, BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib import colors
import csv

# import io
# import pandas as pd
# import traceback
# from sqlalchemy.exc import SQLAlchemyError

app = FastAPI()
# Database setup
DATABASE_URL =  "mysql+mysqlconnector://root:ajith@localhost/sales_db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    contact_number = Column(String(15), nullable=False)
    gst_number = Column(String(50), nullable=True)
    state = Column(String(50), nullable=False)
    address = Column(String(200), nullable=True)
    
class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    supplier_id = Column(String, unique=True, index=True)
    name = Column(String)
    email = Column(String, unique=True)
    contact_number = Column(String)
    gst_number = Column(String)
    state = Column(String)
    address = Column(String)

class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(String, index=True)
    customer_name = Column(String)
    address = Column(String)
    contact_number = Column(String)
    payment_type = Column(String)
    invoice_id = Column(String, unique=True, index=True)
    product_name = Column(String)
    quantity = Column(Integer)
    amount = Column(Float)
    tax = Column(Float)
    total = Column(Float)
    date = Column(Date)
    
class Purchase(Base):
    __tablename__ = "purchases"

    id = Column(Integer, primary_key=True, index=True)
    supplier_id = Column(String, index=True)
    supplier_name = Column(String)
    address = Column(String)
    contact_number = Column(String)
    payment_type = Column(String)
    purchase_id = Column(String, unique=True, index=True)
    product_type = Column(String)
    amount = Column(Float)
    tax = Column(Float)
    net_amount = Column(Float)
    date = Column(Date)

Base.metadata.create_all(bind=engine)

class CustomerCreate(BaseModel):
    client_id: str
    name: str
    email: str
    contact_number: str
    gst_number: str
    state: str
    address: str

class CustomerResponse(CustomerCreate):
    id: int

    class Config:
        orm_mode = True
    
class SupplierBase(BaseModel):
    supplier_id: str
    name: str
    email: str
    contact_number: str
    gst_number: str
    state: str
    address: str

class SupplierCreate(SupplierBase):
    pass

class SupplierResponse(SupplierBase):
    id: int

    class Config:
        orm_mode = True

class SaleBase(BaseModel):
    client_id: str
    customer_name: str
    address: str
    contact_number: str
    payment_type: str
    invoice_id: str
    product_name: str
    quantity: int
    amount: float
    tax: float
    total: float
    date: date

class SaleCreate(SaleBase):
    pass


class SaleUpdate(SaleBase):
    pass

class SaleResponse(SaleBase):
    id: int

    class Config:
        orm_mode = True
        
class ProductSalesResponse(BaseModel):
    productName: str
    quantity: int

    class Config:
        orm_mode = True
        
class TotalSalesResponse(BaseModel):
    total: float

    class Config:
        orm_mode = True
class TotalSalesResponseGST(BaseModel):
    amount: float

    class Config:
        orm_mode = True   # For ORM compatibility
        
class PurchaseBase(BaseModel):
    supplier_id:str
    supplier_name: str
    address: str
    contact_number: str
    payment_type: str
    purchase_id: str
    product_type: str
    amount: float
    tax: float
    net_amount: float
    date: date

class PurchaseCreate(PurchaseBase):
    pass

class PurchaseUpdate(PurchaseBase):
    pass
class PurchaseByProductResponse(BaseModel):
    product_type: str
    net_amount: float

class PurchaseResponse(PurchaseBase):
    id: int

    class Config:
        orm_mode = True
class TotalPurchaseResponse(BaseModel):
    total: float

class TotalPurchaseResponseGST(BaseModel):
    amount: float

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/customers/", response_model=CustomerResponse)
def add_customer(customer: CustomerCreate, db: Session = Depends(get_db)):
    # Check for duplicate client ID or email
    if db.query(Customer).filter(Customer.client_id == customer.client_id).first():
        raise HTTPException(status_code=400, detail="Client ID already exists.")
    if db.query(Customer).filter(Customer.email == customer.email).first():
        raise HTTPException(status_code=400, detail="Email already exists.")

    db_customer = Customer(
        client_id=customer.client_id,
        name=customer.name,
        email=customer.email,
        contact_number=customer.contact_number,
        gst_number=customer.gst_number,
        state=customer.state,
        address=customer.address
    )
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

@app.get("/customers/", response_model=List[CustomerResponse])
def get_customers(db: Session = Depends(get_db)):
    return db.query(Customer).all()

@app.put("/customers/{customer_id}", response_model=CustomerResponse)
def update_customer(customer_id: int, updated_customer: CustomerCreate, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    for attr, value in updated_customer.dict().items():
        setattr(customer, attr, value)
    
    db.commit()
    db.refresh(customer)
    return customer

@app.delete("/customers/{customer_id}")
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    db.delete(customer)
    db.commit()
    return {"message": "Customer deleted successfully"}

@app.post("/suppliers/", response_model=SupplierResponse)
def add_supplier(supplier: SupplierCreate, db: Session = Depends(get_db)):
    # Check if the supplier_id or email already exists
    if db.query(Supplier).filter(Supplier.supplier_id == supplier.supplier_id).first():
        raise HTTPException(status_code=400, detail="Supplier ID already exists.")
    if db.query(Supplier).filter(Supplier.email == supplier.email).first():
        raise HTTPException(status_code=400, detail="Email already exists.")
    
    db_supplier = Supplier(
        supplier_id=supplier.supplier_id,
        name=supplier.name,
        email=supplier.email,
        contact_number=supplier.contact_number,
        gst_number=supplier.gst_number,
        state=supplier.state,
        address=supplier.address
    )
    db.add(db_supplier)
    db.commit()
    db.refresh(db_supplier)
    return db_supplier

@app.get("/suppliers/", response_model=list[SupplierResponse])
def get_suppliers(db: Session = Depends(get_db)):
    suppliers = db.query(Supplier).all()
    return suppliers

@app.post("/suppliers/", response_model=SupplierResponse)
def add_supplier(supplier: SupplierCreate, db: Session = Depends(get_db)):
    if db.query(Supplier).filter(Supplier.supplier_id == supplier.supplier_id).first():
        raise HTTPException(status_code=400, detail="Supplier ID already exists.")
    if db.query(Supplier).filter(Supplier.email == supplier.email).first():
        raise HTTPException(status_code=400, detail="Email already exists.")
    
    db_supplier = Supplier(**supplier.dict())
    db.add(db_supplier)
    db.commit()
    db.refresh(db_supplier)
    return db_supplier

@app.put("/suppliers/{supplier_id}", response_model=SupplierResponse)
def update_supplier(supplier_id: int, updated_data: SupplierCreate, db: Session = Depends(get_db)):
    db_supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if not db_supplier:
        raise HTTPException(status_code=404, detail="Supplier not found.")
    
    for key, value in updated_data.dict().items():
        setattr(db_supplier, key, value)

    db.commit()
    db.refresh(db_supplier)
    return db_supplier

@app.delete("/suppliers/{supplier_id}")
def delete_supplier(supplier_id: int, db: Session = Depends(get_db)):
    db_supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if not db_supplier:
        raise HTTPException(status_code=404, detail="Supplier not found.")
    
    db.delete(db_supplier)
    db.commit()
    return {"message": "Supplier deleted successfully!"}

@app.post("/sales/", response_model=SaleResponse)
async def create_sale(sale: SaleCreate, db: Session = Depends(get_db)):
    db_sale = Sale(
        client_id=sale.client_id,  # Note the snake_case names in SaleCreate model
        customer_name=sale.customer_name,
        address=sale.address,
        contact_number=sale.contact_number,
        payment_type=sale.payment_type,
        invoice_id=sale.invoice_id,
        product_name=sale.product_name,
        quantity=sale.quantity,
        amount=sale.amount,
        tax=sale.tax,
        total=sale.total,
        date=sale.date,
    )
    try:
        db.add(db_sale)
        db.commit()
        db.refresh(db_sale)
        return db_sale
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error: {str(e)}")

@app.get("/sales/", response_model=List[SaleResponse])
def get_sales(db: Session = Depends(get_db)):
    sales = db.query(Sale).all()
    return sales

@app.put("/sales/{sale_id}", response_model=SaleResponse)
def update_sale(sale_id: int, sale: SaleUpdate, db: Session = Depends(get_db)):
    db_sale = db.query(Sale).filter(Sale.id == sale_id).first()
    if not db_sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    for key, value in sale.dict().items():
        setattr(db_sale, key, value)
    db.commit()
    db.refresh(db_sale)
    return db_sale

@app.delete("/sales/{sale_id}")
def delete_sale(sale_id: int, db: Session = Depends(get_db)):
    db_sale = db.query(Sale).filter(Sale.id == sale_id).first()
    if not db_sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    db.delete(db_sale)
    db.commit()
    return {"detail": "Sale deleted successfully"}

@app.get("/sales-by-product/", response_model=List[ProductSalesResponse])
def get_sales_by_product(
    start_date: Optional[date] = Query(None, description="Start date for filtering sales (YYYY-MM-DD)"),
    end_date: Optional[date] = Query(None, description="End date for filtering sales (YYYY-MM-DD)"),
    db: Session = Depends(get_db),
):
    """
    Retrieve total quantity sold for each product within a specified date range.
    """
    query = db.query(
        Sale.product_name, 
        func.sum(Sale.quantity).label("quantity")
    ).group_by(Sale.product_name)

    if start_date and end_date and start_date > end_date:
        raise HTTPException(
            status_code=400, 
            detail="Start date cannot be later than end date."
        )
    if start_date:
        query = query.filter(Sale.date >= start_date)
    if end_date:
        query = query.filter(Sale.date <= end_date)

    sales_data = query.all()

    if not sales_data:
        raise HTTPException(
            status_code=404,
            detail="No sales data found for the given date range."
        )

    return [{"productName": product_name, "quantity": int(quantity)} for product_name, quantity in sales_data]

@app.get("/total-sales", response_model=TotalSalesResponse)
def get_total_sales(db: Session = Depends(get_db)):
    total_sales = db.query(Sale.total).all()
    total_sales_amount = sum(item[0] for item in total_sales)
    return TotalSalesResponse(total=total_sales_amount)

@app.get("/total-sales-gst", response_model=TotalSalesResponseGST)
def get_total_sales(db: Session = Depends(get_db)):
    total_sales = db.query(Sale.amount).all()
    total_sales_amount = sum(item[0] for item in total_sales)
    return TotalSalesResponseGST(amount=total_sales_amount)

@app.get("/purchases-by-product/", response_model=List[PurchaseByProductResponse])
def get_purchases_by_product(
    start_date: Optional[date] = Query(None, description="Start date for filtering purchases (YYYY-MM-DD)"),
    end_date: Optional[date] = Query(None, description="End date for filtering purchases (YYYY-MM-DD)"),
    db: Session = Depends(get_db),
):
    """
    Retrieve total net amount spent on each product type within a specified date range.
    """
    query = db.query(
        Purchase.product_type,
        func.sum(Purchase.net_amount).label("net_amount")
    ).group_by(Purchase.product_type)

    # Log date range for debugging
    if start_date:
        print(f"Start Date: {start_date}")
        query = query.filter(Purchase.date >= start_date)
    if end_date:
        print(f"End Date: {end_date}")
        query = query.filter(Purchase.date <= end_date)

    # Log generated query for debugging
    print(f"Generated Query: {query}")

    purchase_data = query.all()

    if not purchase_data:
        print("No data found for the given date range.")
        return []  # Return empty list if no data found

    return [{"product_type": product_type, "net_amount": float(net_amount)} for product_type, net_amount in purchase_data]

@app.post("/purchases/", response_model=PurchaseResponse)
async def create_purchase(purchase: PurchaseCreate, db: Session = Depends(get_db)):
    db_purchase = Purchase(
        supplier_id=purchase.supplier_id,
        supplier_name=purchase.supplier_name,
        address=purchase.address,
        contact_number=purchase.contact_number,
        payment_type=purchase.payment_type,
        purchase_id=purchase.purchase_id,
        product_type=purchase.product_type,
        amount=purchase.amount,
        tax=purchase.tax,
        net_amount=purchase.net_amount,
        date=purchase.date,
    )
    try:
        db.add(db_purchase)
        db.commit()
        db.refresh(db_purchase)
        return db_purchase
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error: {str(e)}")

@app.get("/purchases/", response_model=List[PurchaseResponse])
def get_purchases(db: Session = Depends(get_db)):
    purchases = db.query(Purchase).all()
    return purchases

@app.put("/purchases/{purchase_id}", response_model=PurchaseResponse)
def update_purchase(purchase_id: int, purchase: PurchaseUpdate, db: Session = Depends(get_db)):
    db_purchase = db.query(Purchase).filter(Purchase.id == purchase_id).first()
    if not db_purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")
    
    for key, value in purchase.dict().items():
        setattr(db_purchase, key, value)
    
    db.commit()
    db.refresh(db_purchase)
    return db_purchase

@app.delete("/purchases/{purchase_id}")
def delete_purchase(purchase_id: int, db: Session = Depends(get_db)):
    db_purchase = db.query(Purchase).filter(Purchase.id == purchase_id).first()
    if not db_purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")
    
    db.delete(db_purchase)
    db.commit()
    return {"detail": "Purchase deleted successfully"}

@app.get("/total-sales-amount", response_model=Dict[str, float])
def get_total_sales_amount(
    db: Session = Depends(get_db),
):
    """
    Retrieve the total sales amount (excluding tax).
    """
    total_sales = db.query(func.sum(Sale.amount)).scalar()

    if total_sales is None:
        total_sales = 0.0

    return {"total": total_sales}

@app.get("/total-purchases-amount", response_model=Dict[str, float])
def get_total_purchase_amount(
    db: Session = Depends(get_db),
):
    """
    Retrieve the total purchase amount (excluding tax).
    """
    total_purchases = db.query(func.sum(Purchase.amount)).scalar()

    if total_purchases is None:
        total_purchases = 0.0

    return {"total": total_purchases}

@app.get("/total-purchases", response_model=TotalPurchaseResponse)
async def get_total_purchases(db: Session = Depends(get_db)):
    try:
        total_purchase = db.query(Purchase).with_entities(func.sum(Purchase.net_amount).label('total')).first()
        
        total = total_purchase[0] if total_purchase[0] else 0.0

        return TotalPurchaseResponse(total=total)
    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}

@app.get("/sales-report/", response_model=List[SaleBase])
def get_sales(
    start_date: datetime.date = Query(..., description="Start date for the report"),
    end_date: datetime.date = Query(..., description="End date for the report"),
    db: Session = Depends(get_db),
):
    """
    Fetch sales data within the given date range.
    """
    sales = (
        db.query(Sale)
        .filter(and_(Sale.date >= start_date, Sale.date <= end_date))
        .all()
    )
    return sales

@app.get("/sales-date/export")
def export_sales(
    start_date: datetime.date = Query(..., description="Start date for the export"),
    end_date: datetime.date = Query(..., description="End date for the export"),
    format: str = Query("csv", description="Export format (csv or pdf)"),
    db: Session = Depends(get_db),
):
    """
    Export sales data within the given date range in the specified format.
    """
    sales = (
        db.query(Sale)
        .filter(and_(Sale.date >= start_date, Sale.date <= end_date))
        .all()
    )

    if not sales:
        raise HTTPException(status_code=404, detail="No sales data found for the given period.")

    if format == "csv":
        output = StringIO()
        writer = csv.writer(output)
        writer.writerow([
            "CLIENT ID", "CUSTOMER NAME", "ADDRESS", "CONTACT NUMBER", "PAYMENT TYPE",
        "INVOICE ID", "PRODUCT NAME", "QUANTITY", "AMOUNT", "GST", "TOTAL", "DATE"
        ])
        for sale in sales:
            writer.writerow([
                sale.client_id, sale.customer_name, sale.address, sale.contact_number,
                sale.payment_type, sale.invoice_id, sale.product_name, sale.quantity,
                sale.amount, sale.tax, sale.total, sale.date
            ])
        output.seek(0)

        return StreamingResponse(
            output,
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=sales_report_{start_date}to{end_date}.csv"},
        )

    elif format == "pdf":
        buffer = BytesIO()
        pdf = SimpleDocTemplate(buffer, pagesize=landscape(letter), leftMargin=20, rightMargin=20, topMargin=20, bottomMargin=20)
        elements = []

        styles = getSampleStyleSheet()
        title = Paragraph("SIEGTECHNIK", styles["Title"])
        # address = Paragraph('<div align="right">Peenya, Bangalore</div>', styles["Normal"])
        report_title = Paragraph(f"Sales Report ({start_date} to {end_date})", styles["Title"])

        elements.append(title)
        # elements.append(address)
        elements.append(report_title)
        
        table_data = [["CLIENT ID", "CUSTOMER NAME", "ADDRESS", "CONTACT NUMBER", "PAYMENT TYPE",
        "INVOICE ID", "PRODUCT NAME", "QUANTITY", "AMOUNT", "GST", "TOTAL", "DATE"]]
        
        for sale in sales:
            table_data.append([
                sale.client_id, sale.customer_name, sale.address, sale.contact_number,
                sale.payment_type, sale.invoice_id, sale.product_name, sale.quantity,
                sale.amount, sale.tax, sale.total, str(sale.date)
            ])
        
        table = Table(table_data, repeatRows=1)
        
        style = TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('WORDWRAP', (0, 0), (-1, -1)),
        ])
        
        table.setStyle(style)
        elements.append(table)
        
        pdf.build(elements)
        buffer.seek(0)

        return StreamingResponse(
            buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=sales_report_{start_date}to{end_date}.pdf"},
        )
    else:
        raise HTTPException(status_code=400, detail="Invalid format specified")

@app.get("/purchases-report/", response_model=List[PurchaseBase])
def get_purchases(
    start_date: datetime.date = Query(..., description="Start date for the report"),
    end_date: datetime.date = Query(..., description="End date for the report"),
    db: Session = Depends(get_db),
):
    """
    Fetch purchase data within the given date range.
    """
    purchases = (
        db.query(Purchase)
        .filter(and_(Purchase.date >= start_date, Purchase.date <= end_date))
        .all()
    )
    return purchases

@app.get("/purchases-date/export")
def export_purchases(
    start_date: datetime.date = Query(..., description="Start date for the export"),
    end_date: datetime.date = Query(..., description="End date for the export"),
    format: str = Query("csv", description="Export format (csv or pdf)"),
    db: Session = Depends(get_db),
):
    """
    Export purchase data within the given date range in the specified format.
    """
    purchases = (
        db.query(Purchase)
        .filter(and_(Purchase.date >= start_date, Purchase.date <= end_date))
        .all()
    )

    if not purchases:
        raise HTTPException(status_code=404, detail="No purchase data found for the given period.")

    if format == "csv":
        output = StringIO()
        writer = csv.writer(output)
        writer.writerow([
             "SUPPLIER ID", "SUPPLIER NAME", "REFERENCE NUMBER","ADDRESS", "CONTACT NUMBER", "PAYMENT TYPE",
        "PRODUCT TYPE", "AMOUNT", "GST", "NET AMOUNT", "DATE"
        ])
        for purchase in purchases:
            writer.writerow([
                purchase.supplier_id, purchase.supplier_name, purchase.purchase_id, purchase.address, 
                purchase.contact_number, purchase.payment_type, purchase.product_type, purchase.amount, 
                purchase.tax, purchase.net_amount, purchase.date
            ])
        output.seek(0)

        return StreamingResponse(
            output,
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=purchase_report_{start_date}to{end_date}.csv"},
        )

    elif format == "pdf":
        buffer = BytesIO()
        pdf = SimpleDocTemplate(buffer, pagesize=landscape(letter), leftMargin=20, rightMargin=20, topMargin=20, bottomMargin=20)
        elements = []

        styles = getSampleStyleSheet()
        title = Paragraph("SIEGTECHNIK", styles["Title"])
        report_title = Paragraph(f"Purchase Report ({start_date} to {end_date})", styles["Title"])

        elements.append(title)
        elements.append(report_title)

        table_data = [["SUPPLIER ID", "SUPPLIER NAME", "REFERENCE NUMBER","ADDRESS", "CONTACT NUMBER", "PAYMENT TYPE", "PRODUCT TYPE", "AMOUNT", "GST", "NET AMOUNT", "DATE"]]

        for purchase in purchases:
            table_data.append([
                purchase.supplier_id, purchase.supplier_name, purchase.purchase_id, purchase.address,
                purchase.contact_number, purchase.payment_type, purchase.product_type, purchase.amount, 
                purchase.tax, purchase.net_amount, str(purchase.date)
            ])

        table = Table(table_data, repeatRows=1)

        style = TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('WORDWRAP', (0, 0), (-1, -1)),
        ])

        table.setStyle(style)
        elements.append(table)
        
        pdf.build(elements)
        buffer.seek(0)

        return StreamingResponse(
            buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=purchase_report_{start_date}to{end_date}.pdf"},
        )
    else:
        raise HTTPException(status_code=400, detail="Invalid format specified")

    
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)