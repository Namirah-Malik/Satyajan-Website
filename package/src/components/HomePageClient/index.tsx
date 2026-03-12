"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Star, Phone, Mail, MapPin, Send, MessageCircle, Calculator, Target, Eye, Heart, LucideIcon } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { companyInfo, products, benefits, testimonials, faqs } from '@/mock/data'
import CallMeBackModal from '@/components/CallMeBackModal'
import SolarSavingsCalculator from '@/components/SolarSavingsCalculator'
import { useScrollModal } from '@/hooks/useScrollModal'

// --- UI Components matching TechnologyPage ---

const WavyDivider = ({ flip = false }: { flip?: boolean }) => (
  <svg
    className={`w-full h-12 ${flip ? 'rotate-180' : ''}`}
    viewBox="0 0 1440 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <path
      d="M0,0 C480,100 960,0 1440,100 L1440,100 L0,100 Z"
      fill="url(#wavyGradient)"
      opacity="0.12"
    />
    <defs>
      <linearGradient id="wavyGradient" x1="0" y1="0" x2="1440" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFD600" />
        <stop offset="1" stopColor="#34D399" />
      </linearGradient>
    </defs>
  </svg>
);

const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/40 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 ${className} transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}>{children}</div>
);

// Adapted to use Lucide Icons instead of Iconify
const PlayfulIcon = ({ icon: Icon, ringColor, bgColor }: { icon: LucideIcon; ringColor: string; bgColor: string }) => (
  <div className={`relative flex items-center justify-center w-16 h-16 ${bgColor} rounded-full shadow-lg mb-3`}>
    <span className={`absolute inset-0 rounded-full animate-spin-slow border-4 ${ringColor} opacity-30`}></span>
    <Icon className="w-7 h-7 text-white z-10" />
  </div>
);

// --- Main Component ---

