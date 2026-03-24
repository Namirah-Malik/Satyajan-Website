// src/app/(site)/services/book/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';

const ALL_SERVICES = [
  {
    label: 'UPS / Inverter Installation',
    value: 'Inverter Installation',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80&auto=format&fit=crop',
    tag: 'Most Booked', tagColor: 'bg-primary text-white',
    desc: 'New inverter or UPS setup at home or office',
  },
  {
    label: 'Battery Replacement',
    value: 'Battery Replacement',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&q=80&auto=format&fit=crop',
    tag: 'Fast Service', tagColor: 'bg-emerald-500 text-white',
    desc: 'Doorstep battery swap with genuine brands',
  },
  {
    label: 'Solar Panel Installation',
    value: 'Solar Installation',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80&auto=format&fit=crop',
    tag: 'Save 90% Bill', tagColor: 'bg-yellow-500 text-white',
    desc: 'Rooftop solar setup, cut bills by 90%',
  },
  {
    label: 'UPS / Inverter Maintenance',
    value: 'Inverter Maintenance',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&q=80&auto=format&fit=crop',
    tag: 'Recommended', tagColor: 'bg-blue-500 text-white',
    desc: 'Full servicing, cleaning & health checkup',
  },
  {
    label: 'Inverter Repair',
    value: 'Inverter Repair',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80&auto=format&fit=crop',
    tag: null, tagColor: '',
    desc: 'Fix faulty inverters — fast turnaround',
  },
  {
    label: 'Battery Installation',
    value: 'Battery Installation',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80&auto=format&fit=crop',
    tag: null, tagColor: '',
    desc: 'New battery fitting for any inverter model',
  },
  {
    label: 'Solar Maintenance & AMC',
    value: 'Solar Maintenance',
    image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=400&q=80&auto=format&fit=crop',
    tag: null, tagColor: '',
    desc: 'Keep panels clean and performing at peak',
  },
  {
    label: 'UPS Service',
    value: 'UPS Service',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80&auto=format&fit=crop',
    tag: null, tagColor: '',
    desc: 'UPS repair, battery check & full servicing',
  },
];

const SERVICE_OPTIONS = [
  { label: 'Select a Service',      value: '' },
  { label: 'Inverter Installation', value: 'Inverter Installation' },
  { label: 'Inverter Repair',       value: 'Inverter Repair' },
  { label: 'Inverter Maintenance',  value: 'Inverter Maintenance' },
  { label: 'Battery Installation',  value: 'Battery Installation' },
  { label: 'Battery Replacement',   value: 'Battery Replacement' },
  { label: 'UPS Service',           value: 'UPS Service' },
  { label: 'Solar Installation',    value: 'Solar Installation' },
  { label: 'Solar Maintenance',     value: 'Solar Maintenance' },
];

const inputCls =
  'w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all';

interface FormState {
  fullName: string; mobile: string; serviceType: string; brandName: string;
  problemDetails: string; address: string; city: string; pincode: string; preferredDate: string;
}
const EMPTY: FormState = {
  fullName: '', mobile: '', serviceType: '', brandName: '',
  problemDetails: '', address: '', city: '', pincode: '', preferredDate: '',
};

