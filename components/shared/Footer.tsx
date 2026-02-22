import Link from "next/link"
import { routes } from "@/lib/constants/routes"
import { colors } from "@/lib/constants/colors"

const footerLinks = {
  naturescripts: {
    title: "NatureScripts",
    links: [
      { label: "How It Works", href: "/how-it-works" },
      { label: "Start Consultation", href: routes.consultation },
      { label: "Remedy Database", href: routes.remedies },
      { label: "Pricing", href: routes.pricing },
    ]
  },
  company: {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Approach", href: "/approach" },
      { label: "Contact", href: "/contact" },
      { label: "FAQs", href: "/faqs" },
    ]
  },
  library: {
    title: "Library",
    links: [
      { label: "Health Guides", href: routes.libraryGuides },
      { label: "Research", href: routes.libraryResearch },
      { label: "Blog", href: routes.blog },
    ]
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: routes.terms },
      { label: "Privacy Policy", href: routes.privacy },
    ]
  },
  connect: {
    title: "Connect",
    links: [
      { label: "X / Twitter", href: "https://twitter.com/naturescripts", external: true },
      { label: "Instagram", href: "https://instagram.com/naturescripts", external: true },
      { label: "LinkedIn", href: "https://linkedin.com/company/naturescripts", external: true },
    ]
  }
}

function FooterLink({ href, label, external }: { href: string; label: string; external?: boolean }) {
  const linkProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {}

  return (
    <Link
      href={href}
      {...linkProps}
      className="group flex items-center text-[15px] text-foreground/70 transition-colors hover:text-accent"
    >
      <span>{label}</span>
    </Link>
  )
}

function FooterColumn({ title, links }: { title: string; links: Array<{ label: string; href: string; external?: boolean }> }) {
  return (
    <div className="space-y-4">
      {/* Column title - lighter grey */}
      <h4 className="text-[14px] font-medium text-muted-foreground/60">{title}</h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <FooterLink href={link.href} label={link.label} external={link.external} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-secondary/60 border-t border-border/20">
      {/* Large Logo Section - original padding */}
      <div className="mx-auto max-w-6xl px-6 pt-10 pb-10">
        <div className="flex justify-center">
          <h2 className="text-[clamp(4rem,12vw,8rem)] tracking-tight leading-none font-serif select-none">
            <span className="text-foreground font-semibold">Nature</span>
            <span className="font-light" style={{ color: colors.sage.DEFAULT }}>Scripts</span>
          </h2>
        </div>
      </div>

      {/* Link Columns - Centered */}
      <div className="mx-auto max-w-5xl px-6 pb-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5 justify-items-start lg:justify-items-center">
          <FooterColumn {...footerLinks.naturescripts} />
          <FooterColumn {...footerLinks.company} />
          <FooterColumn {...footerLinks.library} />
          <FooterColumn {...footerLinks.legal} />
          <FooterColumn {...footerLinks.connect} />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/20">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-[12px] text-muted-foreground/40 tracking-wide uppercase">
              &copy; {currentYear} NatureScripts. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-[12px] text-muted-foreground/40 tracking-wide uppercase">
              <Link href={routes.terms} className="hover:text-muted-foreground transition-colors">
                Terms
              </Link>
              <Link href={routes.privacy} className="hover:text-muted-foreground transition-colors">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
