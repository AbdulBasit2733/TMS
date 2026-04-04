import { ArrowRightIcon, CalendarIcon } from '@/icons/icons'
import { Calendar, Clock, Star } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Hero = () => {
  return (
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
          {/* Grid pattern */}
          <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "linear-gradient(oklch(0.13 0 0 / 0.04) 1px, transparent 1px), linear-gradient(90deg, oklch(0.13 0 0 / 0.04) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

          {/* Animated orbs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-24 -top-24 h-[560px] w-[560px] animate-[orb-drift_12s_ease-in-out_infinite] rounded-full" style={{ background: "radial-gradient(circle, oklch(0.70 0.19 43 / 0.22) 0%, transparent 70%)" }} />
            <div className="absolute -bottom-20 -left-28 h-[480px] w-[480px] animate-[orb-drift-2_16s_ease-in-out_infinite] rounded-full" style={{ background: "radial-gradient(circle, oklch(0.80 0.18 55 / 0.15) 0%, transparent 70%)" }} />
          </div>

          {/* Floating SVG shapes */}
          <div className="pointer-events-none absolute left-[8%] top-36 hidden animate-[float-slow_8s_ease-in-out_infinite] opacity-20 lg:block">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect x="4" y="4" width="40" height="40" rx="10" stroke="oklch(0.70 0.19 43)" strokeWidth="2"/><path d="M14 24l7 7 13-14" stroke="oklch(0.70 0.19 43)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className="pointer-events-none absolute right-[10%] top-44 hidden animate-[float_6s_ease-in-out_infinite] opacity-15 lg:block">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="16" stroke="oklch(0.70 0.19 43)" strokeWidth="2"/><circle cx="20" cy="20" r="6" fill="oklch(0.70 0.19 43)" opacity="0.5"/></svg>
          </div>
          <div className="pointer-events-none absolute bottom-36 right-[14%] hidden animate-[float-slow_8s_ease-in-out_infinite] opacity-20 lg:block">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M18 4L32 28H4L18 4Z" stroke="oklch(0.70 0.19 43)" strokeWidth="2" strokeLinejoin="round"/></svg>
          </div>

          <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
            {/* Live badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Now live — Your personal task command center
            </div>

            <h1 className="mb-6 font-bold leading-[1.1] tracking-tight text-foreground" style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)" }}>
              Manage tasks with<br />
              <span className="bg-gradient-to-br from-primary to-orange-600 bg-clip-text font-serif italic text-transparent">
                clarity and speed
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-xl leading-relaxed text-muted-foreground" style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)" }}>
              A focused task manager built for individuals. Create, organize, and track every task —
              from pending to done — with a clean, distraction-free interface.
            </p>

            <div className="mb-16 flex flex-wrap items-center justify-center gap-4">
              <Link href="/register" className="flex items-center gap-2 rounded-[0.625rem] bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-[0_2px_8px_oklch(0.70_0.19_43/0.35)] transition-all hover:-translate-y-px hover:bg-primary/90 hover:shadow-[0_6px_20px_oklch(0.70_0.19_43/0.45)]">
                Start for free <ArrowRightIcon />
              </Link>
              <Link href="/login" className="rounded-[0.625rem] border border-border px-8 py-3.5 text-base font-medium text-foreground transition-all hover:border-primary/40 hover:bg-accent hover:text-primary">
                Sign in
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-3 text-sm">
              {[
                { icon: <Star width={16} height={16} />, text: "No credit card required" },
                { icon: <Clock width={16} height={16} />, text: "Set up in 30 seconds" },
                { icon: <CalendarIcon width={16} height={16} />, text: "Full CRUD + date tracking" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-muted-foreground">
                  <span className="text-primary">{icon}</span> {text}
                </div>
              ))}
            </div>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 opacity-40">
            <span className="text-xs text-muted-foreground">Scroll to explore</span>
            <div className="flex h-8 w-5 justify-center rounded-full border-2 border-muted-foreground pt-1.5">
              <div className="h-2 w-1 animate-bounce rounded-full bg-muted-foreground" />
            </div>
          </div>
        </section>
  )
}

export default Hero