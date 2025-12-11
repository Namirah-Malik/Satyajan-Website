import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Zap, CheckCircle, Shield, Truck, Star, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { mockProducts } from '../mock/productData';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');

  const product = mockProducts.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <Button onClick={() => navigate('/products')}>Back to Products</Button>
        </div>
      </div>
    );
  }

  const discount = Math.round(((product.mrp - product.offerPrice) / product.mrp) * 100);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <Button
            variant="ghost"
            onClick={() => navigate('/products')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div>
              <Card className="mb-4 overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative h-96 bg-gray-100">
                    <img
                      src={product.images[selectedImage]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {discount > 0 && (
                      <Badge className="absolute top-4 left-4 bg-red-500 text-white text-lg px-4 py-2">
                        {discount}% OFF
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-1 border-2 rounded-lg overflow-hidden transition-all ${
                        selectedImage === index
                          ? 'border-blue-600'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-24 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-2">
                <span className="text-sm text-gray-500 font-mono">{product.sku}</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(4.5/5 - 120 reviews)</span>
              </div>

              {/* Price Section */}
              <Card className="mb-6 bg-blue-50 border-2 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-4xl font-bold text-gray-900">
                      ₹{product.offerPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      ₹{product.mrp.toLocaleString('en-IN')}
                    </span>
                    <Badge className="bg-green-600 text-white text-sm">
                      {discount}% OFF
                    </Badge>
                  </div>
                  <div className="text-sm text-green-700 font-semibold">
                    You save ₹{(product.mrp - product.offerPrice).toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    (Inclusive of all taxes)
                  </div>
                </CardContent>
              </Card>

              {/* Stock Status */}
              <div className="mb-6">
                {product.inStock ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">In Stock - Ready to Ship</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600">
                    <span className="font-semibold">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Key Features */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Key Features:</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Quantity:
                </label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 p-0"
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center"
                    min="1"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 p-0"
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  size="lg"
                  className="flex-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  onClick={handleBuyNow}
                  size="lg"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={!product.inStock}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Buy Now
                </Button>
              </div>

              {/* Delivery Info */}
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-4">
                    <Truck className="w-5 h-5 text-green-600 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">Delivery Options</h4>
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          placeholder="Enter pincode"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          className="flex-1"
                          maxLength="6"
                        />
                        <Button variant="outline" size="sm">
                          Check
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Free delivery on orders above ₹5000
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Warranty</h4>
                      <p className="text-sm text-gray-600">{product.warranty}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-12">
            <Tabs defaultValue="specifications" className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-2xl">
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="warranty">Warranty & Support</TabsTrigger>
              </TabsList>

              <TabsContent value="specifications" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Technical Specifications</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex border-b border-gray-200 pb-3">
                          <span className="font-semibold text-gray-700 w-1/2">{key}:</span>
                          <span className="text-gray-600 w-1/2">{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="description" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Product Description</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">{product.description}</p>
                    <h4 className="font-semibold text-gray-900 mb-2">Features & Benefits:</h4>
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="warranty" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Warranty Information</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Coverage:</h4>
                        <p className="text-gray-700">{product.warranty}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">What's Covered:</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          <li>Manufacturing defects</li>
                          <li>Component failures under normal use</li>
                          <li>Free replacement during warranty period</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Support:</h4>
                        <p className="text-gray-700">
                          24/7 customer support available. Call +91 8019179159 or email info@satyajan.com
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
