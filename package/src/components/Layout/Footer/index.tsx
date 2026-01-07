import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react"

// Footer links inlined so this component is self-contained
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

const Footer = () => {
  const quickLinksFiltered = FooterLinks.filter(item => 
    !['Solar Solutions', 'Inverter / Home UPS', 'Jumbo UPS', 'Online UPS', 'Tubular Battery', 'Lithium Batteries', 'Combos'].includes(item.label)
  );

  return (
    <footer id="site-footer" className="relative z-0 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto max-w-8xl px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
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
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Our Products</h4>
            <ul className="space-y-2">
              <li><Link href="/products/solar-1" className="text-white/60 hover:text-white text-sm transition-colors">Solar Solutions</Link></li>
              <li><Link href="/products/inverter-2" className="text-white/60 hover:text-white text-sm transition-colors">Inverter / Home UPS</Link></li>
              <li><Link href="/products/jumbo-ups-3" className="text-white/60 hover:text-white text-sm transition-colors">Jumbo UPS</Link></li>
              <li><Link href="/products/online-ups-4" className="text-white/60 hover:text-white text-sm transition-colors">Online UPS</Link></li>
              <li><Link href="/products/battery-5" className="text-white/60 hover:text-white text-sm transition-colors">Tubular Battery</Link></li>
              <li><Link href="/products/lithium-6" className="text-white/60 hover:text-white text-sm transition-colors">Lithium Batteries</Link></li>
              <li><Link href="/products/combos-7" className="text-white/60 hover:text-white text-sm transition-colors">Combos</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2">
              <li><Link href="/services" className="text-white/60 hover:text-white text-sm transition-colors">Solar Energy</Link></li>
              <li><Link href="/services" className="text-white/60 hover:text-white text-sm transition-colors">Power Backup & UPS</Link></li>
              <li><Link href="/services" className="text-white/60 hover:text-white text-sm transition-colors">Battery</Link></li>
              <li><Link href="/services" className="text-white/60 hover:text-white text-sm transition-colors">Technical Support & After-Sales</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Icon icon="fa-solid:phone" className="text-primary mr-2" width={16} height={16} />
                <Link href="tel:+918019179159" className="text-white/60 hover:text-white text-sm transition-colors">+91 8019179159</Link>
              </div>
              <div className="flex items-center">
                <Icon icon="fa-solid:envelope" className="text-primary mr-2" width={16} height={16} />
                <Link href="mailto:info@satyajan.com" className="text-white/60 hover:text-white text-sm transition-colors">info@satyajan.com</Link>
              </div>
              <div className="text-white/60 text-sm">
                Plot No. 47, Green Lands Colony, Karmanghat, LB Nagar, Hyderabad – 500079
              </div>
              <h5 className="text-white text-md font-semibold mt-4 mb-2">Follow Us</h5>
              <div className="flex space-x-4">
                <Link href="https://www.instagram.com/satyajan.solutions/" target="_blank">
                  <Icon icon="fa7-brands:instagram" width={24} height={24} className="text-white hover:text-primary transition-colors" />
                </Link>
                <Link href="https://www.linkedin.com/company/satyajan-energy-solutions-pvt-ltd/" target="_blank">
                  <Icon icon="fa7-brands:linkedin" width={24} height={24} className="text-white hover:text-primary transition-colors" />
                </Link>
                <Link href="https://www.facebook.com/profile.php?id=61577768371371&sk=followers" target="_blank">
                  <Icon icon="fa7-brands:square-facebook" width={24} height={24} className="text-white hover:text-primary transition-colors" />
                </Link>
              </div>
            </div>
          </div>
        </div>
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