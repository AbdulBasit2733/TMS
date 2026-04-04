import React from 'react'

const DashboardPreview:React.FC = () => {
  return (
         <section id="preview" className="overflow-hidden px-6 py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <div className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Live preview</div>
              <h2 className="mb-3 font-bold tracking-tight text-foreground" style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}>Your dashboard, at a glance</h2>
              <p className="text-[1.0625rem] text-muted-foreground">Clean, focused, and always in control.</p>
            </div>

            {/* Browser mockup */}
            <div className="animate-[float_6s_ease-in-out_infinite] overflow-hidden rounded-2xl border border-border shadow-[0_32px_80px_oklch(0_0_0/0.10)]">
              {/* Chrome bar */}
              <div className="flex items-center gap-3 border-b border-border bg-card px-5 py-3.5">
                <div className="flex gap-1.5">
                  {["#ef4444","#f59e0b","#22c55e"].map((c) => <div key={c} className="h-3 w-3 rounded-full" style={{ background: c }} />)}
                </div>
                <div className="flex flex-1 items-center justify-center">
                  <div className="flex max-w-xs flex-1 items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1a4 4 0 100 8A4 4 0 005 1zM1 5h8" stroke="currentColor" strokeWidth="1.2"/></svg>
                    taskflow.app/dashboard
                  </div>
                </div>
              </div>

              {/* Dashboard body */}
              <div className="bg-background p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-foreground">Tasks</div>
                    <div className="text-xs text-muted-foreground">Organize work and track progress.</div>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="white" strokeWidth="1.75" strokeLinecap="round"/></svg>
                    New Task
                  </div>
                </div>

                <div className="mb-6 grid grid-cols-3 gap-3">
                  {[
                    { n: 12, label: "Total",   color: "text-primary",     bg: "bg-primary/10",     icon: "📋" },
                    { n: 7,  label: "Pending", color: "text-amber-600",   bg: "bg-amber-500/10",   icon: "⏱" },
                    { n: 5,  label: "Done",    color: "text-emerald-600", bg: "bg-emerald-500/10", icon: "✓" },
                  ].map(({ n, label, color, bg, icon }) => (
                    <div key={label} className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm ${bg}`}>{icon}</div>
                      <div>
                        <div className="text-xs text-muted-foreground">{label}</div>
                        <div className={`text-lg font-bold tabular-nums ${color}`}>{n}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="overflow-hidden rounded-xl border border-border bg-card">
                  <div className="flex gap-2 border-b border-border bg-background/60 p-3">
                    <div className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.25"/><path d="M8.5 8.5L11 11" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/></svg>
                      Search tasks…
                    </div>
                    <div className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs text-muted-foreground">All statuses</div>
                    <div className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs text-muted-foreground">All priorities</div>
                  </div>
                  {[
                    { done: true,  label: "Configure Prisma schema",   status: "Completed", sc: "text-emerald-600 bg-emerald-500/10", priority: "Medium", pc: "text-amber-600 bg-amber-500/10" },
                    { done: false, label: "Build REST API endpoints",  status: "Pending",   sc: "text-amber-600 bg-amber-500/10",   priority: "High",   pc: "text-red-600 bg-red-500/10" },
                    { done: false, label: "Deploy to production",      status: "Pending",   sc: "text-amber-600 bg-amber-500/10",   priority: "Low",    pc: "text-primary bg-primary/10" },
                  ].map(({ done, label, status, sc, priority, pc }, i) => (
                    <div key={label} className={`flex items-center gap-3 px-4 py-3 text-xs ${i < 2 ? "border-b border-border" : ""} ${i === 1 ? "bg-primary/[0.02]" : ""}`}>
                      <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded ${done ? "bg-primary" : "border-2 border-border"}`}>
                        {done && <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <span className={`flex-1 ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>{label}</span>
                      <span className={`rounded-full px-2 py-0.5 font-medium ${sc}`}>{status}</span>
                      <span className={`rounded-full px-2 py-0.5 font-medium ${pc}`}>{priority}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
  )
}

export default DashboardPreview