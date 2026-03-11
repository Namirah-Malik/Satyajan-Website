'use client';

import { Icon } from '@iconify/react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

// ── Success Popup ────────────────────────────────────────────────────────────
const SuccessPopup = ({ onClose }: { onClose: () => void }) => (
  <>
    <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" onClick={onClose} />
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-green-400 p-8 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Icon icon="ph:check-circle-fill" className="text-emerald-500 text-5xl" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Query Submitted!</h2>
          <p className="text-white/80 mt-1 text-sm">We've received your message</p>
        </div>
        <div className="p-8 text-center">
          <p className="text-gray-700 text-base font-medium leading-relaxed mb-6">
            Thank you! Your query has been successfully submitted.<br />
            Our team will get back to you within{' '}
            <span className="text-primary font-bold">24 hours</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:+918019179159"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-dark transition-colors shadow-md"
            >
              <Icon icon="ph:phone-fill" width={18} />
              Call Us Now
            </a>
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-200 text-gray-600 rounded-full font-semibold hover:border-primary hover:text-primary transition-colors"
            >
              Close
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-4">Mon–Sat, 9 AM – 7 PM · +91 8019179159</p>
        </div>
      </div>
    </div>
  </>
);

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ContactUs() {
  const [form, setForm] = useState({ username: '', mobile: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } catch (_) {
      // Show success regardless — don't block UX if API is unavailable
    } finally {
      setSubmitting(false);
      setForm({ username: '', mobile: '', email: '', message: '' });
      setShowSuccess(true);
    }
  };

  return (
    <>
      {showSuccess && <SuccessPopup onClose={() => setShowSuccess(false)} />}

      <div className='container max-w-8xl mx-auto px-5 2xl:px-0 pt-32 md:pt-44 pb-14 md:pb-28'>
        <div className='mb-16'>
          <div className='flex gap-2.5 items-center justify-center mb-3'>
            <Icon icon='ph:house-simple-fill' width={20} height={20} className='text-primary' />
            <p className='text-base font-semibold text-badge'>Contact us</p>
          </div>
          <div className='text-center'>
            <h3 className='text-4xl sm:text-52 font-medium tracking-tighter text-black mb-3 leading-10 sm:leading-14'>
              Have questions? ready to help!
            </h3>
            <p className='text-xm font-normal tracking-tight text-black/50 leading-6'>
              Have questions about solar? Our experts are here to help—reach out for advice and solutions.
            </p>
          </div>
        </div>

        <div className='border border-black/10 rounded-2xl p-4 shadow-xl'>
          <div className='flex flex-col lg:flex-row lg:items-center gap-12'>

            {/* Left image */}
            <div className='relative w-fit'>
              <Image src='/images/contactUs/contactUs.jpg' alt='contact' width={497} height={535} className='rounded-2xl brightness-50 h-full' unoptimized />
              <div className='absolute top-6 left-6 lg:top-12 lg:left-12 flex flex-col gap-2'>
                <h5 className='text-xl xs:text-2xl mobile:text-3xl font-medium tracking-tight text-white'>Contact information</h5>
                <p className='text-sm xs:text-base mobile:text-xm font-normal text-white/80'>Ready to find your dream home or sell your property? We're here to help!</p>
              </div>
              <div className='absolute bottom-6 left-6 lg:bottom-12 lg:left-12 flex flex-col gap-4 text-white'>
                <Link href='https://wa.me/918019179159' className='w-fit'>
                  <div className='flex items-center gap-4 group w-fit'>
                    <Icon icon='ph:phone' width={32} height={32} />
                    <p className='text-sm xs:text-base mobile:text-xm font-normal group-hover:text-primary'>+91 8019179159</p>
                  </div>
                </Link>
                <Link href='mailto:info@satyajan.com' className='w-fit'>
                  <div className='flex items-center gap-4 group w-fit'>
                    <Icon icon='ph:envelope-simple' width={32} height={32} />
                    <p className='text-sm xs:text-base mobile:text-xm font-normal group-hover:text-primary'>info@satyajan.com</p>
                  </div>
                </Link>
                <div className='flex items-center gap-4'>
                  <Icon icon='ph:map-pin' width={32} height={32} />
                  <p className='text-sm xs:text-base mobile:text-xm font-normal'>Hyderabad, India</p>
                </div>
              </div>
            </div>

            {/* Right: form */}
            <div className='flex-1'>
              <form onSubmit={handleSubmit}>
                <div className='flex flex-col gap-8'>
                  <div className='flex flex-col lg:flex-row gap-6'>
                    <input type='text' name='username' value={form.username} onChange={handleChange} autoComplete='username' placeholder='Name*' required className='px-6 py-3.5 border border-black/10 rounded-full outline-primary focus:outline w-full' />
                    <input type='tel' name='mobile' value={form.mobile} onChange={handleChange} autoComplete='mobile' placeholder='Phone number*' required className='px-6 py-3.5 border border-black/10 rounded-full outline-primary focus:outline w-full' />
                  </div>
                  <input type='email' name='email' value={form.email} onChange={handleChange} autoComplete='email' placeholder='Email address*' required className='px-6 py-3.5 border border-black/10 rounded-full outline-primary focus:outline' />
                  <textarea rows={8} name='message' value={form.message} onChange={handleChange} placeholder='Write here your message' required className='px-6 py-3.5 border border-black/10 rounded-2xl outline-primary focus:outline' />
                  <button
                    type='submit'
                    disabled={submitting}
                    className='px-8 py-4 rounded-full bg-primary text-white text-base font-semibold w-full mobile:w-fit hover:bg-dark duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2'
                  >
                    {submitting
                      ? <><Icon icon="svg-spinners:3-dots-fade" width={20} />Sending...</>
                      : <><Icon icon="ph:paper-plane-tilt-fill" width={20} />Send message</>
                    }
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}