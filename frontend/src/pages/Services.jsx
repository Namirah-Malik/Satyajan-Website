import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Compass, Wrench, Settings, FileText, Calculator, Zap, Calendar, Activity, RefreshCw, Recycle, MapPin, AlertCircle, TrendingUp, Headphones, Users, Clock, ShieldCheck, IndianRupee, MessageCircle, Phone } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { solarServices, powerBackupServices, batteryServices, technicalSupport, serviceFeatures } from '../mock/servicesData';

const Services = () => {
  const navigate = useNavigate();

  const getIconComponent = (iconName) => {
    const iconMap = {
      'Compass': Compass,
      'Wrench': Wrench,
      'Settings': Settings,
      'FileText': FileText,
      'Calculator': Calculator,
      'Zap': Zap,
      'Calendar': Calendar,
      'Activity': Activity,
      'Stethoscope': Activity, // Using Activity as placeholder
      'Tool': Wrench, // Using Wrench as Tool icon
      'RefreshCw': RefreshCw,
      'Recycle': Recycle,
      'MapPin': MapPin,
      'AlertCircle': AlertCircle,
      'TrendingUp': TrendingUp,
      'Headphones': Headphones,
      'Users': Users,
      'Clock': Clock,
      'ShieldCheck': ShieldCheck,
      'IndianRupee': IndianRupee
    };
    return iconMap[iconName] || LucideIcons.Circle;
  };

  const ServiceCard = ({ service }) => {
    const Icon = getIconComponent(service.icon);
    return (
      <Card className="group hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-300 h-full">
        <CardContent className="p-6">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Icon className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
            {service.title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {service.description}
          </p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e"
            alt="Professional energy services"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/85"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Our Services
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Reliable Solar, Power Backup, Battery & Technical Support Services. Complete energy solutions with professional installation, maintenance, and 24/7 support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6"
                onClick={() => navigate('/#contact')}
              >
                Request Service
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6"
                onClick={() => window.open('https://wa.me/918019179159?text=Hi, I need help with energy services', '_blank')}
              >
                <MessageCircle className="mr-2 w-5 h-5" />
                WhatsApp Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Solar Energy Services */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Solar Energy Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              End-to-end solar solutions from design to installation and ongoing maintenance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {solarServices.map((service, index) => (
              <ServiceCard key={index} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Power Backup & UPS Services */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Power Backup & UPS Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional inverter and UPS solutions ensuring uninterrupted power supply
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {powerBackupServices.map((service, index) => (
              <ServiceCard key={index} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Battery Services */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Battery Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive battery care for maximum performance and longevity
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {batteryServices.map((service, index) => (
              <ServiceCard key={index} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Technical Support & After-Sales */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Technical Support & After-Sales Service
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Reliable support and maintenance to keep your systems running smoothly
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {technicalSupport.map((service, index) => (
              <ServiceCard key={index} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Our Services */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Services?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional service you can trust
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {serviceFeatures.map((feature, index) => {
              const Icon = getIconComponent(feature.icon);
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service Process */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How We Serve You
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple, transparent process from request to completion
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Request Service</h3>
              <p className="text-sm text-gray-600">Call, WhatsApp, or fill contact form</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Site Assessment</h3>
              <p className="text-sm text-gray-600">Our expert visits and evaluates</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Quote & Approval</h3>
              <p className="text-sm text-gray-600">Transparent pricing, no hidden costs</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                4
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Service Completion</h3>
              <p className="text-sm text-gray-600">Professional work with warranty</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Need Reliable Energy Services?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Get professional installation, maintenance, and support for all your power backup and solar needs. Contact us today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6"
                onClick={() => navigate('/#contact')}
              >
                <Phone className="mr-2 w-5 h-5" />
                Contact Us
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6"
                onClick={() => navigate('/products')}
              >
                View Our Products
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
            
            <div className="mt-8 pt-8 border-t border-blue-500">
              <p className="text-blue-100 mb-3">Call us now for immediate assistance</p>
              <a 
                href="tel:+918019179159" 
                className="text-2xl font-bold text-white hover:text-blue-100 transition-colors"
              >
                +91 8019179159
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
