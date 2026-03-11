import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react"

const FooterLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Services', href: '/services' },
  { label: 'Technology', href: '/technology' },
  { label: 'Blogs', href: '/blogs' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact Us', href: '/contactus' },
  { label: 'Terms & Conditions', href: '/terms' },
]

// ✅ Values match the exact category strings stored in the database
const ProductLinks = [
  { label: 'Solar Solutions',     href: '/products?category=Solar' },
  { label: 'Inverter / Home UPS', href: '/products?category=Inverter' },
  { label: 'Jumbo UPS',           href: '/products?category=High+Capacity+UPS' },
  { label: 'Online UPS',          href: '/products?category=ONLINE+UPS' },
  { label: 'Tubular Battery',     href: '/products?category=Battery' },
  { label: 'Lithium Batteries',   href: '/products?category=New+Lithium+Battery' },
  { label: 'Combos',              href: '/products?category=Combos' },
]

const Footer = () => {
  return (
    <footer id="site-footer" className="relative z-0 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto max-w-8xl px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

          {/* Brand */}
          <div>
            <Image src="/images/header/satyajan-logo.svg" alt="Satyajan Energy Solutions Logo" width={120} height={60} style={{ clipPath: 'inset(8px 6px 8px 6px)' }} />
            <h3 className="text-white text-xl font-bold mt-4">
              Satyajan<br />
              Energy Solutions
            </h3>
            <p className="text-white/70 text-sm mt-2">
              Your trusted partner for solar solutions, power backup systems, and battery management across India.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {FooterLinks.map((item, index) => (
                <li key={index}>
                  <Link href={item.href} className="text-white/60 hover:text-white text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Products */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Our Products</h4>
            <ul className="space-y-2">
              {ProductLinks.map((item, index) => (
                <li key={index}>
                  <Link href={item.href} className="text-white/60 hover:text-white text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2">
              <li><Link href="/services" className="text-white/60 hover:text-white text-sm transition-colors">Solar Energy</Link></li>
              <li><Link href="/services" className="text-white/60 hover:text-white text-sm transition-colors">Power Backup & UPS</Link></li>
              <li><Link href="/services" className="text-white/60 hover:text-white text-sm transition-colors">Battery</Link></li>
              <li><Link href="/services" className="text-white/60 hover:text-white text-sm transition-colors">Technical Support & After-Sales</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Icon icon="fa-solid:phone" className="text-primary mr-2" width={16} height={16} />
                <Link href="tel:+918019179159" className="text-white/60 hover:text-white text-sm transition-colors">+91 8019179159</Link>
              </div>
              <div className="flex space-x-4 flex-wrap gap-y-3">
  <Link href="https://www.instagram.com/satyajan.solutions/" target="_blank">
    <Icon icon="fa7-brands:instagram" width={24} height={24} className="text-white hover:text-primary transition-colors" />
  </Link>
  <Link href="https://www.linkedin.com/company/satyajan-energy-solutions-pvt-ltd/" target="_blank">
    <Icon icon="fa7-brands:linkedin" width={24} height={24} className="text-white hover:text-primary transition-colors" />
  </Link>
  <Link href="https://www.facebook.com/profile.php?id=61577768371371&sk=followers" target="_blank">
    <Icon icon="fa7-brands:square-facebook" width={24} height={24} className="text-white hover:text-primary transition-colors" />
  </Link>
  <Link href="https://www.indiamart.com/satyajanenergysolutions/profile.html" target="_blank" rel="noopener noreferrer">
  <span className="flex items-center justify-center w-6 h-6 text-white hover:text-primary transition-colors font-black text-xs">IM</span>
</Link>
{/* Google Business Profile */}
<Link href="https://www.google.com/maps/place/Satyajan+Energy+Solutions+Pvt.Ltd./@17.3326358,78.5367308,15.91z" target="_blank" rel="noopener noreferrer">
  <Icon icon="fa7-brands:google" width={24} height={24} className="text-white hover:text-primary transition-colors" />
</Link>
</div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-8 pt-6">
          <div className="flex flex-col md:flex-row items-center md:justify-between gap-4">
            <p className="text-white/40 text-sm">
              © 2025 Satyajan Energy Solutions Pvt Ltd. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/terms" className="text-white/60 hover:text-white text-sm">Terms of Service</Link>
              <Link href="/privacy" className="text-white/60 hover:text-white text-sm">Privacy Policy</Link>
              <Link href="/cancellation" className="text-white/60 hover:text-white text-sm">Cancellation & Refund</Link>
              <Link href="/contactus" className="text-white/60 hover:text-white text-sm">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;