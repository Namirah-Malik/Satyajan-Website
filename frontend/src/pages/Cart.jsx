import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Tag } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Separator } from '../components/ui/separator';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, getCartTotal, getMRPTotal, getSavings } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const deliveryCharge = getCartTotal() > 5000 ? 0 : 150;
  const finalTotal = getCartTotal() - discount + deliveryCharge;

  const handleApplyCoupon = () => {
    // Mock coupon validation
    if (couponCode.toUpperCase() === 'SAVE10') {
      const discountAmount = Math.round(getCartTotal() * 0.1);
      setDiscount(discountAmount);
      toast.success('Coupon applied successfully! You saved ₹' + discountAmount);
    } else if (couponCode.toUpperCase() === 'FIRST100') {
      setDiscount(100);
      toast.success('Coupon applied successfully! You saved ₹100');
    } else if (couponCode) {
      toast.error('Invalid coupon code');
    }
  };

  const handleCheckout = () => {
    toast.success('Proceeding to checkout...');
    // In real app, navigate to checkout page
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <Card className="max-w-md mx-auto text-center">
              <CardContent className="p-12">
                <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-600 mb-6">
                  Add some products to get started!
                </p>
                <Button
                  onClick={() => navigate('/products')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/products')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-2">{cart.length} item(s) in your cart</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div 
                        className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                        onClick={() => navigate(`/product/${item.id}`)}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex justify-between gap-4">
                          <div>
                            <h3 
                              className="font-bold text-gray-900 mb-1 cursor-pointer hover:text-blue-600 transition-colors"
                              onClick={() => navigate(`/product/${item.id}`)}
                            >
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-500 font-mono mb-2">
                              SKU: {item.sku}
                            </p>
                          </div>

                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Price and Quantity */}
                        <div className="flex items-center justify-between mt-4">
                          <div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-bold text-gray-900">
                                ₹{item.offerPrice.toLocaleString('en-IN')}
                              </span>
                              <span className="text-sm text-gray-500 line-through">
                                ₹{item.mrp.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <p className="text-xs text-green-600 font-semibold mt-1">
                              Save ₹{(item.mrp - item.offerPrice).toLocaleString('en-IN')} per unit
                            </p>
                          </div>

                          {/* Quantity Selector */}
                          <div className="flex items-center gap-2 border-2 border-gray-200 rounded-lg">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-10 w-10 p-0"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-12 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-10 w-10 p-0"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Subtotal */}
                        <div className="mt-3 text-right">
                          <span className="text-sm text-gray-600">Subtotal: </span>
                          <span className="text-lg font-bold text-gray-900">
                            ₹{(item.offerPrice * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Coupon Section */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Apply Coupon
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          type="text"
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          className="pl-10"
                        />
                      </div>
                      <Button
                        onClick={handleApplyCoupon}
                        variant="outline"
                        className="border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        Apply
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Try: SAVE10 or FIRST100
                    </p>
                  </div>

                  <Separator className="my-4" />

                  {/* Price Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>MRP Total</span>
                      <span>₹{getMRPTotal().toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-green-600 font-semibold">
                      <span>Product Discount</span>
                      <span>- ₹{getSavings().toLocaleString('en-IN')}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600 font-semibold">
                        <span>Coupon Discount</span>
                        <span>- ₹{discount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Charges</span>
                      {deliveryCharge === 0 ? (
                        <span className="text-green-600 font-semibold">FREE</span>
                      ) : (
                        <span>₹{deliveryCharge}</span>
                      )}
                    </div>

                    <Separator className="my-3" />

                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total Amount</span>
                      <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <p className="text-xs text-gray-500">(Tax Included)</p>

                    {deliveryCharge > 0 && (
                      <p className="text-sm text-blue-600 font-semibold">
                        Add ₹{(5000 - getCartTotal()).toLocaleString('en-IN')} more for FREE delivery
                      </p>
                    )}
                  </div>

                  <Separator className="my-6" />

                  {/* Total Savings */}
                  <div className="bg-green-50 p-4 rounded-lg mb-6">
                    <p className="text-sm font-semibold text-green-800">
                      Total Savings: ₹{(getSavings() + discount).toLocaleString('en-IN')}
                    </p>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6"
                    size="lg"
                  >
                    Proceed to Checkout
                  </Button>

                  <Button
                    onClick={() => navigate('/products')}
                    variant="outline"
                    className="w-full mt-3"
                  >
                    Continue Shopping
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
