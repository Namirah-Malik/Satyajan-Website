import React, { useState } from 'react';
import { Download, Sun, FileText } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import Header from '../components/Header';
import Footer from '../components/Footer';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const SolarQuotation = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    monthlyBill: '',
    systemType: 'On-grid',
    systemCapacity: '',
    panelType: '',
    inverterType: '',
    quantity: 1,
    price: 0,
    gstRate: 18,
    notes: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateSubtotal = () => {
    return formData.quantity * formData.price;
  };

  const calculateGST = () => {
    const subtotal = calculateSubtotal();
    return (subtotal * formData.gstRate) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateGST();
  };

  const generateQuotationNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `SJES-SOLAR-${year}${month}-${random}`;
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const quotationNumber = generateQuotationNumber();
    const date = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    // Company Header with gradient effect
    doc.setFillColor(0, 102, 204);
    doc.rect(0, 0, 210, 45, 'F');

    // Add solar icon representation
    doc.setFillColor(255, 193, 7);
    doc.circle(190, 20, 8, 'F');
    
    // Company Name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.text('SATYAJAN ENERGY SOLUTIONS', 105, 22, { align: 'center' });

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Private Limited', 105, 30, { align: 'center' });
    doc.text('Professional Solar & Power Backup Solutions', 105, 37, { align: 'center' });

    // Reset text color
    doc.setTextColor(0, 0, 0);

    // Solar Quotation Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 102, 204);
    doc.text('SOLAR QUOTATION', 105, 60, { align: 'center' });
    doc.setTextColor(0, 0, 0);

    // Quotation Details Box
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(135, 70, 65, 28, 2, 2, 'F');
    doc.setDrawColor(0, 102, 204);
    doc.setLineWidth(0.5);
    doc.roundedRect(135, 70, 65, 28, 2, 2, 'S');
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Quotation No:', 138, 76);
    doc.text('Date:', 138, 84);
    doc.text('Valid Until:', 138, 92);

    doc.setFont('helvetica', 'normal');
    doc.text(quotationNumber, 165, 76);
    doc.text(date, 165, 84);
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);
    doc.text(validUntil.toLocaleDateString('en-IN'), 165, 92);

    // Customer Details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 102, 204);
    doc.text('Bill To:', 15, 76);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(formData.customerName || 'Customer Name', 15, 84);
    doc.setFont('helvetica', 'normal');
    doc.text(`Phone: ${formData.phone || 'N/A'}`, 15, 90);
    doc.text(`Email: ${formData.email || 'N/A'}`, 15, 96);

    // Solar System Details Table
    const tableData = [
      [
        'Solar System Type',
        formData.systemType,
        '',
        '',
      ],
      [
        'System Capacity',
        `${formData.systemCapacity} kW`,
        '',
        '',
      ],
      [
        'Panel Type',
        formData.panelType || 'N/A',
        '',
        '',
      ],
      [
        'Inverter Type',
        formData.inverterType || 'N/A',
        '',
        '',
      ],
      [
        'Complete Solar System',
        `Quantity: ${formData.quantity}`,
        `₹${formData.price.toLocaleString('en-IN')}`,
        `₹${calculateSubtotal().toLocaleString('en-IN')}`,
      ],
    ];

    doc.autoTable({
      startY: 108,
      head: [['Description', 'Specification', 'Unit Price', 'Amount']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 102, 204],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10,
        halign: 'center',
      },
      bodyStyles: {
        fontSize: 9,
      },
      columnStyles: {
        0: { cellWidth: 55, fontStyle: 'bold' },
        1: { cellWidth: 60 },
        2: { cellWidth: 35, halign: 'right' },
        3: { cellWidth: 35, halign: 'right' },
      },
      didParseCell: function (data) {
        if (data.row.index === 4 && data.column.index === 0) {
          data.cell.styles.fillColor = [240, 248, 255];
          data.cell.styles.fontStyle = 'bold';
        }
      },
    });

    // Calculations
    const finalY = doc.lastAutoTable.finalY + 10;
    const subtotal = calculateSubtotal();
    const gst = calculateGST();
    const total = calculateTotal();

    // Summary Box
    const summaryX = 115;
    const summaryY = finalY;
    
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(summaryX, summaryY - 5, 80, 35, 2, 2, 'F');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Subtotal:', summaryX + 5, summaryY + 2);
    doc.text(`GST (${formData.gstRate}%):`, summaryX + 5, summaryY + 10);

    // Grand Total Box
    doc.setFillColor(0, 102, 204);
    doc.roundedRect(summaryX, summaryY + 15, 80, 12, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text('Grand Total:', summaryX + 5, summaryY + 23);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`₹${subtotal.toLocaleString('en-IN')}`, 190, summaryY + 2, { align: 'right' });
    doc.text(`₹${gst.toLocaleString('en-IN')}`, 190, summaryY + 10, { align: 'right' });

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(`₹${total.toLocaleString('en-IN')}`, 190, summaryY + 23, { align: 'right' });

    // Notes
    if (formData.notes) {
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 102, 204);
      doc.text('Special Notes:', 15, finalY + 40);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const notesLines = doc.splitTextToSize(formData.notes, 180);
      doc.text(notesLines, 15, finalY + 47);
    }

    // Terms & Conditions
    const termsY = finalY + (formData.notes ? 65 : 45);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 102, 204);
    doc.text('Terms & Conditions:', 15, termsY);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const terms = [
      '1. This quotation is valid for 30 days from the date of issue.',
      '2. Payment Terms: 50% advance payment, 50% on completion of installation.',
      '3. All prices are inclusive of GST.',
      '4. Installation charges included (subject to standard site conditions).',
      '5. Solar panel warranty: 25 years performance warranty.',
      '6. Inverter warranty: As per manufacturer (typically 5-10 years).',
      '7. Structure warranty: 10 years against rust and corrosion.',
      '8. Free maintenance for the first year post-installation.',
    ];
    terms.forEach((term, index) => {
      doc.text(term, 15, termsY + 8 + index * 5);
    });

    // Signature Section
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('For Satyajan Energy Solutions Pvt Ltd', 15, 260);
    
    doc.setDrawColor(0, 102, 204);
    doc.setLineWidth(0.5);
    doc.line(15, 273, 75, 273);
    
    doc.setFontSize(9);
    doc.text('Authorized Signatory', 15, 278);
    
    // Stamp placeholder
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(1);
    doc.setLineDash([2, 2]);
    doc.roundedRect(120, 255, 35, 25, 2, 2, 'S');
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text('Company', 137, 265, { align: 'center' });
    doc.text('Stamp', 137, 270, { align: 'center' });

    // Footer
    doc.setFillColor(0, 102, 204);
    doc.rect(0, 287, 210, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(
      'Phone: +91 8019179159 | Email: info@satyajanenergy.com | www.satyajanenergy.com',
      105,
      293,
      { align: 'center' }
    );

    // Save PDF
    const fileName = `Solar_Quotation_${quotationNumber}_${formData.customerName.replace(/\s+/g, '_')}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />

      <section className="pt-32 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4 shadow-lg">
                <Sun className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Solar Quotation Generator</h1>
              <p className="text-lg text-gray-600">
                Create professional quotations for solar energy systems
              </p>
            </div>

            {/* Solar Quotation Form */}
            <Card className="border-2 border-blue-200 shadow-xl">
              <CardContent className="p-8">
                {/* Customer Details */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center text-lg mr-3">
                      1
                    </span>
                    Customer Information
                  </h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="customerName" className="text-sm font-semibold mb-2">
                        Customer Name *
                      </Label>
                      <Input
                        id="customerName"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        placeholder="Enter customer name"
                        required
                        className="border-2 border-gray-300 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm font-semibold mb-2">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                        required
                        className="border-2 border-gray-300 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm font-semibold mb-2">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter email address"
                        className="border-2 border-gray-300 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Solar System Details */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center text-lg mr-3">
                      2
                    </span>
                    Solar System Specifications
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <Label htmlFor="systemType" className="text-sm font-semibold mb-2">
                        System Type *
                      </Label>
                      <select
                        id="systemType"
                        name="systemType"
                        value={formData.systemType}
                        onChange={handleInputChange}
                        className="w-full h-11 px-3 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                        required
                      >
                        <option value="On-grid">On-grid (Grid-tied)</option>
                        <option value="Off-grid">Off-grid (Standalone)</option>
                        <option value="Hybrid">Hybrid (Grid + Battery)</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.systemType === 'On-grid' && 'Connected to electricity grid, no battery backup'}
                        {formData.systemType === 'Off-grid' && 'Independent system with battery storage'}
                        {formData.systemType === 'Hybrid' && 'Grid connection with battery backup'}
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="systemCapacity" className="text-sm font-semibold mb-2">
                        System Capacity (kW) *
                      </Label>
                      <Input
                        id="systemCapacity"
                        name="systemCapacity"
                        type="number"
                        step="0.1"
                        min="1"
                        value={formData.systemCapacity}
                        onChange={handleInputChange}
                        placeholder="e.g., 5.0"
                        required
                        className="border-2 border-gray-300 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="panelType" className="text-sm font-semibold mb-2">
                        Panel Type *
                      </Label>
                      <Input
                        id="panelType"
                        name="panelType"
                        value={formData.panelType}
                        onChange={handleInputChange}
                        placeholder="e.g., Mono PERC 540W"
                        required
                        className="border-2 border-gray-300 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <Label htmlFor="inverterType" className="text-sm font-semibold mb-2">
                        Inverter Type *
                      </Label>
                      <Input
                        id="inverterType"
                        name="inverterType"
                        value={formData.inverterType}
                        onChange={handleInputChange}
                        placeholder="e.g., 5kW MPPT Hybrid"
                        required
                        className="border-2 border-gray-300 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing Details */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center text-lg mr-3">
                      3
                    </span>
                    Pricing & Quantity
                  </h2>
                  
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <Label htmlFor="quantity" className="text-sm font-semibold mb-2">
                        Quantity
                      </Label>
                      <Input
                        id="quantity"
                        name="quantity"
                        type="number"
                        min="1"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        className="border-2 border-gray-300 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <Label htmlFor="price" className="text-sm font-semibold mb-2">
                        Unit Price (₹) *
                      </Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        min="0"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="Enter price"
                        required
                        className="border-2 border-gray-300 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <Label htmlFor="gstRate" className="text-sm font-semibold mb-2">
                        GST Rate (%)
                      </Label>
                      <Input
                        id="gstRate"
                        name="gstRate"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.gstRate}
                        onChange={handleInputChange}
                        className="border-2 border-gray-300 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Pricing Summary Card */}
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300">
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 font-medium">Subtotal:</span>
                          <span className="text-lg font-bold text-gray-900">
                            ₹{calculateSubtotal().toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 font-medium">
                            GST ({formData.gstRate}%):
                          </span>
                          <span className="text-lg font-bold text-gray-900">
                            ₹{calculateGST().toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="border-t-2 border-blue-300 pt-3 flex justify-between items-center">
                          <span className="text-xl font-bold text-blue-700">Grand Total:</span>
                          <span className="text-3xl font-bold text-blue-600">
                            ₹{calculateTotal().toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Additional Notes */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center text-lg mr-3">
                      4
                    </span>
                    Additional Information
                  </h2>
                  <Label htmlFor="notes" className="text-sm font-semibold mb-2">
                    Special Notes / Requirements
                  </Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Add installation requirements, roof type, expected generation, payment terms, or any other special instructions..."
                    rows={5}
                    className="border-2 border-gray-300 focus:border-blue-500"
                  />
                </div>

                {/* Download Button */}
                <div className="flex justify-center pt-4">
                  <Button
                    onClick={generatePDF}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-7 text-lg shadow-lg hover:shadow-xl transition-all"
                    disabled={
                      !formData.customerName ||
                      !formData.phone ||
                      !formData.systemCapacity ||
                      !formData.panelType ||
                      !formData.inverterType ||
                      formData.price === 0
                    }
                  >
                    <Download className="w-6 h-6 mr-2" />
                    Download Solar Quotation (PDF)
                  </Button>
                </div>

                {/* Validation Note */}
                {(!formData.customerName ||
                  !formData.phone ||
                  !formData.systemCapacity ||
                  !formData.panelType ||
                  !formData.inverterType ||
                  formData.price === 0) && (
                  <p className="text-center text-sm text-red-600 mt-4">
                    * Please fill all required fields to generate quotation
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SolarQuotation;
