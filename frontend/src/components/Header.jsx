import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useCart } from '../context/CartContext';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const cartCount = getCartCount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', id: 'hero', path: '/' },
    { name: 'About', id: 'about', path: '/' },
    { name: 'Products', id: 'products', path: '/products' },
    { name: 'Services', id: 'services', path: '/services' },
    { name: 'Blog', id: 'blog', path: '/blogs' },
    { name: 'Careers', id: 'careers', path: '/careers' },
    { name: 'Contact', id: 'contact', path: '/' }
  ];

  const handleNavClick = (link) => {
    if (link.path === '/products') {
      navigate('/products');
    } else if (link.path === '/services') {
      navigate('/services');
    } else if (link.path === '/blogs') {
      navigate('/blogs');
    } else if (link.path === '/careers') {
      navigate('/careers');
    } else if (link.path === '/quotation') {
      navigate('/quotation');
    } else if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: link.id } });
    } else {
      scrollToSection(link.id);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-4">
              <a href="tel:+918019179159" className="flex items-center gap-2 hover:text-blue-200 transition-colors">
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">+91 8019179159</span>
              </a>
              <a href="mailto:info@satyajan.com" className="flex items-center gap-2 hover:text-blue-200 transition-colors">
                <Mail className="w-4 h-4" />
                <span className="hidden sm:inline">info@satyajan.com</span>
              </a>
            </div>
            <div className="text-xs sm:text-sm font-medium">
              Reliable Power & Solar Solutions
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('hero')}>
            <img 
              src="https://via.placeholder.com/50x50/0066CC/FFFFFF?text=SE" 
              alt="Satyajan Energy Solutions Logo" 
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 text-lg leading-tight">Satyajan</span>
              <span className="text-xs text-gray-600 leading-tight">Energy Solutions</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link)}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </button>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Cart Icon */}
            <button
              onClick={() => navigate('/cart')}
              className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 min-w-[20px] h-5 flex items-center justify-center">
                  {cartCount}
                </Badge>
              )}
            </button>

            <Button
              onClick={() => {
                if (location.pathname !== '/') {
                  navigate('/', { state: { scrollTo: 'contact' } });
                } else {
                  scrollToSection('contact');
                }
              }}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Get Quote
            </Button>
            <Button
              onClick={() => window.open('https://wa.me/918019179159', '_blank')}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              WhatsApp Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link)}
                className="text-left py-2 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
              >
                {link.name}
              </button>
            ))}
            <div className="flex flex-col gap-2 mt-2">
              <Button
                onClick={() => {
                  navigate('/cart');
                  setIsMobileMenuOpen(false);
                }}
                variant="outline"
                className="w-full border-gray-600 text-gray-600 relative"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart
                {cartCount > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white">
                    {cartCount}
                  </Badge>
                )}
              </Button>
              <Button
                onClick={() => {
                  if (location.pathname !== '/') {
                    navigate('/', { state: { scrollTo: 'contact' } });
                  } else {
                    scrollToSection('contact');
                  }
                  setIsMobileMenuOpen(false);
                }}
                variant="outline"
                className="w-full border-blue-600 text-blue-600"
              >
                Get Quote
              </Button>
              <Button
                onClick={() => window.open('https://wa.me/918019179159', '_blank')}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                WhatsApp Now
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
