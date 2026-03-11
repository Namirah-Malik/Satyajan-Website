"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Star, Phone, Mail, MapPin, Send, Download, MessageCircle, X, Calculator } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { companyInfo, products, benefits, testimonials, faqs, dealerBenefits } from '@/mock/data'
import CallMeBackModal from '@/components/CallMeBackModal'
import SolarSavingsCalculator from '@/components/SolarSavingsCalculator'
import { useScrollTimer } from '@/hooks/useScrollTimer'
import { Icon } from '@iconify/react'

// ── Design system (technology page) ─────────────────────────────────────────
const GlassCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/40 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl ${className}`}>
    {children}
  </div>
)

const PlayfulIcon = ({ icon, ringColor, bgColor }: { icon: string; ringColor: string; bgColor: string }) => (
  <div className={`relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 ${bgColor} rounded-full shadow-lg mb-4 flex-shrink-0`}>
    <span className={`absolute inset-0 rounded-full animate-spin-slow border-4 ${ringColor} opacity-30`} />
    <Icon icon={icon} className="text-2xl sm:text-3xl text-white z-10" />
  </div>
)

const inputClass = 'w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors text-sm bg-white/70'
const labelClass = 'block text-sm font-semibold text-gray-800 mb-1.5'

const cardStyles = [
  { bg: 'bg-primary',                                        ring: 'border-primary' },
  { bg: 'bg-gradient-to-br from-emerald-400 to-green-500',  ring: 'border-emerald-400' },
  { bg: 'bg-gradient-to-br from-yellow-400 to-orange-400',  ring: 'border-yellow-400' },
  { bg: 'bg-gradient-to-br from-blue-400 to-indigo-500',    ring: 'border-blue-400' },
  { bg: 'bg-gradient-to-br from-purple-400 to-violet-500',  ring: 'border-purple-400' },
  { bg: 'bg-gradient-to-br from-pink-400 to-rose-400',      ring: 'border-pink-400' },
]

export default function HomePageClient() {
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [dealerForm, setDealerForm] = useState({ name: '', email: '', phone: '', businessName: '', location: '', experience: '' })
  const [showSavingsCalculator, setShowSavingsCalculator] = useState(false)
  const { showModal, closeModal } = useScrollTimer(60000)

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

  const removedFaqs: string[] = [
    'How long do solar panels last?',
    'Do you provide installation services?',
    'What are the benefits of joining as a dealer?',
    'Are the products covered under warranty?',
  ]

  return (
    <main>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section id="hero" className="relative pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50" />
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight drop-shadow-lg">
                Power Your Future with <span className="text-primary">Clean Solar Energy</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                Save up to 80% on electricity bills. Get 25-year warranty. Easy EMI options available. Join 1000+ satisfied customers across India.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <button
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center gap-2 bg-primary text-white text-base sm:text-lg px-8 py-4 rounded-full font-bold shadow-xl hover:bg-dark transition-colors"
                >
                  Book Free Consultation
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowSavingsCalculator(true)}
                  className="inline-flex items-center gap-2 border-2 border-gray-300 text-gray-700 hover:border-primary hover:text-primary text-base sm:text-lg px-8 py-4 rounded-full font-bold transition-colors"
                >
                  <Calculator className="w-5 h-5" />
                  Calculate Savings
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-8">
                {[
                  { value: '1000+', label: 'Happy Customers' },
                  { value: '25 Years', label: 'Warranty' },
                  { value: '80%', label: 'Bill Savings' },
                ].map((s, i) => (
                  <GlassCard key={i} className="p-4 text-center">
                    <div className="text-2xl sm:text-4xl font-extrabold text-primary drop-shadow-lg">{s.value}</div>
                    <div className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">{s.label}</div>
                  </GlassCard>
                ))}
              </div>
            </div>

            {/* Right: image — unchanged */}
            <div className="relative">
              <GlassCard className="p-2 overflow-hidden">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">

<img src="/images/hero/Product_range.png" alt="Microtek Product Range" className="w-full h-[500px] object-contain bg-white" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ─────────────────────────────────────────────────────────── */}
      <section id="about" className="py-20 px-3 sm:px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <span className="inline-block text-xs font-semibold text-primary uppercase tracking-widest px-3 py-1 bg-primary/10 rounded-full mb-4">Who We Are</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight drop-shadow-lg">
              About Satyajan Energy Solutions
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">{companyInfo.description}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: 'ph:target-fill', bg: 'bg-primary', ring: 'border-primary', title: 'Our Mission', desc: 'To provide reliable, sustainable energy solutions that empower homes and businesses across India.' },
              { icon: 'ph:eye-fill', bg: 'bg-gradient-to-br from-emerald-400 to-green-500', ring: 'border-emerald-400', title: 'Our Vision', desc: "To be India's most trusted partner for clean energy and power backup solutions." },
              { icon: 'ph:heart-fill', bg: 'bg-gradient-to-br from-orange-400 to-amber-500', ring: 'border-orange-400', title: 'Our Values', desc: 'Quality, reliability, customer satisfaction, and commitment to sustainable future.' },
            ].map((card, i) => (
              <GlassCard key={i} className="p-6 sm:p-8 flex flex-col items-center text-center">
                <PlayfulIcon icon={card.icon} ringColor={card.ring} bgColor={card.bg} />
                <h3 className="text-lg font-extrabold text-gray-900 mb-2 tracking-tight">{card.title}</h3>
                <p className="text-sm text-gray-600 font-medium leading-relaxed">{card.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ──────────────────────────────────────────────────────── */}
      <section id="products" className="py-20 px-3 sm:px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-semibold text-primary uppercase tracking-widest px-3 py-1 bg-primary/10 rounded-full mb-4">Products</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight drop-shadow-lg">
              Our Products & Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
              Comprehensive range of power solutions backed by Microtek's quality and our expert support
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {products.filter((p: any) => p.name !== 'Combos').map((product: any) => (
              <GlassCard key={product.id} className="overflow-hidden p-0 flex flex-col">
                <div className="relative h-48 overflow-hidden rounded-t-3xl">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-extrabold text-white tracking-tight drop-shadow-lg">{product.name}</h3>
                  </div>
                </div>
                <div className="p-5 sm:p-6 flex flex-col flex-1">
                  <p className="text-sm text-gray-600 mb-4 font-medium leading-relaxed">{product.description}</p>
                  <ul className="space-y-2 mb-6 flex-1">
                    {product.features.map((f: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="font-medium">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/products" className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-dark text-white py-3 rounded-full font-bold text-sm transition-colors shadow-md">
                    Visit Products <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS ──────────────────────────────────────────────────────── */}
      <section id="benefits" className="py-20 px-3 sm:px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-semibold text-primary uppercase tracking-widest px-3 py-1 bg-primary/10 rounded-full mb-4">Why Us</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight drop-shadow-lg">
              Why Choose Satyajan Energy Solutions?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
              Your trusted partner for reliable power solutions with unmatched service quality
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {benefits.map((b: any, i: number) => {
              const LIcon = (LucideIcons as any)[b.icon]
              const style = cardStyles[i % cardStyles.length]
              return (
                <GlassCard key={i} className="p-6 sm:p-8 flex flex-col items-center text-center">
                  <div className={`relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 ${style.bg} rounded-full shadow-lg mb-4`}>
                    <span className={`absolute inset-0 rounded-full animate-spin-slow border-4 ${style.ring} opacity-30`} />
                    {LIcon && <LIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white z-10 relative" />}
                  </div>
                  <h4 className="text-lg font-extrabold text-gray-900 mb-2 tracking-tight">{b.title}</h4>
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">{b.description}</p>
                </GlassCard>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section id="testimonials" className="py-20 px-3 sm:px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-semibold text-primary uppercase tracking-widest px-3 py-1 bg-primary/10 rounded-full mb-4">Reviews</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight drop-shadow-lg">
              What Our Clients Say
            </h2>
            <p className="text-lg text-gray-600 font-medium">Real experiences from satisfied customers across India</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {testimonials.map((t: any) => (
              <GlassCard key={t.id} className="p-6 sm:p-7 flex flex-col">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_: any, i: number) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 mb-6 italic font-medium leading-relaxed flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon icon="ph:user-fill" className="text-white" width={18} />
                  </div>
                  <div className="font-extrabold text-gray-900 text-sm tracking-tight">{t.name}</div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEALERS ───────────────────────────────────────────────────────── */}
      <section id="dealers" className="py-20 px-3 sm:px-4">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block text-xs font-semibold text-primary uppercase tracking-widest px-3 py-1 bg-primary/10 rounded-full mb-4">Partners</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight drop-shadow-lg">
                Join Our Dealer Network
              </h2>
              <p className="text-lg text-gray-600 font-medium">Become a part of India's fastest-growing energy solutions network</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
              {/* Left: dealer benefits */}
              <div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-6 tracking-tight">Dealer Benefits</h3>
                <ul className="space-y-4">
                  {dealerBenefits.map((db: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm text-gray-700 font-medium leading-relaxed">{db}</span>
                    </li>
                  ))}
                </ul>

                <GlassCard className="mt-8 p-6 bg-white/60">
                  <h4 className="font-extrabold text-gray-900 mb-2 tracking-tight">Download Dealer Brochure</h4>
                  <p className="text-sm text-gray-600 mb-4 font-medium leading-relaxed">
                    Get detailed information about our dealer program, products, and benefits.
                  </p>
                  <a
                    href="/images/hero/brochure.pdf"
                    download="brochure.pdf"
                    className="inline-flex items-center gap-2 border-2 border-primary text-primary px-5 py-2.5 rounded-full font-bold hover:bg-primary hover:text-white transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" /> Download Brochure
                  </a>
                </GlassCard>
              </div>

              {/* Right: registration form */}
              <GlassCard className="p-6 sm:p-8">
                <h4 className="text-xl font-extrabold text-gray-900 mb-1 tracking-tight">Dealer Registration Form</h4>
                <p className="text-sm text-gray-600 mb-5 font-medium leading-relaxed">
                  Fill out the form below and our team will contact you within 24 hours
                </p>
                <form onSubmit={handleDealerSubmit} className="space-y-4">
                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <input required value={dealerForm.name} onChange={(e) => setDealerForm({ ...dealerForm, name: e.target.value })} className={inputClass} placeholder="Your full name" />
                  </div>
                  <div>
                    <label className={labelClass}>Email *</label>
                    <input required type="email" value={dealerForm.email} onChange={(e) => setDealerForm({ ...dealerForm, email: e.target.value })} className={inputClass} placeholder="your.email@example.com" />
                  </div>
                  <div>
                    <label className={labelClass}>Phone *</label>
                    <input required value={dealerForm.phone} onChange={(e) => setDealerForm({ ...dealerForm, phone: e.target.value })} className={inputClass} placeholder="+91 98765 43210" />
                  </div>
                  <div>
                    <label className={labelClass}>Business Name *</label>
                    <input required value={dealerForm.businessName} onChange={(e) => setDealerForm({ ...dealerForm, businessName: e.target.value })} className={inputClass} placeholder="Your business name" />
                  </div>
                  <div>
                    <label className={labelClass}>Location/City *</label>
                    <input required value={dealerForm.location} onChange={(e) => setDealerForm({ ...dealerForm, location: e.target.value })} className={inputClass} placeholder="City, State" />
                  </div>
                  <div>
                    <label className={labelClass}>Business Experience</label>
                    <textarea value={dealerForm.experience} onChange={(e) => setDealerForm({ ...dealerForm, experience: e.target.value })} className={inputClass} rows={3} placeholder="Tell us about your business experience" />
                  </div>
                  <button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-dark text-white py-3 rounded-full font-bold text-sm transition-colors shadow-md">
                    Submit Application <Send className="w-4 h-4" />
                  </button>
                </form>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-20 px-3 sm:px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-semibold text-primary uppercase tracking-widest px-3 py-1 bg-primary/10 rounded-full mb-4">FAQs</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight drop-shadow-lg">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 font-medium">Everything you need to know about our products and services</p>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left: FAQ list */}
            <div className="space-y-4">
              {faqs.filter((f: any) => !removedFaqs.includes(f.question)).map((f: any, i: number) => (
                <GlassCard key={i} className="overflow-hidden hover:scale-100">
                  <details className="group">
                    <summary className="flex items-center justify-between gap-3 p-4 sm:p-5 cursor-pointer list-none font-extrabold text-gray-900 text-sm tracking-tight">
                      <span>{f.question}</span>
                      <Icon icon="ph:caret-down-bold" className="text-primary flex-shrink-0 group-open:rotate-180 transition-transform" width={16} />
                    </summary>
                    <div className="px-5 pb-5 text-sm text-gray-600 font-medium leading-relaxed">{f.answer}</div>
                  </details>
                </GlassCard>
              ))}
            </div>

            {/* Right: Image — unchanged */}
            <div className="w-full flex items-center justify-center">
              <GlassCard className="w-full overflow-hidden p-0 hover:scale-[1.01]">
                <img src="/images/faqs/homeimagefaq.jpeg" alt="FAQ" className="w-full h-full object-cover rounded-3xl" />
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ───────────────────────────────────────────────────────── */}
      <section id="contact" className="py-20 px-3 sm:px-4">

        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block text-xs font-semibold text-primary uppercase tracking-widest px-3 py-1 bg-primary/10 rounded-full mb-4">Contact</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight drop-shadow-lg">
                Get In Touch
              </h2>
              <p className="text-lg text-gray-600 font-medium">Have questions? We're here to help. Contact us for a free consultation.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
              {/* Left: Contact info */}
              <div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-6 tracking-tight">Contact Information</h3>
                <div className="space-y-4">
                  {[
                    { icon: 'ph:phone-call-fill', bg: 'bg-primary', ring: 'border-primary', label: 'Phone', value: companyInfo.contact.phone, href: `tel:${companyInfo.contact.phone}` },
                    { icon: 'ph:envelope-fill', bg: 'bg-gradient-to-br from-emerald-400 to-green-500', ring: 'border-emerald-400', label: 'Email', value: companyInfo.contact.email, href: `mailto:${companyInfo.contact.email}` },
                    { icon: 'ph:map-pin-fill', bg: 'bg-gradient-to-br from-orange-400 to-amber-500', ring: 'border-orange-400', label: 'Address', value: companyInfo.contact.address, href: null },
                  ].map((info, i) => (
                    <GlassCard key={i} className="p-4 flex items-center gap-4 hover:scale-[1.02]">
                      <PlayfulIcon icon={info.icon} ringColor={info.ring} bgColor={info.bg} />
                      <div>
                        <div className="text-xs text-gray-400 font-medium">{info.label}</div>
                        {info.href
                          ? <a href={info.href} className="text-sm font-extrabold text-gray-900 hover:text-primary transition-colors">{info.value}</a>
                          : <p className="text-sm font-bold text-gray-900 leading-relaxed">{info.value}</p>
                        }
                      </div>
                    </GlassCard>
                  ))}
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => window.open('https://wa.me/918019179159', '_blank')}
                    className="w-full inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-base px-6 py-3 rounded-full font-bold transition-colors shadow-md"
                  >
                    <MessageCircle className="w-5 h-5" /> WhatsApp Now
                  </button>
                </div>

                {/* Map — unchanged */}
                <GlassCard className="mt-6 h-64 overflow-hidden p-0 rounded-3xl cursor-pointer relative group hover:scale-[1.01]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.9988888888886!2d78.4867!3d17.3850!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99c0c3e1ffe7:0xa6b7d4b850493ba0!2sSatyajan%20Energy%20Solutions%20Pvt.Ltd.!5e0!3m2!1sen!2sin!4v1234567890123"
                    width="100%" height="100%" style={{ border: 0 }} allowFullScreen={true} loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade" title="Satyajan Energy Solutions Location"
                    className="pointer-events-none"
                  />
                  <a
                    href="https://www.google.com/maps/place/Satyajan+Energy+Solutions+Pvt.Ltd./@17.3326358,78.5367308,15.91z/data=!4m14!1m7!3m6!1s0x3bcb99c0c3e1ffe7:0xa6b7d4b850493ba0!2sSatyajan+Energy+Solutions+Pvt.Ltd.!8m2!3d17.3342621!4d78.5387496!16s%2Fg%2F11rrnq6_d_!3m5!1s0x3bcb99c0c3e1ffe7:0xa6b7d4b850493ba0!8m2!3d17.3342621!4d78.5387496!16s%2Fg%2F11rrnq6_d_?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA2N0gBUAM%3D"
                    target="_blank" rel="noopener noreferrer"
                    className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity duration-300 rounded-3xl"
                  >
                    <span className="text-white font-bold text-sm">Click to open in Google Maps</span>
                  </a>
                </GlassCard>
              </div>

              {/* Right: Contact form */}
              <GlassCard className="p-6 sm:p-8">
                <h4 className="text-xl font-extrabold text-gray-900 mb-1 tracking-tight">Send Us a Message</h4>
                <p className="text-sm text-gray-600 mb-5 font-medium leading-relaxed">
                  Fill out the form and we'll get back to you within 24 hours
                </p>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className={labelClass}>Name *</label>
                    <input required value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} className={inputClass} placeholder="Your full name" />
                  </div>
                  <div>
                    <label className={labelClass}>Email *</label>
                    <input required type="email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} className={inputClass} placeholder="your.email@example.com" />
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} className={inputClass} placeholder="+91 98765 43210" />
                  </div>
                  <div>
                    <label className={labelClass}>Message *</label>
                    <textarea required value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} className={inputClass} rows={5} placeholder="Tell us about your requirements" />
                  </div>
                  <button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-dark text-white py-3 rounded-full font-bold text-sm transition-colors shadow-md">
                    Send Message <Send className="w-4 h-4" />
                  </button>
                </form>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      <CallMeBackModal isOpen={showModal} onClose={closeModal} />
      <SolarSavingsCalculator isOpen={showSavingsCalculator} onClose={() => setShowSavingsCalculator(false)} />
    </main>
  )
}