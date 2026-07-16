import Link from "next/link";

type AppShellProps = {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
};

const nav = [
  { href: "/", label: "대시보드" },
  { href: "/students", label: "학생" },
  { href: "/students/new", label: "학생 등록" },
];

export function AppShell({
  children,
  title,
  subtitle,
  actions,
}: AppShellProps) {
  return (
    <div className="min-h-full bg-[var(--canvas)] text-[var(--ink)]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(46,123,122,0.14),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(196,122,74,0.12),transparent_35%)]" />
      <div className="relative mx-auto flex min-h-full w-full max-w-6xl flex-col gap-8 px-4 py-6 md:px-8 md:py-10">
        <header className="flex flex-col gap-6 border-b border-[var(--line)] pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.18em] text-[var(--accent)] uppercase">
              Hanol Academy
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight md:text-4xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)] md:text-base">
                {subtitle}
              </p>
            ) : null}
          </div>
          <nav className="flex flex-wrap gap-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-[var(--line)] bg-white/80 px-4 py-2 text-sm font-medium text-[var(--ink)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}

        <main className="flex-1 pb-10">{children}</main>
      </div>
    </div>
  );
}
