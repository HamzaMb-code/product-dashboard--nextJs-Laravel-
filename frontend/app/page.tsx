import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Move faster",
    description: "A focused workspace that keeps everyday work clear and moving.",
  },
  {
    icon: LayoutDashboard,
    title: "Stay organized",
    description: "Keep the information you need together in one simple dashboard.",
  },
  {
    icon: ShieldCheck,
    title: "Built to be reliable",
    description: "A modern Laravel API and Next.js interface working seamlessly together.",
  },
];

export default function Home() {
  return (
    <main className="overflow-hidden">
      <section className="relative isolate">
        <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_20%_15%,rgba(99,102,241,0.18),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(20,184,166,0.14),transparent_30%)]" />
        <div className="mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-28 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur">
              <Sparkles className="size-4 text-primary" aria-hidden="true" />
              Your work, beautifully organized
            </div>
            <h1 className="mt-7 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
              Build momentum with a workspace that feels effortless.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
              Next Laravel brings your essential tools together in one fast,
              simple place, so you can focus on the work that matters.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-colors hover:bg-primary/85"
              >
                Get started for free
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/login"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-background/80 px-5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Sign in to your account
              </Link>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">
              No credit card required.
            </p>
          </div>

          <div className="relative mx-auto mt-16 max-w-5xl sm:mt-20">
            <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-primary/10 blur-2xl" />
            <div className="overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-2xl shadow-slate-950/10 sm:p-5">
              <div className="rounded-xl border border-border bg-muted/30 p-4 sm:p-6">
                <div className="flex items-center justify-between border-b border-border pb-5">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
                      <LayoutDashboard className="size-4" aria-hidden="true" />
                    </span>
                    <div className="text-left">
                      <p className="text-sm font-semibold">Overview</p>
                      <p className="text-xs text-muted-foreground">Welcome back, Alex</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    All systems go
                  </span>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  {[
                    ["24", "Active projects"],
                    ["86%", "Weekly progress"],
                    ["12", "Tasks completed"],
                  ].map(([value, label]) => (
                    <div key={label} className="rounded-xl border border-border bg-background p-4 text-left">
                      <p className="text-2xl font-semibold tracking-tight">{value}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-xl border border-border bg-background p-4 text-left">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Today&apos;s progress</p>
                    <p className="text-sm font-semibold">72%</p>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-[72%] rounded-full bg-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Made for focus</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Everything you need to make progress.
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                <p className="mt-2 leading-7 text-muted-foreground">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12">
          <CheckCircle2 className="mx-auto size-8" aria-hidden="true" />
          <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to make your next move?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/75">
            Create an account today and start building a more organized workflow.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-background px-5 text-sm font-medium text-foreground transition-transform hover:-translate-y-0.5"
          >
            Create your account
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
