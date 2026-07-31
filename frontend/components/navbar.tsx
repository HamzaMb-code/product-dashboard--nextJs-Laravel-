"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogOut, Sparkles } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => typeof window !== "undefined" && Boolean(localStorage.getItem("token"))
  );

  useEffect(() => {
    const syncAuthState = () => setIsAuthenticated(Boolean(localStorage.getItem("token")));
    const timer = window.setTimeout(syncAuthState, 0);

    window.addEventListener("storage", syncAuthState);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("storage", syncAuthState);
    };
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-background/85 shadow-sm shadow-black/5 backdrop-blur-xl">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="group flex items-center gap-2 font-bold tracking-tight text-black transition-opacity hover:opacity-80"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-black text-primary-foreground shadow-md shadow-black/20 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105">
            <Sparkles className="size-4 animate-soft-pulse" aria-hidden="true" />
          </span>
          <span>Next Laravel</span>
        </Link>

        {isAuthenticated && <div className="hidden items-center gap-1 sm:flex"><Link href="/dashboard" className="inline-flex h-9 items-center gap-2 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-all hover:bg-black hover:text-white"><LayoutDashboard className="size-4" aria-hidden="true" />Dashboard</Link></div>}

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <Link href="/logout" className="inline-flex h-9 items-center gap-2 rounded-xl border border-black/10 px-3 text-sm font-medium text-muted-foreground transition-all hover:bg-black hover:text-white"><LogOut className="size-4" aria-hidden="true" /><span>Logout</span></Link>
          ) : (
            <>
              <Link href="/login" className="inline-flex h-9 items-center justify-center rounded-xl px-3 text-sm font-medium text-muted-foreground transition-all hover:bg-black hover:text-white">Sign in</Link>
              <Link href="/register" className="inline-flex h-9 items-center justify-center rounded-xl bg-black px-4 text-sm font-semibold text-white shadow-md shadow-black/20 transition-all hover:-translate-y-0.5 hover:bg-black/80 hover:shadow-lg hover:shadow-black/25">Get started</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
