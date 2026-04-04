import { ArrowRightIcon } from '@/icons/icons'
import Link from 'next/link'
import React from 'react'

const CTA:React.FC = () => {
  return (
         <section className="relative overflow-hidden bg-primary px-6 py-24">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white opacity-[0.08]" />
            <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white opacity-[0.06]" />
            <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          </div>
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <h2 className="mb-4 font-bold tracking-tight text-white" style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}>
              Ready to take control of your tasks?
            </h2>
            <p className="mb-10 text-[1.1rem] leading-relaxed text-white/75">
              Join TaskFlow and turn your to-do list into a system that actually works.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register" className="flex items-center gap-2 rounded-[0.625rem] bg-white px-8 py-3.5 text-base font-bold text-primary shadow-[0_4px_16px_oklch(0_0_0/0.20)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_oklch(0_0_0/0.25)]">
                Create free account <ArrowRightIcon />
              </Link>
              <Link href="/login" className="rounded-[0.625rem] border border-white/40 px-8 py-3.5 text-base font-medium text-white transition-all hover:bg-white/10">
                Sign in instead
              </Link>
            </div>
          </div>
        </section>
  )
}

export default CTA