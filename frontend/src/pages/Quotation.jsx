import React, { useState } from 'react';
import { Download, Plus, Trash2, FileText } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import Header from '../components/Header';
import Footer from '../components/Footer';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Quotation = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    items: [
      {
        productType: '',
        capacityModel: '',
        quantity: 1,
        price: 0,
      },
    ],
    gstRate: 18,
    notes: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { productType: '', capacityModel: '', quantity: 1, price: 0 },
      ],
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, items: newItems }));
    }
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => {
      return sum + item.quantity * item.price;
    }, 0);
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
    return `SJES-${year}${month}-${random}`;
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const quotationNumber = generateQuotationNumber();
    const date = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    // Company Header
    doc.setFillColor(0, 102, 204);
    doc.rect(0, 0, 210, 40, 'F');

    // Company Name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('SATYAJAN ENERGY SOLUTIONS', 105, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Private Limited', 105, 28, { align: 'center' });
    doc.text(
      'Professional Power Backup & Solar Solutions',
      105,
      34,
      { align: 'center' }
    );

    // Reset text color
    doc.setTextColor(0, 0, 0);

    // Quotation Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('QUOTATION', 105, 55, { align: 'center' });

    // Quotation Details Box
    doc.setFillColor(240, 240, 240);
    doc.rect(140, 65, 60, 25, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Quotation No:', 142, 70);
    doc.text('Date:', 142, 78);
    doc.text('Valid Until:', 142, 86);

    doc.setFont('helvetica', 'normal');
    doc.text(quotationNumber, 170, 70);
    doc.text(date, 170, 78);
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);
    doc.text(validUntil.toLocaleDateString('en-IN'), 170, 86);

    // Customer Details
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', 15, 70);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(formData.customerName || 'Customer Name', 15, 78);
    doc.text(`Phone: ${formData.phone || 'N/A'}`, 15, 84);
    doc.text(`Email: ${formData.email || 'N/A'}`, 15, 90);

    // Items Table
    const tableData = formData.items.map((item, index) => [
      index + 1,
      item.productType || 'N/A',
      item.capacityModel || 'N/A',
      item.quantity,
      `₹${item.price.toLocaleString('en-IN')}`,
      `₹${(item.quantity * item.price).toLocaleString('en-IN')}`,
    ]);

    doc.autoTable({
      startY: 100,
      head: [['S.No', 'Product/System Type', 'Capacity/Model', 'Qty', 'Price', 'Amount']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 102, 204],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10,
      },
      bodyStyles: {
        fontSize: 9,
      },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 50 },
        2: { cellWidth: 40 },
        3: { cellWidth: 15 },
        4: { cellWidth: 30 },
        5: { cellWidth: 35 },
      },
    });

    // Calculations
    const finalY = doc.lastAutoTable.finalY + 10;
    const subtotal = calculateSubtotal();
    const gst = calculateGST();
    const total = calculateTotal();

    // Summary Box
    const summaryX = 120;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Subtotal:', summaryX, finalY);
    doc.text(`GST (${formData.gstRate}%):`, summaryX, finalY + 7);

    doc.setFillColor(0, 102, 204);
    doc.rect(summaryX - 5, finalY + 12, 75, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text('Grand Total:', summaryX, finalY + 19);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`₹${subtotal.toLocaleString('en-IN')}`, 185, finalY, { align: 'right' });
    doc.text(`₹${gst.toLocaleString('en-IN')}`, 185, finalY + 7, { align: 'right' });

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`₹${total.toLocaleString('en-IN')}`, 185, finalY + 19, { align: 'right' });

    // Notes
    if (formData.notes) {
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Notes:', 15, finalY + 30);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const notesLines = doc.splitTextToSize(formData.notes, 180);
      doc.text(notesLines, 15, finalY + 37);
    }

    // Terms & Conditions
    const termsY = finalY + (formData.notes ? 60 : 40);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Terms & Conditions:', 15, termsY);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const terms = [
      '1. Quotation valid for 30 days from the date of issue.',
      '2. Payment terms: 50% advance, 50% on delivery/installation.',
      '3. Prices are inclusive of GST.',
      '4. Installation charges may apply as per site requirements.',
      '5. Warranty as per manufacturer terms.',
    ];
    terms.forEach((term, index) => {
      doc.text(term, 15, termsY + 7 + index * 5);
    });

    // Signature
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('For Satyajan Energy Solutions Pvt Ltd', 15, 260);
    doc.line(15, 275, 70, 275);
    doc.text('Authorized Signatory', 15, 280);

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
    doc.save(`Quotation_${quotationNumber}_${formData.customerName.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="pt-32 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Generate Quotation</h1>
              <p className="text-lg text-gray-600">
                Create professional quotations for your customers
              </p>
            </div>

            {/* Quotation Form */}
            <Card className="border-2 border-blue-100">
              <CardContent className="p-8">
                {/* Customer Details */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm mr-3">
                      1
                    </span>
                    Customer Details
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
                        className="border-2"
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
                        className="border-2"
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
                        className="border-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Items Section */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm mr-3">
                      2
                    </span>
                    Product/Service Details
                  </h2>

                  {formData.items.map((item, index) => (
                    <Card key={index} className="mb-4 border-2 border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">Item {index + 1}</h3>
                          {formData.items.length > 1 && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeItem(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid md:grid-cols-4 gap-4">
                          <div className="md:col-span-2">
                            <Label className="text-sm font-semibold mb-2">
                              Product/System Type *
                            </Label>
                            <Input
                              value={item.productType}
                              onChange={(e) =>
                                handleItemChange(index, 'productType', e.target.value)
                              }
                              placeholder="e.g., Solar Inverter, UPS, Battery"
                              required
                              className="border-2"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-semibold mb-2">
                              Capacity/Model *
                            </Label>
                            <Input
                              value={item.capacityModel}
                              onChange={(e) =>
                                handleItemChange(index, 'capacityModel', e.target.value)
                              }
                              placeholder="e.g., 3KW, 150Ah"
                              required
                              className="border-2"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-semibold mb-2">Quantity *</Label>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)
                              }
                              className="border-2"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-semibold mb-2">Price (₹) *</Label>
                            <Input
                              type="number"
                              min="0"
                              value={item.price}
                              onChange={(e) =>
                                handleItemChange(index, 'price', parseFloat(e.target.value) || 0)
                              }
                              placeholder="Enter price"
                              className="border-2"
                            />
                          </div>
                          <div className="md:col-span-4">
                            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
                              <span className="text-sm font-semibold text-gray-700">
                                Item Total:
                              </span>
                              <span className="text-xl font-bold text-blue-600 ml-2">
                                ₹{(item.quantity * item.price).toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Button
                    onClick={addItem}
                    variant="outline"
                    className="w-full border-2 border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another Item
                  </Button>
                </div>

                {/* Pricing Summary */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm mr-3">
                      3
                    </span>
                    Pricing & GST
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
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
                        className="border-2"
                      />
                    </div>
                    <div>
                      <Card className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 h-full">
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Subtotal:</span>
                              <span className="font-semibold">
                                ₹{calculateSubtotal().toLocaleString('en-IN')}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">
                                GST ({formData.gstRate}%):
                              </span>
                              <span className="font-semibold">
                                ₹{calculateGST().toLocaleString('en-IN')}
                              </span>
                            </div>
                            <div className="border-t-2 border-blue-300 pt-2 flex justify-between">
                              <span className="text-lg font-bold text-gray-900">Grand Total:</span>
                              <span className="text-2xl font-bold text-blue-600">
                                ₹{calculateTotal().toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm mr-3">
                      4
                    </span>
                    Additional Notes
                  </h2>
                  <Textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Add any special instructions, delivery details, or other notes..."
                    rows={4}
                    className="border-2"
                  />
                </div>

                {/* Download Button */}
                <div className="flex justify-center">
                  <Button
                    onClick={generatePDF}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-6 text-lg"
                    disabled={
                      !formData.customerName ||
                      !formData.phone ||
                      formData.items.some(
                        (item) => !item.productType || !item.capacityModel || item.price === 0
                      )
                    }
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Quotation (PDF)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Quotation;
