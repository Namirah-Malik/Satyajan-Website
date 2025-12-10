import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, Star, ChevronDown, ChevronUp, Phone, Mail, MapPin, Send, Download, X, MessageCircle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { companyInfo, products, benefits, testimonials, faqs, dealerBenefits } from '../mock/data';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [dealerForm, setDealerForm] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    location: '',
    experience: ''
  });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', contactForm);
    alert('Thank you for contacting us! We will get back to you soon.');
    setContactForm({ name: '', email: '', phone: '', message: '' });
  };

  const handleDealerSubmit = (e) => {
    e.preventDefault();
    console.log('Dealer form submitted:', dealerForm);
    alert('Thank you for your interest! Our team will contact you soon.');
    setDealerForm({ name: '', email: '', phone: '', businessName: '', location: '', experience: '' });
  };

  // Show welcome popup on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomePopup(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Welcome Popup */}
      {showWelcomePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md mx-4 p-6 relative animate-in zoom-in duration-300">
            <button
              onClick={() => setShowWelcomePopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome!</h3>
              <p className="text-gray-600 mb-6">
                Welcome to Satyajan Energy Solutions — Your reliable partner for power backup and solar solutions!
              </p>
              <Button
                onClick={() => setShowWelcomePopup(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Explore Our Solutions
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section id="hero" className="relative pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50"></div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block">
                <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold animate-pulse">
                  ⚡ Reliable Power & Solar Solutions
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                {companyInfo.tagline}
              </h1>
              
              <p className="text-lg text-gray-600">
                {companyInfo.mission}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6"
                  onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                >
                  Get Free Quote
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-green-600 text-green-600 hover:bg-green-50 text-lg px-8 py-6"
                  onClick={() => window.open('https://wa.me/918019179159', '_blank')}
                >
                  <MessageCircle className="mr-2 w-5 h-5" />
                  WhatsApp Now
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
                {companyInfo.stats.map((stat, index) => {
                  const Icon = LucideIcons[stat.icon];
                  return (
                    <div key={index} className="text-center">
                      <div className="flex justify-center mb-2">
                        {Icon && <Icon className="w-6 h-6 text-blue-600" />}
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1509391366360-2e959784a276"
                  alt="Solar Energy Solutions"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border-2 border-green-500">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">15+</div>
                    <div className="text-sm text-gray-600">Years Experience</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              About Satyajan Energy Solutions
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {companyInfo.description}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 border-blue-100 hover:border-blue-300 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <LucideIcons.Target className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">To provide reliable, sustainable energy solutions that empower homes and businesses across India.</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-100 hover:border-green-300 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <LucideIcons.Eye className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">To be India's most trusted partner for clean energy and power backup solutions.</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-100 hover:border-orange-300 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <LucideIcons.Heart className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Our Values</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Quality, reliability, customer satisfaction, and commitment to sustainable future.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Products & Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive range of power solutions backed by Microtek's quality and our expert support
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card key={product.id} className="group hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-300 overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white">{product.name}</h3>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <ul className="space-y-2 mb-6">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
                  >
                    Visit Products
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="benefits" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Satyajan Energy Solutions?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your trusted partner for reliable power solutions with unmatched service quality
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = LucideIcons[benefit.icon];
              return (
                <Card key={index} className="border-2 border-gray-100 hover:border-blue-300 hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                      {Icon && <Icon className="w-7 h-7 text-white" />}
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-gray-600">
              Real experiences from satisfied customers across India
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="border-2 border-gray-100 hover:border-blue-300 hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dealer Program Section */}
      <section id="dealers" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Join Our Dealer Network
              </h2>
              <p className="text-lg text-gray-600">
                Become a part of India's fastest-growing energy solutions network
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Dealer Benefits</h3>
                <ul className="space-y-4">
                  {dealerBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">Download Dealer Brochure</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Get detailed information about our dealer program, products, and benefits.
                  </p>
                  <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                    <Download className="mr-2 w-4 h-4" />
                    Download Brochure
                  </Button>
                </div>
              </div>

              <Card className="border-2 border-blue-100">
                <CardHeader>
                  <CardTitle>Dealer Registration Form</CardTitle>
                  <CardDescription>
                    Fill out the form below and our team will contact you within 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleDealerSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="dealer-name">Full Name *</Label>
                      <Input
                        id="dealer-name"
                        required
                        value={dealerForm.name}
                        onChange={(e) => setDealerForm({ ...dealerForm, name: e.target.value })}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dealer-email">Email *</Label>
                      <Input
                        id="dealer-email"
                        type="email"
                        required
                        value={dealerForm.email}
                        onChange={(e) => setDealerForm({ ...dealerForm, email: e.target.value })}
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dealer-phone">Phone *</Label>
                      <Input
                        id="dealer-phone"
                        required
                        value={dealerForm.phone}
                        onChange={(e) => setDealerForm({ ...dealerForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <Label htmlFor="business-name">Business Name *</Label>
                      <Input
                        id="business-name"
                        required
                        value={dealerForm.businessName}
                        onChange={(e) => setDealerForm({ ...dealerForm, businessName: e.target.value })}
                        placeholder="Your business name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location/City *</Label>
                      <Input
                        id="location"
                        required
                        value={dealerForm.location}
                        onChange={(e) => setDealerForm({ ...dealerForm, location: e.target.value })}
                        placeholder="City, State"
                      />
                    </div>
                    <div>
                      <Label htmlFor="experience">Business Experience</Label>
                      <Textarea
                        id="experience"
                        value={dealerForm.experience}
                        onChange={(e) => setDealerForm({ ...dealerForm, experience: e.target.value })}
                        placeholder="Tell us about your business experience"
                        rows={3}
                      />
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Submit Application
                      <Send className="ml-2 w-4 h-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600">
                Everything you need to know about our products and services
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-2 border-gray-200 rounded-lg px-6 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-blue-600">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Get In Touch
              </h2>
              <p className="text-lg text-gray-600">
                Have questions? We're here to help. Contact us for a free consultation.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">Phone</div>
                      <a href={`tel:${companyInfo.contact.phone}`} className="text-gray-600 hover:text-blue-600">
                        {companyInfo.contact.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">Email</div>
                      <a href={`mailto:${companyInfo.contact.email}`} className="text-gray-600 hover:text-green-600">
                        {companyInfo.contact.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">Address</div>
                      <p className="text-gray-600">{companyInfo.contact.address}</p>
                    </div>
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="mt-8 h-64 bg-gray-200 rounded-xl overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248849.56658912525!2d77.46612655!3d12.95428085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Location Map"
                  ></iframe>
                </div>
              </div>

              <Card className="border-2 border-blue-100">
                <CardHeader>
                  <CardTitle>Send Us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form and we'll get back to you within 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        required
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="Tell us about your requirements"
                        rows={5}
                      />
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Send Message
                      <Send className="ml-2 w-4 h-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
