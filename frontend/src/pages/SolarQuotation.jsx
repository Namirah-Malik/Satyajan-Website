import React, { useState } from 'react';
import { Download, Sun, FileText } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import Header from '../components/Header';
import Footer from '../components/Footer';

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

  // Pricing per kW based on system type
  const pricingRates = {
    'On-grid': 55000,      // ₹55,000 per kW
    'Off-grid': 75000,     // ₹75,000 per kW  
    'Hybrid': 65000,       // ₹65,000 per kW
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Calculate price automatically when capacity or system type changes
  const calculatePrice = () => {
    const capacity = parseFloat(formData.systemCapacity) || 0;
    const pricePerKw = pricingRates[formData.systemType] || 0;
    return capacity * pricePerKw;
  };

  // Update price whenever capacity or system type changes
  React.useEffect(() => {
    const autoPrice = calculatePrice();
    setFormData((prev) => ({ ...prev, price: autoPrice }));
  }, [formData.systemCapacity, formData.systemType]);

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

  const generatePDF = async () => {
    try {
      // Prepare data for backend
      const quotationData = {
        customerName: formData.customerName,
        phone: formData.phone,
        email: formData.email || '',
        monthlyBill: parseFloat(formData.monthlyBill),
        systemType: formData.systemType,
        systemCapacity: parseFloat(formData.systemCapacity),
        panelType: formData.panelType,
        inverterType: formData.inverterType,
        quantity: formData.quantity,
        price: formData.price,
        gstRate: formData.gstRate,
        notes: formData.notes || '',
      };

      // Call backend API
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${API_URL}/api/generate-solar-quotation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quotationData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Get the PDF blob
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Solar_Quotation_${formData.customerName.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
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
                      !formData.monthlyBill ||
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
                  !formData.monthlyBill ||
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
