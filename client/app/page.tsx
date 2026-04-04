import DashboardPreview from "@/components/landing/DashboardPreview"

import Features from "@/components/landing/Features"
import Hero from "@/components/landing/Hero"
import HowItWorks from "@/components/landing/HowItWorks"
import LandingNavbar from "@/components/landing/LandingNavbar"
import { LogoIcon } from "@/icons/icons"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "TaskFlow — Smart Task Management",
  description:
    "A focused task manager. Create, organize, and track every task with a clean, distraction-free interface.",
}


export default function HomePage() {
  return (
    <>
      <LandingNavbar />
      

      <main>

      <Hero />


        <div className="overflow-hidden border-y border-border bg-card py-4">
          <div className="flex w-max animate-[ticker_28s_linear_infinite] items-center gap-10">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-10 pr-10 text-xs font-medium whitespace-nowrap text-muted-foreground" aria-hidden={i > 0}>
                {["JWT Authentication","Refresh Token Rotation","Pagination & Search","Priority Filtering","Status Toggle","Date Tracking","Dark Mode","Mobile Responsive","Next.js App Router","PostgreSQL + Prisma"].map((t) => (
                  <span key={t} className="flex items-center gap-2"><span className="text-primary">✓</span> {t}</span>
                ))}
              </div>
            ))}
          </div>
        </div>


     <Features />

      <HowItWorks />
                  <DashboardPreview />

   
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border bg-card px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2.5 font-semibold text-foreground"><LogoIcon /> TaskFlow</div>
          <p className="text-center text-sm text-muted-foreground">Built with Next.js · TypeScript · PostgreSQL · Prisma · shadcn/ui</p>
          <p className="text-sm text-muted-foreground">© 2026 TaskFlow. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}

