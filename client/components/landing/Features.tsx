import React from 'react'
import FeatureCard from './FeatureCard'
import { CalendarIcon, ChartIcon, LockIcon, SearchIcon, TaskIcon } from '@/icons/icons'

const Features: React.FC = () => {
  return (
       <section id="features" className="px-6 py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <div className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Everything you need</div>
              <h2 className="mb-4 font-bold tracking-tight text-foreground" style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}>
                Built for how you actually work
              </h2>
              <p className="mx-auto max-w-xl text-[1.0625rem] leading-relaxed text-muted-foreground">
                Every feature is designed around your daily workflow — fast to create, easy to track, satisfying to complete.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {/* Wide card */}
              <FeatureCard wide icon={<TaskIcon />} title="Full CRUD Task Management" description="Create, view, edit, and delete tasks with rich metadata — title, description, priority levels, and completion status all in one place.">
                <div className="space-y-2">
                  {[
                    { done: true,  label: "Set up PostgreSQL database", priority: "Low",    pc: "text-primary bg-primary/10" },
                    { done: false, label: "Build authentication API",   priority: "High",   pc: "text-red-600 bg-red-500/10" },
                    { done: false, label: "Design landing page",        priority: "Medium", pc: "text-amber-600 bg-amber-500/12" },
                  ].map(({ done, label, priority, pc }) => (
                    <div key={label} className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-2.5 text-sm">
                      <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded ${done ? "bg-primary" : "border-2 border-primary"}`}>
                        {done && <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <span className={`flex-1 ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>{label}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${pc}`}>{priority}</span>
                    </div>
                  ))}
                </div>
              </FeatureCard>

              <FeatureCard icon={<LockIcon />} title="Secure JWT Auth" description="HttpOnly cookie-based access + refresh tokens. Your session is secure and auto-renews silently.">
                <div className="mt-1 space-y-2">
                  {[["Access token", 30], ["Refresh token", 78]] .map(([label, pct]) => (
                    <div key={label as string} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                        <div className="h-1.5 rounded-full bg-primary" style={{ width: `${pct}%` }} />
                      </div>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </FeatureCard>

              <FeatureCard icon={<SearchIcon />} title="Search & Filter" description="Instantly search by title, filter by status or priority. Pagination keeps large lists snappy.">
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">All</span>
                  {["Pending", "High", "Medium"].map((t) => (
                    <span key={t} className="rounded-full bg-accent px-2.5 py-1 text-xs text-muted-foreground">{t}</span>
                  ))}
                </div>
              </FeatureCard>

              <FeatureCard icon={<CalendarIcon />} title="Date Tracking" description="Set start, target, and end dates per task. Visualize timelines and stay on schedule.">
                <div className="mt-1 space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex justify-between"><span>Start</span><span className="text-foreground">Apr 1, 2026</span></div>
                  <div className="flex justify-between"><span>Target</span><span className="font-semibold text-primary">Apr 15, 2026</span></div>
                  <div className="flex justify-between"><span>End</span><span className="text-foreground">Apr 30, 2026</span></div>
                </div>
              </FeatureCard>

              <FeatureCard icon={<ChartIcon />} title="Live Stats Dashboard" description="Total, pending, and completed counts at a glance. Your progress, always visible.">
                <div className="mt-1 flex gap-2">
                  {[
                    { n: 12, label: "Total",   c: "text-primary",      bg: "bg-accent" },
                    { n: 7,  label: "Pending", c: "text-amber-600",    bg: "bg-amber-500/10" },
                    { n: 5,  label: "Done",    c: "text-emerald-600",  bg: "bg-emerald-500/10" },
                  ].map(({ n, label, c, bg }) => (
                    <div key={label} className={`flex-1 rounded-lg p-2 text-center ${bg}`}>
                      <div className={`text-lg font-bold tabular-nums ${c}`}>{n}</div>
                      <div className="text-xs text-muted-foreground">{label}</div>
                    </div>
                  ))}
                </div>
              </FeatureCard>
            </div>
          </div>
        </section>
  )
}

export default Features