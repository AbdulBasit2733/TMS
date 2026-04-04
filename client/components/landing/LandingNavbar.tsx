"use client"

import { ArrowRightIcon, LogoIcon } from "@/icons/icons"
import Link from "next/link"
import React from "react"

const NAV_LINKS = [
  { label: "Features",     href: "#features" },
  { label: "How it works", href: "#how"      },
  { label: "Preview",      href: "#preview"  },
]

function smoothScrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" })
    // update URL hash without triggering Next.js navigation
    window.history.pushState(null, "", `#${id}`)
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" })
  window.history.pushState(null, "", "/")
}

const LandingNavbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">


        <button
          onClick={scrollToTop}
          className="flex cursor-pointer items-center gap-2.5 font-semibold text-foreground transition-opacity hover:opacity-80"
          aria-label="Back to top"
        >
          <LogoIcon />
          TaskFlow
        </button>

 
        <div className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <button
              key={href}
              onClick={() => smoothScrollTo(href.replace("#", ""))}
              className="cursor-pointer transition-colors hover:text-primary"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-primary/40 hover:bg-accent hover:text-primary"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[0_2px_8px_oklch(0.70_0.19_43/0.35)] transition-all hover:-translate-y-px hover:bg-primary/90 hover:shadow-[0_6px_20px_oklch(0.70_0.19_43/0.45)]"
          >
            Get started <ArrowRightIcon />
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default LandingNavbar