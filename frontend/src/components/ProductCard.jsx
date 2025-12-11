import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Zap, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const discount = Math.round(((product.mrp - product.offerPrice) / product.mrp) * 100);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    addToCart(product);
    navigate('/cart');
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <Card 
      className="group cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-300 overflow-hidden"
      onClick={handleCardClick}
    >
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        {discount > 0 && (
          <Badge className="absolute top-3 left-3 bg-red-500 text-white font-bold">
            {discount}% OFF
          </Badge>
        )}
        {product.inStock ? (
          <Badge className="absolute top-3 right-3 bg-green-500 text-white">
            In Stock
          </Badge>
        ) : (
          <Badge className="absolute top-3 right-3 bg-gray-500 text-white">
            Out of Stock
          </Badge>
        )}
        
        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button 
            variant="secondary" 
            className="bg-white text-gray-900 hover:bg-gray-100"
            onClick={handleCardClick}
          >
            Quick View
          </Button>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="mb-2">
          <span className="text-xs text-gray-500 font-mono">{product.sku}</span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {product.description}
        </p>

        <ul className="space-y-1 mb-4">
          {product.features.slice(0, 2).map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-xs text-gray-700">
              <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-1">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Price Section */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
              ₹{product.offerPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-sm text-gray-500 line-through">
              ₹{product.mrp.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="text-xs text-green-600 font-semibold mt-1">
            Save ₹{(product.mrp - product.offerPrice).toLocaleString('en-IN')}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleAddToCart}
            variant="outline"
            className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50"
            disabled={!product.inStock}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
          <Button
            onClick={handleBuyNow}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!product.inStock}
          >
            <Zap className="w-4 h-4 mr-2" />
            Buy Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