// ── Booking Form ──────────────────────────────────────────────────────────────
function BookingForm({
  defaultService, serviceImage, onBack,
}: {
  defaultService: string; serviceImage: string; onBack: () => void;
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({ ...EMPTY, serviceType: defaultService });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState('');

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  useEffect(() => {
    const pin = form.pincode.trim();
    if (pin.length !== 6 || !/^\d{6}$/.test(pin)) { setPincodeError(''); return; }
    const go = async () => {
      setPincodeLoading(true); setPincodeError('');
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        const data = await res.json();
        if (data?.[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
          setForm(p => ({ ...p, city: data[0].PostOffice[0].District }));
        } else setPincodeError('Pincode not found — enter city manually');
      } catch { setPincodeError('Could not fetch — enter city manually'); }
      finally { setPincodeLoading(false); }
    };
    go();
  }, [form.pincode]);

  const WHATSAPP_NUMBER = '918019179159';

const submit = (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  const message = [
    '🔧 *New Service Request — Satyajan Energy Solutions*',
    '━━━━━━━━━━━━━━━━━━━━━━━',
    '👤 *Customer Details:*',
    `   Name: ${form.fullName}`,
    `   Mobile: ${form.mobile}`,
    '━━━━━━━━━━━━━━━━━━━━━━━',
    '🛠️ *Service Details:*',
    `   Service: ${form.serviceType}`,
    form.brandName ? `   Brand: ${form.brandName}` : '',
    form.problemDetails ? `   Issue: ${form.problemDetails}` : '',
    '━━━━━━━━━━━━━━━━━━━━━━━',
    '📍 *Location:*',
    `   Address: ${form.address}`,
    `   City: ${form.city}`,
    `   Pincode: ${form.pincode}`,
    form.preferredDate ? `   Preferred Date: ${form.preferredDate}` : '',
    '━━━━━━━━━━━━━━━━━━━━━━━',
    'Please confirm the service slot. Thank you! 🙏',
  ]
    .filter(Boolean)
    .join('\n');

  // Open WhatsApp with the message
  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
    '_blank'
  );

  setLoading(false);
  setDone(true);
};

  if (done) return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-5">
        <Icon icon="ph:check-circle-fill" className="text-emerald-500 text-5xl" />
      </div>
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2">Request Submitted!</h2>
      <p className="text-sm text-gray-500 mb-8 max-w-xs">Our team will contact you shortly.</p>
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <button onClick={() => { setDone(false); setForm(EMPTY); onBack(); }}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-white px-5 py-3 rounded-full font-bold text-sm">
          <Icon icon="ph:arrow-left-bold" width={14} /> Book Another
        </button>
        <a href="/" className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 px-5 py-3 rounded-full font-bold text-sm">
          Go Home
        </a>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6">

      {/* ── Back bar for form page — same style as service grid back bar ── */}
      <button
        onClick={onBack}
        className="w-full flex items-center gap-3 bg-white border border-gray-100 rounded-2xl shadow-sm px-4 py-3 mb-4 sm:mb-5
                   hover:border-primary/30 hover:shadow-md active:scale-[0.99] transition-all duration-200 text-left"
      >
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 flex-shrink-0">
          <Icon icon="ph:arrow-left-bold" width={14} className="text-gray-700" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-extrabold text-gray-900 leading-tight">Book a Service</p>
          <p className="text-xs text-gray-400 font-medium">Tap to change selected service</p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-extrabold">
            <Icon icon="ph:check-bold" width={10} />
          </div>
          <div className="w-4 h-0.5 rounded-full bg-primary" />
          <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-extrabold">
            2
          </div>
        </div>
      </button>

      {/* Service banner */}
      <div className="relative rounded-2xl overflow-hidden mb-4 sm:mb-5 h-24 sm:h-36">
        <img src={serviceImage} alt={defaultService} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20 flex items-center px-4 sm:px-6">
          <div>
            <p className="text-white/60 text-[9px] sm:text-[10px] font-semibold uppercase tracking-widest mb-0.5">Selected Service</p>
            <h3 className="text-white text-sm sm:text-xl font-extrabold leading-tight">{defaultService}</h3>
          </div>
          <button onClick={onBack}
            className="ml-auto flex items-center gap-1 bg-white/20 border border-white/30 text-white text-[10px] sm:text-xs font-bold px-2.5 py-1.5 rounded-full hover:bg-white/30 transition-colors whitespace-nowrap">
            <Icon icon="ph:pencil-simple-bold" width={10} /> Change
          </button>
        </div>
      </div>

      <div className="mb-3 sm:mb-4">
        <h2 className="text-base sm:text-xl font-extrabold text-gray-900 mb-0.5">Your Details</h2>
        <p className="text-xs sm:text-sm text-gray-500">We&apos;ll confirm within 30 minutes</p>
      </div>

      <form onSubmit={submit} className="bg-white rounded-2xl sm:rounded-3xl shadow-md border border-gray-100 p-4 sm:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">

          <div className="flex flex-col gap-1">
            <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wide">Full Name</label>
            <div className="relative">
              <Icon icon="ph:user-fill" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width={15} />
              <input name="fullName" value={form.fullName} onChange={set} required placeholder="Full Name" className={inputCls} />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wide">Mobile Number</label>
            <div className="relative">
              <Icon icon="ph:phone-fill" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width={15} />
              <input name="mobile" type="tel" value={form.mobile} onChange={set} required placeholder="Mobile Number" className={inputCls} />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wide">Service Type</label>
            <div className="relative">
              <Icon icon="ph:wrench-fill" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width={15} />
              <select name="serviceType" id="serviceType" value={form.serviceType} onChange={set} required
                className={`${inputCls} appearance-none cursor-pointer`}>
                {SERVICE_OPTIONS.map(o => (
                  <option key={o.value} value={o.value} disabled={o.value === ''}>{o.label}</option>
                ))}
              </select>
              <Icon icon="ph:caret-down-bold" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width={11} />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wide">
              Brand Name <span className="text-gray-400 normal-case font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <Icon icon="ph:tag-fill" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width={15} />
              <input name="brandName" value={form.brandName} onChange={set} placeholder="e.g. Luminous, Exide" className={inputCls} />
            </div>
          </div>

          <div className="sm:col-span-2 flex flex-col gap-1">
            <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wide">Problem / Service Details</label>
            <div className="relative">
              <Icon icon="ph:note-fill" className="absolute left-3 top-3 text-gray-400" width={15} />
              <textarea name="problemDetails" value={form.problemDetails} onChange={set} rows={3}
                placeholder="Describe your issue or requirement…"
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none" />
            </div>
          </div>

          <div className="sm:col-span-2 flex flex-col gap-1">
            <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wide">Address</label>
            <div className="relative">
              <Icon icon="ph:map-pin-fill" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width={15} />
              <input name="address" value={form.address} onChange={set} required placeholder="Street / Area / Landmark" className={inputCls} />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wide">Pincode</label>
            <div className="relative">
              <Icon icon="ph:map-trifold-fill" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width={15} />
              <input name="pincode" value={form.pincode} onChange={set} required placeholder="6-digit PIN" maxLength={6} className={inputCls} />
              {pincodeLoading && <Icon icon="ph:circle-notch-bold" className="absolute right-3 top-1/2 -translate-y-1/2 text-primary animate-spin" width={15} />}
            </div>
            {pincodeError && <p className="text-[11px] text-red-500 mt-0.5">{pincodeError}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
              City
              {pincodeLoading && <span className="text-[9px] text-primary font-semibold normal-case">Fetching…</span>}
              {!pincodeLoading && form.city && form.pincode.length === 6 && (
                <span className="text-[9px] text-emerald-500 font-semibold normal-case flex items-center gap-0.5">
                  <Icon icon="ph:check-bold" width={9} /> Auto-filled
                </span>
              )}
            </label>
            <div className="relative">
              <Icon icon="ph:buildings-fill" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width={15} />
              <input name="city" value={form.city} onChange={set} required placeholder="Auto-filled from pincode"
                className={`${inputCls} ${form.city && form.pincode.length === 6 ? 'border-emerald-300 bg-emerald-50/40' : ''}`} />
            </div>
          </div>

          <div className="sm:col-span-2 flex flex-col gap-1">
            <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wide">Preferred Service Date</label>
            <div className="relative">
              <Icon icon="ph:calendar-fill" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width={15} />
              <input name="preferredDate" type="date" value={form.preferredDate} onChange={set}
                min={new Date().toISOString().split('T')[0]} className={inputCls} />
            </div>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-5 sm:mt-6">
          <button type="submit" disabled={loading}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-white px-5 py-3.5 rounded-full font-bold hover:bg-dark transition-colors shadow-md text-sm disabled:opacity-60 disabled:cursor-not-allowed">
            {loading
              ? <><Icon icon="ph:circle-notch-bold" className="animate-spin" width={16} /> Submitting…</>
              : <><Icon icon="ph:paper-plane-tilt-fill" width={16} /> Submit Service Request</>}
          </button>
          <a href="tel:+918019179159"
            className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-primary text-primary px-5 py-3.5 rounded-full font-bold hover:bg-primary hover:text-white transition-colors text-sm">
            <Icon icon="ph:phone-fill" width={16} /> Call for Emergency
          </a>
        </div>
      </form>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function BookServicePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<{ value: string; image: string } | null>(null);

  const handleSelect = (value: string, image: string) => {
    setSelected({ value, image });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-gray-50 mt-[80px]">

      {/* ── SERVICE GRID VIEW ── */}
      {selected === null && (
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-5 sm:py-8">

          {/* ── BACK BAR — the whole card is clickable and goes to previous page ── */}
          <button
            onClick={() => router.back()}
            className="w-full flex items-center gap-3 bg-white border border-gray-100 rounded-2xl shadow-sm px-4 py-3 mb-5 sm:mb-6
                       hover:border-primary/30 hover:shadow-md active:scale-[0.99] transition-all duration-200 text-left"
          >
            {/* Arrow circle */}
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 flex-shrink-0">
              <Icon icon="ph:arrow-left-bold" width={14} className="text-gray-700" />
            </div>

            {/* Title + subtitle */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-extrabold text-gray-900 leading-tight">Select a Service</p>
              <p className="text-xs text-gray-400 font-medium">Tap to go back to previous page</p>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-extrabold">
                1
              </div>
              <div className="w-4 h-0.5 rounded-full bg-gray-200" />
              <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center text-[10px] font-extrabold">
                2
              </div>
            </div>
          </button>

          {/* Heading */}
          <div className="mb-4 sm:mb-6">
            <h2 className="text-base sm:text-2xl font-extrabold text-gray-900 mb-0.5">What do you need help with?</h2>
            <p className="text-xs sm:text-sm text-gray-500">Tap a service to book it at your doorstep</p>
          </div>

          {/* 2 col mobile / 4 col desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {ALL_SERVICES.map((svc, i) => (
              <button key={i} type="button"
                onClick={() => handleSelect(svc.value, svc.image)}
                className="group relative flex flex-col bg-white rounded-xl sm:rounded-2xl border border-gray-100
                           shadow-sm overflow-hidden text-left
                           hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/20
                           active:scale-95 transition-all duration-200
                           focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  <img src={svc.image} alt={svc.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {svc.tag && (
                    <span className={`absolute top-1.5 left-1.5 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full ${svc.tagColor}`}>
                      {svc.tag}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <span className="bg-white text-primary text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow flex items-center gap-1">
                      Book <Icon icon="ph:arrow-right-bold" width={9} />
                    </span>
                  </div>
                </div>
                <div className="p-2 sm:p-3">
                  <p className="text-[11px] sm:text-sm font-bold text-gray-900 leading-snug line-clamp-2">{svc.label}</p>
                  <p className="text-[9px] sm:text-xs text-gray-400 leading-snug mt-0.5 line-clamp-1 hidden sm:block">{svc.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Help strip */}
          <div className="mt-5 sm:mt-8 bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm font-extrabold text-gray-900">Not sure which service?</p>
                <p className="text-xs text-gray-400">Call us — experts will guide you</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <a href="tel:+918019179159"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-primary text-white px-4 py-2.5 rounded-full font-bold hover:bg-dark transition-colors text-sm">
                  <Icon icon="ph:phone-fill" width={14} /> Call Now
                </a>
                <a href="https://wa.me/918019179159?text=Hi, I need help with a service"
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 border-2 border-emerald-500 text-emerald-600 px-4 py-2.5 rounded-full font-bold hover:bg-emerald-500 hover:text-white transition-colors text-sm">
                  <Icon icon="ph:whatsapp-logo-fill" width={14} /> WhatsApp
                </a>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ── BOOKING FORM VIEW ── */}
      {selected !== null && (
        <BookingForm
          defaultService={selected.value}
          serviceImage={selected.image}
          onBack={() => setSelected(null)}
        />
      )}

    </main>
  );
}