export default function HomePageClient() {
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [showSavingsCalculator, setShowSavingsCalculator] = useState(false)
  const { showModal, closeModal } = useScrollModal({ triggerTimeMs: 60000, showOnFooterReach: true })

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Thank you for contacting us!')
    setContactForm({ name: '', email: '', phone: '', message: '' })
  }

  const removedFaqs: string[] = [
    'How long do solar panels last?',
    'Do you provide installation services?',
    'What are the benefits of joining as a dealer?',
    'Are the products covered under warranty?',
  ]

  return (
    <main className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section id="hero" className="relative pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50 opacity-80" />
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight drop-shadow-lg tracking-tight">
                Power Your Future with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">Clean Solar Energy</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium">
                Save up to 80% on electricity bills. Get 25-year warranty. Easy EMI options available. Join 1000+ satisfied customers across India.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="bg-gradient-to-r from-emerald-500 to-teal-400 text-white text-lg px-8 py-3 rounded-full flex items-center gap-3 shadow-xl hover:shadow-2xl transition-all font-semibold">
                  <span>Book Free Consultation</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button onClick={() => setShowSavingsCalculator(true)} className="bg-white/60 backdrop-blur-lg border border-white/30 text-gray-700 hover:bg-white text-lg px-8 py-3 rounded-full flex items-center gap-3 shadow-md">
                  <Calculator className="w-5 h-5 text-emerald-600" />
                  <span>Calculate Savings</span>
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-8 pt-8">
                <GlassCard className="p-4 text-center">
                  <div className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">1000+</div>
                  <div className="text-xs md:text-sm text-gray-600 mt-1 font-medium">Happy Customers</div>
                </GlassCard>
                <GlassCard className="p-4 text-center">
                  <div className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">25 Years</div>
                  <div className="text-xs md:text-sm text-gray-600 mt-1 font-medium">Warranty</div>
                </GlassCard>
                <GlassCard className="p-4 text-center">
                  <div className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">80%</div>
                  <div className="text-xs md:text-sm text-gray-600 mt-1 font-medium">Bill Savings</div>
                </GlassCard>
              </div>
            </div>
            
            <div className="relative">
              <GlassCard className="p-2 rounded-3xl overflow-hidden">
                <div className="relative rounded-2xl overflow-hidden">
                  <img src="/images/hero/Product_range.png" alt="Microtek Product Range" className="w-full h-[500px] object-contain bg-white/80" />
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
        <WavyDivider />
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 drop-shadow-lg tracking-tight">
              About Satyajan Energy Solutions
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto font-medium">{companyInfo.description}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <GlassCard className="p-6 flex flex-col items-center text-center">
              <PlayfulIcon icon={Target} ringColor="border-blue-400" bgColor="bg-gradient-to-br from-blue-400 to-blue-600" />
              <h3 className="font-bold text-xl text-gray-900 mb-2">Our Mission</h3>
              <p className="text-gray-600 font-medium">To provide reliable, sustainable energy solutions that empower homes and businesses across India.</p>
            </GlassCard>
            <GlassCard className="p-6 flex flex-col items-center text-center">
              <PlayfulIcon icon={Eye} ringColor="border-emerald-400" bgColor="bg-gradient-to-br from-emerald-400 to-green-500" />
              <h3 className="font-bold text-xl text-gray-900 mb-2">Our Vision</h3>
              <p className="text-gray-600 font-medium">To be India's most trusted partner for clean energy and power backup solutions.</p>
            </GlassCard>
            <GlassCard className="p-6 flex flex-col items-center text-center">
              <PlayfulIcon icon={Heart} ringColor="border-rose-400" bgColor="bg-gradient-to-br from-rose-400 to-red-500" />
              <h3 className="font-bold text-xl text-gray-900 mb-2">Our Values</h3>
              <p className="text-gray-600 font-medium">Quality, reliability, customer satisfaction, and commitment to sustainable future.</p>
            </GlassCard>
          </div>
        </div>
      </section>

      <WavyDivider flip />

      {/* Products Section */}
      <section id="products" className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-start mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 drop-shadow-lg tracking-tight">
              Our Products & Services
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl font-medium">
              Comprehensive range of power solutions backed by Microtek's quality and our expert support.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.filter((p: any) => p.name !== 'Combos').map((product: any) => (
              <GlassCard key={product.id} className="overflow-hidden group">
                <div className="relative h-48 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-xl font-bold text-white drop-shadow-md">{product.name}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4 font-medium text-sm">{product.description}</p>
                  <ul className="space-y-2 mb-6">
                    {product.features.slice(0, 3).map((f: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/products" className="w-full bg-emerald-600/80 hover:bg-emerald-600 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md font-semibold">
                    View Details <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-start mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 drop-shadow-lg tracking-tight">
              Why Choose Us?
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl font-medium">
              Your trusted partner for reliable power solutions with unmatched service quality.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((b: any, i: number) => {
              const Icon = (LucideIcons as any)[b.icon]
              return (
                <GlassCard key={i} className="p-6 flex flex-col items-center text-center">
                  {Icon && <PlayfulIcon icon={Icon} ringColor="border-primary" bgColor="bg-gradient-to-br from-emerald-400 to-teal-500" />}
                  <h4 className="text-xl font-bold text-gray-900 mt-2">{b.title}</h4>
                  <p className="text-gray-600 mt-2 font-medium">{b.description}</p>
                </GlassCard>
              )
            })}
          </div>
        </div>
      </section>

      <WavyDivider />

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-start mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 drop-shadow-lg tracking-tight">
              What Our Clients Say
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl font-medium">
              Real experiences from satisfied customers across India
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t: any) => (
              <GlassCard key={t.id} className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_: any, i: number) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-gray-700 mb-6 italic font-medium">"{t.text}"</p>
                <div className="font-bold text-gray-900">{t.name}</div>
                <div className="text-sm text-gray-500">{t.location || 'Customer'}</div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-12">
                <h2 className="text-4xl font-extrabold text-gray-900 mb-4 drop-shadow-lg tracking-tight">
                  Frequently Asked Questions
                </h2>
                <p className="text-lg text-gray-600 max-w-4xl font-medium">
                  Everything you need to know about our products and services
                </p>
              </div>
              <div className="space-y-4">
                {faqs.filter((f: any) => !removedFaqs.includes(f.question)).slice(0, 4).map((f: any, i: number) => (
                  <GlassCard key={i} className="p-0 overflow-hidden">
                    <details className="group">
                      <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold text-gray-900 hover:text-emerald-600 transition-colors">
                        {f.question}
                        <ArrowRight className="w-5 h-5 transform transition-transform group-open:rotate-90" />
                      </summary>
                      <div className="px-6 pb-6 text-gray-600 font-medium bg-white/50">{f.answer}</div>
                    </details>
                  </GlassCard>
                ))}
              </div>
            </div>
            <div className="w-full">
              <GlassCard className="rounded-2xl overflow-hidden shadow-2xl">
                <img src="/images/faqs/homeimagefaq.jpeg" alt="FAQ" className="w-full h-full object-cover" />
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      <WavyDivider flip />

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-start mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 drop-shadow-lg tracking-tight">
              Get In Touch
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl font-medium">
              Have questions? We're here to help. Contact us for a free consultation.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <GlassCard className="p-6 flex items-start gap-4">
                <PlayfulIcon icon={Phone} ringColor="border-blue-400" bgColor="bg-gradient-to-br from-blue-400 to-blue-600" />
                <div>
                  <div className="font-bold text-gray-900 text-lg">Phone</div>
                  <a href={`tel:${companyInfo.contact.phone}`} className="text-gray-600 hover:text-emerald-600 font-medium">{companyInfo.contact.phone}</a>
                </div>
              </GlassCard>
              
              <GlassCard className="p-6 flex items-start gap-4">
                <PlayfulIcon icon={Mail} ringColor="border-emerald-400" bgColor="bg-gradient-to-br from-emerald-400 to-teal-500" />
                <div>
                  <div className="font-bold text-gray-900 text-lg">Email</div>
                  <a href={`mailto:${companyInfo.contact.email}`} className="text-gray-600 hover:text-emerald-600 font-medium">{companyInfo.contact.email}</a>
                </div>
              </GlassCard>

              <GlassCard className="p-6 flex items-start gap-4">
                <PlayfulIcon icon={MapPin} ringColor="border-orange-400" bgColor="bg-gradient-to-br from-orange-400 to-red-500" />
                <div>
                  <div className="font-bold text-gray-900 text-lg">Address</div>
                  <p className="text-gray-600 font-medium">{companyInfo.contact.address}</p>
                </div>
              </GlassCard>

              <button onClick={() => window.open('https://wa.me/918019179159', '_blank')} className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-lg px-6 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl transition-all font-semibold">
                <MessageCircle className="w-6 h-6" /> WhatsApp Now
              </button>
            </div>

            {/* Contact Form */}
            <GlassCard className="p-8">
              <h4 className="text-2xl font-bold text-gray-900 mb-2">Send Us a Message</h4>
              <p className="text-sm text-gray-600 mb-6 font-medium">Fill out the form and we'll get back to you within 24 hours</p>
              <form onSubmit={handleContactSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1.5">Name *</label>
                  <input required value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} className="w-full bg-white/60 border border-white/40 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none font-medium" placeholder="Your full name" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1.5">Email *</label>
                  <input required type="email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} className="w-full bg-white/60 border border-white/40 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none font-medium" placeholder="your.email@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1.5">Phone</label>
                  <input value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} className="w-full bg-white/60 border border-white/40 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none font-medium" placeholder="+91 98765 43210" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1.5">Message *</label>
                  <textarea required value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} className="w-full bg-white/60 border border-white/40 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none font-medium" rows={4} placeholder="Tell us about your requirements" />
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-3 rounded-xl shadow-lg transition-all font-bold flex items-center justify-center gap-2">
                  Send Message <Send className="w-4 h-4" />
                </button>
              </form>
            </GlassCard>
          </div>
        </div>
      </section>

      <CallMeBackModal isOpen={showModal} onClose={closeModal} />
      <SolarSavingsCalculator isOpen={showSavingsCalculator} onClose={() => setShowSavingsCalculator(false)} />
    </main>
  )
}