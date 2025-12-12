import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { companyInfo } from '../mock/data';

const Footer = () => {
  const navigate = useNavigate();
  
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="https://via.placeholder.com/50x50/0066CC/FFFFFF?text=SE" 
                alt="Satyajan Energy Solutions Logo" 
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div className="flex flex-col">
                <span className="font-bold text-white text-lg leading-tight">Satyajan</span>
                <span className="text-xs text-gray-400 leading-tight">Energy Solutions</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Your trusted partner for solar solutions, power backup systems, and battery management across India.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => scrollToSection('hero')} className="text-gray-400 hover:text-white transition-colors text-sm">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('about')} className="text-gray-400 hover:text-white transition-colors text-sm">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('products')} className="text-gray-400 hover:text-white transition-colors text-sm">
                  Products & Services
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('benefits')} className="text-gray-400 hover:text-white transition-colors text-sm">
                  Why Choose Us
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('dealers')} className="text-gray-400 hover:text-white transition-colors text-sm">
                  Dealer Program
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('faq')} className="text-gray-400 hover:text-white transition-colors text-sm">
                  FAQs
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/careers')} className="text-gray-400 hover:text-white transition-colors text-sm">
                  Careers
                </button>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Our Products</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-400 hover:text-white transition-colors cursor-pointer">Solar Solutions</li>
              <li className="text-gray-400 hover:text-white transition-colors cursor-pointer">Inverter / Home UPS</li>
              <li className="text-gray-400 hover:text-white transition-colors cursor-pointer">Jumbo UPS</li>
              <li className="text-gray-400 hover:text-white transition-colors cursor-pointer">Online UPS</li>
              <li className="text-gray-400 hover:text-white transition-colors cursor-pointer">Tubular Battery</li>
              <li className="text-gray-400 hover:text-white transition-colors cursor-pointer">Lithium Batteries</li>
              <li className="text-gray-400 hover:text-white transition-colors cursor-pointer">Combos</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <a href={`tel:${companyInfo.contact.phone}`} className="flex items-start gap-2 text-gray-400 hover:text-white transition-colors text-sm group">
                  <Phone className="w-4 h-4 mt-0.5 group-hover:text-green-500 transition-colors" />
                  <span>{companyInfo.contact.phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${companyInfo.contact.email}`} className="flex items-start gap-2 text-gray-400 hover:text-white transition-colors text-sm group">
                  <Mail className="w-4 h-4 mt-0.5 group-hover:text-blue-500 transition-colors" />
                  <span>{companyInfo.contact.email}</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 text-gray-400 text-sm">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span>{companyInfo.contact.address}</span>
                </div>
              </li>
            </ul>

            {/* Social Links */}
            <div className="mt-6">
              <h4 className="text-white font-semibold text-sm mb-3">Follow Us</h4>
              <div className="flex gap-3">
                <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400 text-center md:text-left">
              © {currentYear} Satyajan Energy Solutions Pvt Ltd. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
