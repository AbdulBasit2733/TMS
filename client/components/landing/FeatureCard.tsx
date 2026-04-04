function FeatureCard({
  icon, title, description, children, wide,
}: {
  icon: React.ReactNode
  title: string
  description: string
  children?: React.ReactNode
  wide?: boolean
}) {
  return (
    <div className={`group relative overflow-hidden rounded-2xl border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_20px_60px_oklch(0.70_0.19_43/0.10)] ${wide ? "md:col-span-2" : ""}`}>
      <div className="absolute top-0 right-0 h-48 w-48 -translate-y-1/3 translate-x-1/3 rounded-full bg-primary/5 transition-all duration-500 group-hover:scale-150 group-hover:bg-primary/8" />
      <div className="relative">
        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">{icon}</div>
        <h3 className="mb-2 font-semibold text-foreground">{title}</h3>
        <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{description}</p>
        {children}
      </div>
    </div>
  )
}
export default FeatureCard