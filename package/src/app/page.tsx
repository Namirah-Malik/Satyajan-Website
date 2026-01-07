"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Star, Phone, Mail, MapPin, Send, Download, MessageCircle, X, Calculator } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { companyInfo, products, benefits, testimonials, faqs, dealerBenefits } from '@/mock/data'
import CallMeBackModal from '@/components/CallMeBackModal'
import SolarSavingsCalculator from '@/components/SolarSavingsCalculator'
import { useScrollTimer } from '@/hooks/useScrollTimer'

export default function HomePageClient() {
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [dealerForm, setDealerForm] = useState({ name: '', email: '', phone: '', businessName: '', location: '', experience: '' })
  const [showSavingsCalculator, setShowSavingsCalculator] = useState(false)
  const { showModal, closeModal } = useScrollTimer(60000) // 60 seconds

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Contact submitted', contactForm)
    alert('Thank you for contacting us!')
    setContactForm({ name: '', email: '', phone: '', message: '' })
  }

  const handleDealerSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Dealer submitted', dealerForm)
    alert('Thank you for your interest!')
    setDealerForm({ name: '', email: '', phone: '', businessName: '', location: '', experience: '' })
  }

  // FAQ entries to remove from homepage
  const removedFaqs: string[] = [
    'How long do solar panels last?',
    'Do you provide installation services?',
    'What are the benefits of joining as a dealer?',
    'Are the products covered under warranty?',
  ];

  return (
    <main>
      {/* Hero */}
      <section id="hero" className="relative pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50" />
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                Power Your Future with <span className="text-green-500">Clean Solar Energy</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                Save up to 80% on electricity bills. Get 25-year warranty. Easy EMI options available. Join 1000+ satisfied customers across India.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 items-center">
                <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="bg-gradient-to-r from-green-400 to-teal-400 text-white text-lg px-10 py-4 rounded-full flex items-center gap-3 shadow-xl">
                  <span>Book Free Consultation</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button onClick={() => setShowSavingsCalculator(true)} className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 text-lg px-10 py-4 rounded-full flex items-center gap-3">
                  <Calculator className="w-5 h-5" />
                  <span>Calculate Savings</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-8 md:gap-12 pt-12">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">1000+</div>
                  <div className="text-sm text-gray-600 mt-2">Happy Customers</div>
                </div>

                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">25 Years</div>
                  <div className="text-sm text-gray-600 mt-2">Warranty</div>
                </div>

                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">80%</div>
                  <div className="text-sm text-gray-600 mt-2">Bill Savings</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img src="/images/hero/homepagesolar.jpeg" alt="Solar Energy Solutions" className="w-full h-[500px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* About */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">About Satyajan Energy Solutions</h2>
            <p className="text-lg text-gray-600 leading-relaxed">{companyInfo.description}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="border-2 border-blue-100 rounded-lg p-6 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <LucideIcons.Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold">Our Mission</h3>
              <p className="text-gray-600 mt-3">To provide reliable, sustainable energy solutions that empower homes and businesses across India.</p>
            </div>

            <div className="border-2 border-green-100 rounded-lg p-6 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <LucideIcons.Eye className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold">Our Vision</h3>
              <p className="text-gray-600 mt-3">To be India's most trusted partner for clean energy and power backup solutions.</p>
            </div>

            <div className="border-2 border-orange-100 rounded-lg p-6 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <LucideIcons.Heart className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold">Our Values</h3>
              <p className="text-gray-600 mt-3">Quality, reliability, customer satisfaction, and commitment to sustainable future.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Products & Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Comprehensive range of power solutions backed by Microtek's quality and our expert support</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.filter(p => p.name !== 'Combos').map((product) => (
              <div key={product.id} className="group bg-white rounded-lg overflow-hidden border-2 border-gray-100 hover:shadow-2xl transition-all">
                <div className="relative h-48 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white">{product.name}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <ul className="space-y-2 mb-6">
                    {product.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/products" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md flex items-center justify-center gap-2">Visit Products <ArrowRight className="w-4 h-4" /></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Satyajan Energy Solutions?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Your trusted partner for reliable power solutions with unmatched service quality</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((b, i) => {
              const Icon = (LucideIcons as any)[b.icon]
              return (
                <div key={i} className="border-2 border-gray-100 rounded-lg p-6 hover:shadow-lg transition">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">{Icon && <Icon className="w-7 h-7 text-white" />}</div>
                  <h4 className="text-xl font-semibold">{b.title}</h4>
                  <p className="text-gray-600 mt-3">{b.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
            <p className="text-lg text-gray-600">Real experiences from satisfied customers across India</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map(t => (
              <div key={t.id} className="border-2 border-gray-100 rounded-lg p-6 hover:shadow-xl transition">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-gray-700 mb-6 italic">"{t.text}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{t.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dealers */}
      <section id="dealers" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Join Our Dealer Network</h2>
              <p className="text-lg text-gray-600">Become a part of India's fastest-growing energy solutions network</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Dealer Benefits</h3>
                <ul className="space-y-4">
                  {dealerBenefits.map((db, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5"><CheckCircle className="w-4 h-4 text-green-600" /></div>
                      <span className="text-gray-700">{db}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">Download Dealer Brochure</h4>
                  <p className="text-sm text-gray-600 mb-4">Get detailed information about our dealer program, products, and benefits.</p>
                  <a
                    href="/images/hero/brochure.pdf"
                    download="brochure.pdf"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 border rounded-md px-4 py-2 inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Download Brochure
                  </a>
                </div>
              </div>

              <div className="border-2 border-blue-100 rounded-lg p-6">
                <h4 className="text-xl font-semibold mb-2">Dealer Registration Form</h4>
                <p className="text-sm text-gray-600 mb-4">Fill out the form below and our team will contact you within 24 hours</p>
                <form onSubmit={handleDealerSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name *</label>
                    <input required value={dealerForm.name} onChange={(e) => setDealerForm({ ...dealerForm, name: e.target.value })} className="w-full border rounded-md p-2" placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email *</label>
                    <input required type="email" value={dealerForm.email} onChange={(e) => setDealerForm({ ...dealerForm, email: e.target.value })} className="w-full border rounded-md p-2" placeholder="your.email@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone *</label>
                    <input required value={dealerForm.phone} onChange={(e) => setDealerForm({ ...dealerForm, phone: e.target.value })} className="w-full border rounded-md p-2" placeholder="+91 98765 43210" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Business Name *</label>
                    <input required value={dealerForm.businessName} onChange={(e) => setDealerForm({ ...dealerForm, businessName: e.target.value })} className="w-full border rounded-md p-2" placeholder="Your business name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Location/City *</label>
                    <input required value={dealerForm.location} onChange={(e) => setDealerForm({ ...dealerForm, location: e.target.value })} className="w-full border rounded-md p-2" placeholder="City, State" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Business Experience</label>
                    <textarea value={dealerForm.experience} onChange={(e) => setDealerForm({ ...dealerForm, experience: e.target.value })} className="w-full border rounded-md p-2" rows={3} placeholder="Tell us about your business experience" />
                  </div>
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md">Submit Application <Send className="w-4 h-4 inline-block ml-2" /></button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Everything you need to know about our products and services</p>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left: FAQ list */}
            <div className="space-y-4">
              {faqs.filter(f => !removedFaqs.includes(f.question)).map((f, i) => (
                <details key={i} className="border-2 border-gray-200 rounded-lg px-6 py-4 bg-white">
                  <summary className="font-semibold cursor-pointer">{f.question}</summary>
                  <div className="mt-2 text-gray-600">{f.answer}</div>
                </details>
              ))}
            </div>

            {/* Right: Image */}
            <div className="w-full flex items-center justify-center">
              <div className="w-full rounded-xl overflow-hidden shadow-lg">
                <img src="/images/faqs/homeimagefaq.jpeg" alt="FAQ" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="footer" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
              <p className="text-lg text-gray-600">Have questions? We're here to help. Contact us for a free consultation.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"><Phone className="w-6 h-6 text-blue-600" /></div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">Phone</div>
                      <a href={`tel:${companyInfo.contact.phone}`} className="text-gray-600 hover:text-blue-600">{companyInfo.contact.phone}</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0"><Mail className="w-6 h-6 text-green-600" /></div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">Email</div>
                      <a href={`mailto:${companyInfo.contact.email}`} className="text-gray-600 hover:text-green-600">{companyInfo.contact.email}</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0"><MapPin className="w-6 h-6 text-orange-600" /></div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">Address</div>
                      <p className="text-gray-600">{companyInfo.contact.address}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <button onClick={() => window.open('https://wa.me/918019179159', '_blank')} className="w-full bg-green-600 hover:bg-green-700 text-white text-lg px-6 py-3 rounded-md flex items-center justify-center gap-2"><MessageCircle className="w-5 h-5" /> WhatsApp Now</button>
                </div>

                <div className="mt-8 h-64 bg-gray-200 rounded-xl overflow-hidden cursor-pointer relative group">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.9988888888886!2d78.4867!3d17.3850!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99c0c3e1ffe7:0xa6b7d4b850493ba0!2sSatyajan%20Energy%20Solutions%20Pvt.Ltd.!5e0!3m2!1sen!2sin!4v1234567890123" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={true}
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Satyajan Energy Solutions Location"
                    className="pointer-events-none" 
                  />
                  <a 
                    href="https://www.google.com/maps/place/Satyajan+Energy+Solutions+Pvt.Ltd./@17.3326358,78.5367308,15.91z/data=!4m14!1m7!3m6!1s0x3bcb99c0c3e1ffe7:0xa6b7d4b850493ba0!2sSatyajan+Energy+Solutions+Pvt.Ltd.!8m2!3d17.3342621!4d78.5387496!16s%2Fg%2F11rrnq6_d_!3m5!1s0x3bcb99c0c3e1ffe7:0xa6b7d4b850493ba0!8m2!3d17.3342621!4d78.5387496!16s%2Fg%2F11rrnq6_d_?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA2N0gBUAM%3D" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity duration-300"
                  >
                    <span className="text-white font-semibold">Click to open in Google Maps</span>
                  </a>
                </div>
              </div>

              <div className="border-2 border-blue-100 rounded-lg p-6">
                <h4 className="text-xl font-semibold mb-2">Send Us a Message</h4>
                <p className="text-sm text-gray-600 mb-4">Fill out the form and we'll get back to you within 24 hours</p>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name *</label>
                    <input required value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} className="w-full border rounded-md p-2" placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email *</label>
                    <input required type="email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} className="w-full border rounded-md p-2" placeholder="your.email@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} className="w-full border rounded-md p-2" placeholder="+91 98765 43210" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Message *</label>
                    <textarea required value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} className="w-full border rounded-md p-2" rows={5} placeholder="Tell us about your requirements" />
                  </div>
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md">Send Message <Send className="w-4 h-4 inline-block ml-2" /></button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CallMeBackModal isOpen={showModal} onClose={closeModal} />
      <SolarSavingsCalculator isOpen={showSavingsCalculator} onClose={() => setShowSavingsCalculator(false)} />
    </main>
  )
}