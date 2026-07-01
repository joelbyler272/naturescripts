import Link from 'next/link'
import { cn } from '@/lib/utils'
import { routes } from '@/lib/constants/routes'
import { colors } from '@/lib/constants/colors'

interface LogoProps {
  size?: 'sm' | 'default' | 'lg' | 'display'
  className?: string
  linkToHome?: boolean
}

export function Logo({
  size = 'default',
  className,
  linkToHome = true
}: LogoProps) {
  const sizeClasses = {
    sm: 'text-[1.2rem]',
    default: 'text-[1.1rem] sm:text-[1.6rem]',
    lg: 'text-[2.5rem]',
    display: 'text-[clamp(4rem,12vw,8rem)]',
  }

  const logoContent = (
    <div className={cn('inline-block', className)}>
      <div className={cn(
        'font-semibold tracking-tight leading-none font-serif',
        sizeClasses[size]
      )}>
        <span className="text-foreground">Nature</span>
        <span 
          className="font-light"
          style={{ color: colors.sage.DEFAULT }}
        >
          Scripts
        </span>
      </div>
    </div>
  )

  if (linkToHome) {
    return (
      <Link href={routes.home} className="cursor-pointer">
        {logoContent}
      </Link>
    )
  }

  return logoContent
}
