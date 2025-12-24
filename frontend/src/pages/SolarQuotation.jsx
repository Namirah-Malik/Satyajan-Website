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
    try {
      const doc = new jsPDF();
      const quotationNumber = generateQuotationNumber();
      const date = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });

      // Calculate solar estimates
      const systemCapacityNum = parseFloat(formData.systemCapacity) || 0;
      const monthlyUnitsGenerated = Math.round(systemCapacityNum * 4.5 * 30); // Avg 4.5 hrs/day
      const ratePerUnit = 8; // Average ₹8 per unit
      const monthlyBillNum = parseFloat(formData.monthlyBill) || 0;
      const monthlySavings = Math.min(monthlyUnitsGenerated * ratePerUnit, monthlyBillNum);
      const systemCost = calculateTotal();
      const paybackYears = systemCost > 0 && monthlySavings > 0 
        ? (systemCost / (monthlySavings * 12)).toFixed(1) 
        : 0;

      // Company Header with gradient effect
      doc.setFillColor(0, 102, 204);
      doc.rect(0, 0, 210, 45, 'F');

      // Add solar icon (sun)
      doc.setFillColor(255, 193, 7);
      doc.circle(20, 22, 10, 'F');
      
      // Add rays around sun
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const x1 = 20 + Math.cos(angle) * 12;
        const y1 = 22 + Math.sin(angle) * 12;
        const x2 = 20 + Math.cos(angle) * 16;
        const y2 = 22 + Math.sin(angle) * 16;
        doc.setDrawColor(255, 193, 7);
        doc.setLineWidth(2);
        doc.line(x1, y1, x2, y2);
      }
      
      // Company Name
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('SATYAJAN ENERGY SOLUTIONS', 105, 20, { align: 'center' });

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Private Limited', 105, 28, { align: 'center' });
      doc.text('Professional Solar & Power Backup Solutions', 105, 35, { align: 'center' });
      doc.text('Clean Energy for a Sustainable Future', 105, 41, { align: 'center' });

      // Reset text color
      doc.setTextColor(0, 0, 0);

      // Solar Quotation Title
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 102, 204);
      doc.text('SOLAR SYSTEM QUOTATION', 105, 58, { align: 'center' });
      doc.setTextColor(0, 0, 0);

      // Quotation Details Box
      doc.setFillColor(250, 250, 250);
      doc.roundedRect(135, 65, 65, 28, 2, 2, 'F');
      doc.setDrawColor(0, 102, 204);
      doc.setLineWidth(0.5);
      doc.roundedRect(135, 65, 65, 28, 2, 2, 'S');
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('Quotation No:', 138, 71);
      doc.text('Date:', 138, 79);
      doc.text('Valid Until:', 138, 87);

      doc.setFont('helvetica', 'normal');
      doc.text(quotationNumber, 165, 71);
      doc.text(date, 165, 79);
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + 30);
      doc.text(validUntil.toLocaleDateString('en-IN'), 165, 87);

      // Customer Details Box
      doc.setFillColor(245, 248, 255);
      doc.roundedRect(10, 65, 120, 28, 2, 2, 'F');
      doc.setDrawColor(0, 102, 204);
      doc.roundedRect(10, 65, 120, 28, 2, 2, 'S');

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 102, 204);
      doc.text('Customer Details:', 13, 71);

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(formData.customerName || 'Customer Name', 13, 79);
      doc.setFont('helvetica', 'normal');
      doc.text(`Phone: ${formData.phone || 'N/A'}`, 13, 85);
      doc.text(`Email: ${formData.email || 'N/A'}`, 13, 91);

      // Energy Consumption & Savings Box
      doc.setFillColor(255, 251, 235);
      doc.roundedRect(10, 98, 190, 25, 2, 2, 'F');
      doc.setDrawColor(255, 193, 7);
      doc.setLineWidth(1);
      doc.roundedRect(10, 98, 190, 25, 2, 2, 'S');

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(204, 102, 0);
      doc.text('Energy Analysis & Savings Estimate', 13, 105);

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Current Monthly Bill: ₹${monthlyBillNum.toLocaleString('en-IN')}`, 13, 112);
      doc.text(`Recommended System: ${systemCapacityNum} kW`, 13, 118);
      doc.text(`Est. Monthly Generation: ${monthlyUnitsGenerated} units`, 80, 112);
      doc.text(`Est. Monthly Savings: ₹${monthlySavings.toLocaleString('en-IN')}`, 80, 118);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 128, 0);
      doc.text(`Payback Period: ~${paybackYears} years`, 150, 115);

      // Solar System Specifications Table
      doc.setTextColor(0, 0, 0);
      const tableData = [
        ['System Type', formData.systemType, '', ''],
        ['System Capacity', `${formData.systemCapacity} kW`, '', ''],
        ['Solar Panel Type', formData.panelType || 'N/A', '', ''],
        ['Inverter Type', formData.inverterType || 'N/A', '', ''],
        ['Complete Solar System', `Qty: ${formData.quantity}`, `₹${formData.price.toLocaleString('en-IN')}`, `₹${calculateSubtotal().toLocaleString('en-IN')}`],
      ];

      doc.autoTable({
        startY: 128,
        head: [['Component', 'Specification', 'Unit Price', 'Amount']],
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
          if (data.row.index === 4) {
            data.cell.styles.fillColor = [240, 248, 255];
            if (data.column.index === 0) {
              data.cell.styles.fontStyle = 'bold';
            }
          }
        },
      });

      // Pricing Summary
      const finalY = doc.lastAutoTable.finalY + 8;
      const subtotal = calculateSubtotal();
      const gst = calculateGST();
      const total = calculateTotal();

      const summaryX = 115;
      
      doc.setFillColor(248, 248, 248);
      doc.roundedRect(summaryX, finalY, 80, 30, 2, 2, 'F');
      doc.setDrawColor(200, 200, 200);
      doc.roundedRect(summaryX, finalY, 80, 30, 2, 2, 'S');
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Subtotal:', summaryX + 5, finalY + 7);
      doc.text(`GST (${formData.gstRate}%):`, summaryX + 5, finalY + 14);

      doc.setFillColor(0, 102, 204);
      doc.roundedRect(summaryX, finalY + 18, 80, 12, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.text('GRAND TOTAL:', summaryX + 5, finalY + 26);

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`₹${subtotal.toLocaleString('en-IN')}`, summaryX + 75, finalY + 7, { align: 'right' });
      doc.text(`₹${gst.toLocaleString('en-IN')}`, summaryX + 75, finalY + 14, { align: 'right' });

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(`₹${total.toLocaleString('en-IN')}`, summaryX + 75, finalY + 26, { align: 'right' });

      // Notes Section
      let notesEndY = finalY + 35;
      if (formData.notes) {
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 102, 204);
        doc.text('Special Notes:', 10, notesEndY);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const notesLines = doc.splitTextToSize(formData.notes, 185);
        doc.text(notesLines, 10, notesEndY + 6);
        notesEndY += 6 + (notesLines.length * 5) + 5;
      }

      // Terms & Conditions
      const termsY = notesEndY;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 102, 204);
      doc.text('Terms & Conditions:', 10, termsY);

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      const terms = [
        '• Quotation valid for 30 days from date of issue.',
        '• Payment: 50% advance, 50% on installation completion.',
        '• Prices inclusive of GST. Installation included (standard conditions).',
        '• Solar panels: 25-year performance warranty.',
        '• Inverter: 5-10 years warranty (as per manufacturer).',
        '• Structure: 10-year warranty against rust/corrosion.',
        '• Free maintenance for first year. Annual maintenance available.',
        '• Net metering assistance provided (government subsidy support available).',
      ];
      
      let currentY = termsY + 6;
      terms.forEach((term) => {
        doc.text(term, 10, currentY);
        currentY += 4.5;
      });

      // Signature and Stamp Section
      const sigY = 255;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('For Satyajan Energy Solutions Pvt Ltd', 10, sigY);
      
      doc.setDrawColor(0, 102, 204);
      doc.setLineWidth(0.5);
      doc.line(10, sigY + 12, 70, sigY + 12);
      
      doc.setFontSize(8);
      doc.text('Authorized Signatory', 10, sigY + 17);
      
      // Company Stamp Placeholder
      doc.setDrawColor(150, 150, 150);
      doc.setLineWidth(1);
      doc.setLineDash([3, 3]);
      doc.roundedRect(130, sigY - 5, 35, 25, 2, 2, 'S');
      doc.setLineDash([]);
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      doc.text('Company', 147, sigY + 5, { align: 'center' });
      doc.text('Stamp', 147, sigY + 10, { align: 'center' });

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

      // Generate filename and save
      const fileName = `Solar_Quotation_${quotationNumber}_${formData.customerName.replace(/\s+/g, '_')}.pdf`;
      
      // Save the PDF - this triggers immediate download
      doc.save(fileName);
      
      console.log('PDF generated successfully:', fileName);
      alert('Solar quotation PDF downloaded successfully!');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please check all fields and try again.');
    }
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
                  
                  <div className="mt-4">
                    <Label htmlFor="monthlyBill" className="text-sm font-semibold mb-2">
                      Average Monthly Electricity Bill (₹) *
                    </Label>
                    <Input
                      id="monthlyBill"
                      name="monthlyBill"
                      type="number"
                      min="0"
                      value={formData.monthlyBill}
                      onChange={handleInputChange}
                      placeholder="e.g., 5000"
                      required
                      className="border-2 border-gray-300 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This helps us calculate your potential savings with solar
                    </p>
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
