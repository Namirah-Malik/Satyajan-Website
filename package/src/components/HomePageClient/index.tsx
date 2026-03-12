"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { ArrowRight, CheckCircle, Star, Phone, Mail, MapPin, Send, MessageCircle, Calculator } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { companyInfo, products, benefits, testimonials, faqs } from '@/mock/data'
import CallMeBackModal from '@/components/CallMeBackModal'
import SolarSavingsCalculator from '@/components/SolarSavingsCalculator'
import { useScrollModal } from '@/hooks/useScrollModal'

// ── Shared UI primitives (mirrors Technology page) ──────────────────────────

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
      fill="url(#wavyGrad)"
      opacity="0.12"
    />
    <defs>
      <linearGradient id="wavyGrad" x1="0" y1="0" x2="1440" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFD600" />
        <stop offset="1" stopColor="#34D399" />
      </linearGradient>
    </defs>
  </svg>
)

const GlassCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/40 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${className}`}>
    {children}
  </div>
)

const PlayfulIcon = ({ icon, ringColor, bgColor }: { icon: string; ringColor: string; bgColor: string }) => (
  <div className={`relative flex items-center justify-center w-16 h-16 ${bgColor} rounded-full shadow-lg mb-3 flex-shrink-0`}>
    <span className={`absolute inset-0 rounded-full animate-spin-slow border-4 ${ringColor} opacity-30`} />
    <Icon icon={icon} className="text-3xl text-white z-10" />
  </div>
)

// ────────────────────────────────────────────────────────────────────────────

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
    <main className="min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section id="hero" className="relative pt-24 pb-0 overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-yellow-50">
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Text */}
            <div className="space-y-6">
             
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight drop-shadow-sm">
                Power Your Future with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
                  Clean Solar Energy
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium">
                Save up to 80% on electricity bills. 25-year warranty. Easy EMI options.
                Join 1000+ satisfied customers across India.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <button
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 text-white text-lg px-8 py-4 rounded-2xl flex items-center gap-3 shadow-xl hover:shadow-2xl hover:scale-105 transition-all font-semibold"
                >
                  Book Free Consultation <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowSavingsCalculator(true)}
                  className="bg-white/60 backdrop-blur border border-gray-200 text-gray-700 hover:bg-white text-lg px-8 py-4 rounded-2xl flex items-center gap-3 shadow-md hover:shadow-xl transition-all font-semibold"
                >
                  <Calculator className="w-5 h-5" /> Calculate Savings
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                {[
                  { value: '1000+', label: 'Happy Customers' },
                  { value: '25 Yrs', label: 'Warranty' },
                  { value: '80%', label: 'Bill Savings' },
                ].map((s) => (
                  <GlassCard key={s.label} className="p-4 text-center">
                    <div className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
                      {s.value}
                    </div>
                    <div className="text-xs text-gray-600 mt-1 font-medium">{s.label}</div>
                  </GlassCard>
                ))}
              </div>
            </div>

            {/* Hero image */}
            <div className="relative">
              <GlassCard className="overflow-hidden p-2">
                <img
                  src="/images/hero/Product_range.png"
                  alt="Microtek Product Range"
                  className="w-full h-[460px] object-contain bg-white rounded-2xl"
                />
              </GlassCard>
              {/* Floating badge */}
              
            </div>
          </div>
        </div>
        <WavyDivider />
      </section>

      {/* ── ABOUT ────────────────────────────────────────────────────── */}
      <section id="about" className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 drop-shadow-lg tracking-tight">
            About Satyajan Energy Solutions
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto font-medium">
            {companyInfo.description}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: 'ph:target-fill',
              bg: 'bg-gradient-to-br from-blue-400 to-indigo-400',
              ring: 'border-blue-400',
              title: 'Our Mission',
              text: 'To provide reliable, sustainable energy solutions that empower homes and businesses across India.',
            },
            {
              icon: 'ph:eye-fill',
              bg: 'bg-gradient-to-br from-emerald-400 to-teal-400',
              ring: 'border-emerald-400',
              title: 'Our Vision',
              text: "To be India's most trusted partner for clean energy and power backup solutions.",
            },
            {
              icon: 'ph:heart-fill',
              bg: 'bg-gradient-to-br from-orange-400 to-yellow-400',
              ring: 'border-orange-400',
              title: 'Our Values',
              text: 'Quality, reliability, customer satisfaction, and commitment to a sustainable future.',
            },
          ].map((card) => (
            <GlassCard key={card.title} className="flex flex-col items-center text-center p-8">
              <PlayfulIcon icon={card.icon} bgColor={card.bg} ringColor={card.ring} />
              <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-gray-600 font-medium">{card.text}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* ── PRODUCTS ─────────────────────────────────────────────────── */}
      <section id="products" className="py-20 px-4 bg-gradient-to-b from-emerald-50/60 to-white">
        <WavyDivider flip />
        <div className="max-w-7xl mx-auto">
          <div className="text-start mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 drop-shadow-lg tracking-tight">
              Our Products &amp; Services
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl font-medium">
              Comprehensive range of power solutions backed by Microtek's quality and our expert local support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.filter((p: any) => p.name !== 'Combos').map((product: any) => (
              <GlassCard key={product.id} className="overflow-hidden flex flex-col">
                <div className="relative h-48 overflow-hidden rounded-t-3xl bg-white">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4 font-medium text-sm flex-1">{product.description}</p>
                  <ul className="space-y-1.5 mb-6">
                    {product.features.slice(0, 3).map((f: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/products"
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-semibold hover:shadow-lg transition-all"
                  >
                    View Products <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
        <WavyDivider />
      </section>

      {/* ── BENEFITS ─────────────────────────────────────────────────── */}
      <section id="benefits" className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 drop-shadow-lg tracking-tight">
            Why Choose Satyajan Energy?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
            Your trusted partner for reliable power solutions with unmatched service quality.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((b: any, i: number) => {
            const LIcon = (LucideIcons as any)[b.icon]
            const gradients = [
              'bg-gradient-to-br from-emerald-400 to-teal-400',
              'bg-gradient-to-br from-blue-400 to-indigo-400',
              'bg-gradient-to-br from-orange-400 to-yellow-400',
              'bg-gradient-to-br from-purple-400 to-blue-400',
              'bg-gradient-to-br from-rose-400 to-orange-400',
              'bg-gradient-to-br from-teal-400 to-emerald-400',
            ]
            const rings = ['border-emerald-400', 'border-blue-400', 'border-orange-400', 'border-purple-400', 'border-rose-400', 'border-teal-400']
            return (
              <GlassCard key={i} className="p-6 flex flex-col items-center text-center">
                <div className={`relative flex items-center justify-center w-16 h-16 ${gradients[i % gradients.length]} rounded-full shadow-lg mb-3 flex-shrink-0`}>
                  <span className={`absolute inset-0 rounded-full animate-spin-slow border-4 ${rings[i % rings.length]} opacity-30`} />
                  {LIcon && <LIcon className="w-7 h-7 text-white z-10 relative" />}
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{b.title}</h4>
                <p className="text-gray-600 font-medium text-sm">{b.description}</p>
              </GlassCard>
            )
          })}
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section id="testimonials" className="py-20 px-4 bg-gradient-to-b from-yellow-50/60 to-white">
        <WavyDivider flip />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 drop-shadow-lg tracking-tight">
              What Our Clients Say
            </h2>
            <p className="text-lg text-gray-600 font-medium">
              Real experiences from satisfied customers across India.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t: any) => (
              <GlassCard key={t.id} className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_: any, i: number) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic font-medium">&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center text-white font-bold">
                    {t.name[0]}
                  </div>
                  <div className="font-semibold text-gray-900">{t.name}</div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
        <WavyDivider />
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section id="faq" className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-start mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 drop-shadow-lg tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl font-medium">
            Everything you need to know about our products and services.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            {faqs.filter((f: any) => !removedFaqs.includes(f.question)).map((f: any, i: number) => (
              <GlassCard key={i} className="px-6 py-4 hover:scale-[1.01]">
                <details>
                  <summary className="font-semibold cursor-pointer text-gray-900">{f.question}</summary>
                  <div className="mt-3 text-gray-600 font-medium text-sm leading-relaxed">{f.answer}</div>
                </details>
              </GlassCard>
            ))}
          </div>
          <div className="w-full rounded-3xl overflow-hidden shadow-xl border border-white/30">
            <img src="/images/faqs/homeimagefaq.jpeg" alt="FAQ" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────────── */}
      <section id="contact" className="py-20 px-4 bg-gradient-to-b from-emerald-50/60 to-white">
        <WavyDivider flip />
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 drop-shadow-lg tracking-tight">
              Get In Touch
            </h2>
            <p className="text-lg text-gray-600 font-medium">
              Have questions? We&apos;re here to help. Contact us for a free consultation.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact info */}
            <div className="space-y-6">
              {[
                { icon: 'ph:phone-fill', bg: 'bg-gradient-to-br from-blue-400 to-indigo-400', ring: 'border-blue-400', label: 'Phone', value: companyInfo.contact.phone, href: `tel:${companyInfo.contact.phone}` },
                { icon: 'ph:envelope-fill', bg: 'bg-gradient-to-br from-emerald-400 to-teal-400', ring: 'border-emerald-400', label: 'Email', value: companyInfo.contact.email, href: `mailto:${companyInfo.contact.email}` },
                { icon: 'ph:map-pin-fill', bg: 'bg-gradient-to-br from-orange-400 to-yellow-400', ring: 'border-orange-400', label: 'Address', value: companyInfo.contact.address, href: undefined },
              ].map((c) => (
                <GlassCard key={c.label} className="flex items-start gap-4 p-5">
                  <PlayfulIcon icon={c.icon} bgColor={c.bg} ringColor={c.ring} />
                  <div>
                    <div className="font-bold text-gray-900 mb-0.5">{c.label}</div>
                    {c.href ? (
                      <a href={c.href} className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">{c.value}</a>
                    ) : (
                      <p className="text-gray-600 font-medium">{c.value}</p>
                    )}
                  </div>
                </GlassCard>
              ))}

              <button
                onClick={() => window.open('https://wa.me/918019179159', '_blank')}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-lg px-6 py-4 rounded-2xl flex items-center justify-center gap-2 font-semibold shadow-xl hover:shadow-2xl transition-all"
              >
                <MessageCircle className="w-5 h-5" /> WhatsApp Now
              </button>

              {/* Map */}
              <div className="h-56 rounded-3xl overflow-hidden shadow-xl relative group border border-white/30">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.9988888888886!2d78.4867!3d17.3850!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99c0c3e1ffe7:0xa6b7d4b850493ba0!2sSatyajan%20Energy%20Solutions%20Pvt.Ltd.!5e0!3m2!1sen!2sin!4v1234567890123"
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade" title="Satyajan Location"
                  className="pointer-events-none"
                />
                <a
                  href="https://www.google.com/maps/place/Satyajan+Energy+Solutions+Pvt.Ltd./@17.3326358,78.5367308,15.91z"
                  target="_blank" rel="noopener noreferrer"
                  className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity duration-300 rounded-3xl"
                >
                  <span className="text-white font-semibold">Open in Google Maps</span>
                </a>
              </div>
            </div>

            {/* Contact form */}
            <GlassCard className="p-8">
              <h4 className="text-2xl font-bold text-emerald-800 mb-1 tracking-tight">Send Us a Message</h4>
              <p className="text-sm text-gray-600 mb-6 font-medium">We&apos;ll get back to you within 24 hours.</p>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                {[
                  { label: 'Name *', type: 'text', key: 'name', placeholder: 'Your full name', required: true },
                  { label: 'Email *', type: 'email', key: 'email', placeholder: 'your.email@example.com', required: true },
                  { label: 'Phone', type: 'text', key: 'phone', placeholder: '+91 98765 43210', required: false },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{field.label}</label>
                    <input
                      required={field.required}
                      type={field.type}
                      value={(contactForm as any)[field.key]}
                      onChange={(e) => setContactForm({ ...contactForm, [field.key]: e.target.value })}
                      className="w-full bg-white/60 border border-white/40 rounded-xl p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Message *</label>
                  <textarea
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full bg-white/60 border border-white/40 rounded-xl p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                    rows={5}
                    placeholder="Tell us about your requirements"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:scale-[1.02] transition-all"
                >
                  Send Message <Send className="w-4 h-4" />
                </button>
              </form>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <GlassCard className="p-10 bg-white/60">
            <h2 className="text-3xl font-bold text-emerald-700 mb-4 drop-shadow-lg tracking-tight">
              Ready to Switch to Clean Energy?
            </h2>
            <p className="text-gray-700 mb-8 text-lg font-medium">
              Join over 1000+ happy customers who have already made the switch with Satyajan Energy Solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="bg-gradient-to-r from-emerald-500 to-teal-400 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl transition-all"
              >
                Explore Products
              </Link>
              <Link
                href="/contactus"
                className="border-2 border-emerald-500 text-emerald-600 px-8 py-3 rounded-xl font-semibold hover:bg-emerald-500 hover:text-white transition-all"
              >
                Contact Us Today
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>

      <CallMeBackModal isOpen={showModal} onClose={closeModal} />
      <SolarSavingsCalculator isOpen={showSavingsCalculator} onClose={() => setShowSavingsCalculator(false)} />
    </main>
  )
}

// Add to global CSS if not already present:
// .animate-spin-slow { animation: spin 6s linear infinite; }