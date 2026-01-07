'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  MapPin,
  Clock,
  Briefcase,
  TrendingUp,
  Heart,
  DollarSign,
  BookOpen,
  Sun,
  Shield,
  Trophy,
  GraduationCap,
  Car,
  Users,
  Lightbulb,
  Zap,
  Target,
  MessageCircle,
} from 'lucide-react';

const whyWorkWithUs = [
  { icon: TrendingUp, title: 'Growth-Driven Environment', description: "Be part of India's fastest-growing renewable energy sector with unlimited career advancement opportunities." },
  { icon: Heart, title: 'Respect & Transparency', description: 'We value every team member and maintain open, honest communication at all levels.' },
  { icon: DollarSign, title: 'Performance-Based Incentives', description: 'Your hard work is rewarded with attractive incentives, bonuses, and recognition.' },
  { icon: BookOpen, title: 'Learn New Skills', description: 'Comprehensive training in sales, marketing, technical skills, and the latest solar technology.' },
  { icon: Sun, title: 'High-Growth Industry', description: 'Work in the booming solar and power backup industry with strong future prospects.' },
  { icon: Shield, title: 'Long-Term Career Stability', description: 'Join a stable, growing company offering long-term career security and advancement.' },
];

const perksAndBenefits = [
  { icon: DollarSign, title: 'Competitive Salary', description: 'Market-leading salary packages with monthly incentives' },
  { icon: Trophy, title: 'Performance Bonuses', description: 'Quarterly and annual bonuses based on achievements' },
  { icon: Car, title: 'Travel Allowance', description: 'Fuel reimbursement and travel allowances for field staff' },
  { icon: GraduationCap, title: 'Training Programs', description: 'Regular product and skill development training with certifications' },
  { icon: Zap, title: 'Fast Promotions', description: 'Quick career progression based on performance and merit' },
  { icon: Lightbulb, title: 'Positive Work Culture', description: 'Healthy, supportive, and collaborative work environment' },
  { icon: Trophy, title: 'Festival Bonuses', description: 'Special rewards and bonuses during festivals' },
  { icon: Target, title: 'Flexible Culture', description: 'Work-life balance with flexible working arrangements' },
  { icon: Users, title: 'Employee Recognition', description: 'Monthly awards for top performers and achievement certificates' },
];

const jobOpenings = [
  {
    id: 'sales-executive',
    type: 'Full-time',
    department: 'Sales',
    title: 'Sales Executive (Power Backup & Solar)',
    shortDescription: "Join our dynamic sales team to promote cutting-edge solar and power backup solutions across Hyderabad.",
    location: 'Hyderabad',
    experience: '0-3 years',
    postedDate: '2025-01-15',
    skills: ['Communication', 'Field Sales', 'Product Knowledge', 'Customer Relations'],
  },
  {
    id: 'accounts-executive',
    type: 'Full-time',
    department: 'Accounts',
    title: 'Accounts Executive',
    shortDescription: 'Manage day-to-day accounting operations, billing, GST compliance, and financial reporting for our growing business.',
    location: 'Hyderabad',
    experience: '1-3 years',
    postedDate: '2025-01-12',
    skills: ['Accounting', 'Tally', 'GST', 'Billing'],
  },
];

export default function CareersPage() {
  const router = useRouter();

  const scrollToJobs = () => {
    const el = document.getElementById('open-positions');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative">
        <div className="h-72 md:h-96 bg-[url('https://images.unsplash.com/photo-1542336391-ae2936d8efe4?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center">
          <div className="absolute inset-0 bg-blue-900/85 flex items-center">
            <div className="container mx-auto px-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">Build Your Career with Satyajan Energy Solutions</h1>
              <p className="text-lg text-blue-100 mt-4 max-w-2xl">Join one of the fastest-growing companies in Power Backup & Solar Energy. Be part of India's renewable energy revolution.</p>
              <div className="mt-6 flex gap-4">
                <button onClick={scrollToJobs} className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100">View Open Positions <ArrowRight className="inline-block ml-2 w-4 h-4"/></button>
                <button onClick={() => window.open('https://wa.me/918019179159?text=Hi, I want to know about career opportunities', '_blank')} className="border border-white text-white px-6 py-3 rounded-md inline-flex items-center gap-2 hover:bg-white/10"> <MessageCircle className="w-4 h-4"/> WhatsApp HR</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Work With Us?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Join a team that values growth, innovation, and your success</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyWorkWithUs.map((w, i) => {
              const Icon = w.icon;
              return (
                <div key={i} className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-all">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{w.title}</h3>
                  <p className="text-gray-600">{w.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Perks & Benefits */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Perks & Benefits</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">We take care of our team with competitive compensation and excellent benefits</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {perksAndBenefits.map((p, i) => {
              const Icon = p.icon;
              return (
                <div key={i} className="border rounded-lg p-6 bg-white shadow-sm flex items-start gap-4 hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{p.title}</h4>
                    <p className="text-sm text-gray-600">{p.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="open-positions" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Open Positions</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Find your perfect role and start your journey with us</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {jobOpenings.map((job) => (
              <div key={job.id} className="border rounded-lg p-6 bg-white shadow-sm flex flex-col md:flex-row md:items-start md:justify-between gap-4 hover:shadow-lg transition-all">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">{job.type}</span>
                    <span className="inline-block border border-green-600 text-green-600 px-3 py-1 rounded-full text-xs">{job.department}</span>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h3>
                  <p className="text-gray-600 mb-4">{job.shortDescription}</p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> <span>{job.location}</span></div>
                    <div className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> <span>{job.experience}</span></div>
                    <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> <span>Posted {new Date(job.postedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span></div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.skills.map((s, idx) => <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">{s}</span>)}
                  </div>
                </div>

                <div className="flex items-center">
                  <button onClick={() => router.push(`/career/${job.id}`)} className="bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap">View Details <ArrowRight className="inline-block ml-2 w-4 h-4"/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Life at Satyajan */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Life at Satyajan Energy Solutions</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">A glimpse into our vibrant work culture and team spirit</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {['https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80&auto=format&fit=crop', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80&auto=format&fit=crop', 'https://images.unsplash.com/photo-1508501552155-5c3f0f5d4c20?w=800&q=80&auto=format&fit=crop'].map((url, i) => (
              <div key={i} className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all">
                <img src={url} alt={`life-${i}`} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white text-sm font-medium">Our Team</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Work Culture & Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">The principles that guide us every day</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Shield, title: 'Integrity', description: 'We maintain the highest ethical standards in all our business dealings and relationships.' },
              { icon: Users, title: 'Customer-First Approach', description: "Our customers' success is our success. We go the extra mile to ensure satisfaction." },
              { icon: Lightbulb, title: 'Innovation', description: 'We continuously seek better ways to serve our customers and improve our solutions.' },
              { icon: Zap, title: 'Speed', description: 'We move fast, make quick decisions, and deliver results without compromising quality.' },
              { icon: Users, title: 'Teamwork', description: 'We believe in the power of collaboration and support each other to achieve common goals.' },
              { icon: Target, title: 'Accountability', description: 'We take ownership of our work and are responsible for delivering on our commitments.' },
            ].map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{v.title}</h3>
                  <p className="text-gray-600">{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Join Our Team?</h2>
            <p className="text-xl text-blue-100 mb-8">Explore our open positions or send us your resume for future opportunities.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={scrollToJobs} className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100">Browse Open Roles</button>
              <button onClick={() => router.push('/career/apply')} className="border border-white text-white px-6 py-3 rounded-md hover:bg-white/10">Apply Now</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}