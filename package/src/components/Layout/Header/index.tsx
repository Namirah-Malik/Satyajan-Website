'use client'
import { navLinks } from '@/app/api/navlink'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import { useEffect, useRef, useState, useCallback } from 'react'
import NavLink from './Navigation/NavLink'
import { usePathname } from 'next/navigation'
import Logo from './BrandLogo/Logo'
import Search from './Search'
import { useCart } from '@/context/CartContext'

const Header: React.FC = () => {
  const [sticky, setSticky] = useState(false)
  const [navbarOpen, setNavbarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { getTotalItems } = useCart()
  const cartItemCount = getTotalItems()

  const sideMenuRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = (event: MouseEvent) => {
    if (sideMenuRef.current && !sideMenuRef.current.contains(event.target as Node)) {
      setNavbarOpen(false)
    }
  }

  const handleScroll = useCallback(() => {
    setSticky(window.scrollY >= 50)
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handleScroll])

  const isHomepage = pathname === '/'

  return (
    <header className={`fixed h-24 py-1 z-50 w-full bg-transparent transition-all duration-300 lg:px-0 px-4 ${sticky ? "top-3" : "top-0"}`}>
      <nav className={`container mx-auto max-w-8xl flex items-center justify-between py-4 duration-300 ${sticky ? "shadow-lg bg-white rounded-full top-5 px-4 " : "shadow-none top-0"}`}>
        <div className='flex justify-between items-center gap-2 w-full'>
          <div>
            <Logo />
          </div>
          <div className='flex items-center gap-2 sm:gap-6'>
            <div>
              <Search sticky={sticky} isHomepage={isHomepage} />
            </div>
            <Link
              href="/cart"
              className={`relative flex items-center justify-center p-2 rounded-full transition-colors ${
                isHomepage
                  ? sticky
                    ? 'text-dark hover:text-primary'
                    : 'text-white hover:text-primary'
                  : 'text-dark hover:text-primary'
              }`}
            >
              <Icon icon={'solar:cart-large-4-bold'} width={24} height={24} />
              {mounted && cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </Link>
            <div className={`hidden md:block`}>
              <Link href='https://wa.me/918019179159' className={`text-base text-inherit flex items-center gap-2 border-r pr-6 ${isHomepage
                ? sticky
                  ? 'text-dark hover:text-primary border-dark'
                  : 'text-white hover:text-primary'
                : 'text-dark hover:text-primary'
                }`}
              >
                <Icon icon={'ph:phone-bold'} width={24} height={24} />
                +91 8019179159
              </Link>
            </div>
            <div>
              <button
                onClick={() => setNavbarOpen(!navbarOpen)}
                className={`flex items-center gap-3 p-2 sm:px-5 sm:py-3 rounded-full font-semibold hover:cursor-pointer border ${isHomepage
                  ? sticky
                    ? 'text-white bg-dark hover:text-dark hover:bg-white border-dark'
                    : 'text-dark bg-white hover:bg-transparent hover:text-white border-white'
                  : 'bg-dark text-white hover:bg-transparent hover:text-dark duration-300'
                  }`}
                aria-label='Toggle mobile menu'>
                <span>
                  <Icon icon={'ph:list'} width={24} height={24} />
                </span>
                <span className='hidden sm:block'>Menu</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {
        navbarOpen && (
          <div className='fixed top-0 left-0 w-full h-full bg-black/50 z-40' />
        )
      }

      <div
        ref={sideMenuRef}
        className={`fixed top-0 right-0 h-full w-full bg-dark shadow-lg transition-transform duration-300 max-w-2xl ${navbarOpen ? 'translate-x-0' : 'translate-x-full'} z-50 px-20 overflow-auto no-scrollbar`}
      >
        <div className="flex flex-col h-full justify-between">
          <div className="">
            <div className='flex items-center justify-start py-10'>
              <button
                onClick={() => setNavbarOpen(false)}
                aria-label='Close mobile menu'
                className='bg-white p-3 rounded-full hover:cursor-pointer'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'>
                  <path
                    fill='none'
                    stroke='black'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>
            <nav className='flex flex-col items-start gap-4'>
              <ul className='w-full'>
                {navLinks.map((item, index) => (
                  <NavLink key={index} item={item} onClick={() => setNavbarOpen(false)} />
                ))}
              </ul>
            </nav>
          </div>

          <div className='flex flex-col gap-1 my-16 text-white'>
            <p className='text-base sm:text-xm font-normal text-white/40'>
              Contact
            </p>
            <Link href="mailto:info@satyajan.com" className='text-base sm:text-xm font-medium text-inherit hover:text-primary'>
              info@satyajan.com
            </Link>
            <Link href="mailto:service@satyajan.com" className='text-base sm:text-xm font-medium text-inherit hover:text-primary'>
              service@satyajan.com
            </Link>
            <Link href="https://wa.me/918019179159" className='text-base sm:text-xm font-medium text-inherit hover:text-primary'>
              +91 8019179159
            </Link>
          </div>
        </div>
      </div>
    </header >
  )
}

export default Header
