import type { Metadata } from 'next'
import { Bricolage_Grotesque } from 'next/font/google'
import './globals.css'
import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'
import NextTopLoader from 'nextjs-toploader';
import ScrollToTop from '@/components/shared/ScrollToTop';
import Chatbox from '@/components/utils/chatbot';
import CallMeBackTrigger from '@/components/CallMeBackTrigger';
import { CartProvider } from '@/context/CartContext';

const font = Bricolage_Grotesque({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Satyajan - Solar and Battery solutions',
  description: "Satyajan Energy solutions provides comprehensive suit of Solar Equipment's, battery maintenance and Power backup solutions.We provide a Battery Management program that helps companies achieve immediate cost savings and supports corporate wide sustainability goals."
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${font.className} bg-white antialiased`}>
        <CartProvider>
          <NextTopLoader color="#07be8a" />
          <Header />
          {children}
          <ScrollToTop />
          <Footer />
          <CallMeBackTrigger />
          <Chatbox />
        </CartProvider>
      </body>
    </html>
  )
}
