import Image from 'next/image'
import Link from 'next/link'

const Logo: React.FC = () => {
  return (
    <Link href="/">
      <Image
        src={'/images/header/satyajan-logo.svg'}
        alt='logo'
        width={100}
        height={59}
        unoptimized={true}
        style={{ clipPath: 'inset(8px 6px 8px 6px)' }}
      />
    </Link>
  )
}

export default Logo
