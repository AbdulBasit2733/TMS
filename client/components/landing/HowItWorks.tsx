import React from 'react'

const HowItWorks:React.FC = () => {
  return (
      <section id="how" className="bg-card px-6 py-28">
          <div className="mx-auto max-w-5xl">
            <div className="mb-16 text-center">
              <div className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Simple by design</div>
              <h2 className="mb-3 font-bold tracking-tight text-foreground" style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}>Up and running in minutes</h2>
              <p className="text-[1.0625rem] text-muted-foreground">Three steps. No complexity.</p>
            </div>

            <div className="relative">
              <div className="absolute top-8 left-1/2 hidden h-px -translate-x-1/2 md:block" style={{ width: "66%", background: "linear-gradient(90deg, transparent, oklch(0.70 0.19 43 / 0.3), transparent)" }} />
              <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
                {[
                  { n: "1", label: "Register",       desc: "Create a free account with just your email and password. Done in 10 seconds.", active: false,
                    icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M14 5v9M14 14l5-5M14 14l-5-5" stroke="oklch(0.70 0.19 43)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="4" y="18" width="20" height="6" rx="2" stroke="oklch(0.70 0.19 43)" strokeWidth="1.75"/></svg> },
                  { n: "2", label: "Create tasks",   desc: "Add tasks with title, description, priority, and optional dates. Change anytime.", active: true,
                    icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="4" y="5" width="20" height="18" rx="3" stroke="white" strokeWidth="1.75"/><path d="M9 5V3M19 5V3" stroke="white" strokeWidth="1.75" strokeLinecap="round"/><path d="M4 11h20" stroke="white" strokeWidth="1.75"/><path d="M10 16h8M10 19.5h5" stroke="white" strokeWidth="1.75" strokeLinecap="round"/></svg> },
                  { n: "3", label: "Track & complete", desc: "Toggle status, filter by priority, search instantly. Watch your progress grow.", active: false,
                    icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="10" stroke="oklch(0.70 0.19 43)" strokeWidth="1.75"/><path d="M9 14l3.5 3.5L19 10" stroke="oklch(0.70 0.19 43)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
                ].map(({ n, label, desc, active, icon }) => (
                  <div key={n} className="flex flex-col items-center text-center">
                    <div className={`relative z-10 mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${active ? "bg-primary shadow-[0_8px_24px_oklch(0.70_0.19_43/0.35)]" : "border-2 border-primary/30 bg-background shadow-[0_0_0_6px_oklch(0.70_0.19_43/0.07)]"}`}>
                      {icon}
                      <div className={`absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${active ? "bg-foreground text-background" : "bg-primary text-primary-foreground"}`}>{n}</div>
                    </div>
                    <h3 className="mb-2 font-semibold text-foreground">{label}</h3>
                    <p className="mx-auto max-w-[22ch] text-sm leading-relaxed text-muted-foreground">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
  )
}

export default HowItWorks