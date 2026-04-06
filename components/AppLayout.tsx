"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Zap, BookOpen, Users, Award } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
};

const navItems: NavItem[] = [
  {
    label: "Create with AI",
    href: "/",
    icon: <Zap className="h-4 w-4" />,
  },
  {
    label: "My Learning",
    href: "/dashboard",
    icon: <BookOpen className="h-4 w-4" />,
    badge: "new",
  },
  {
    label: "Explore",
    href: "/explore",
    icon: <Users className="h-4 w-4" />,
  },
  {
    label: "Staff Picks",
    href: "/explore?category=Tech",
    icon: <Award className="h-4 w-4" />,
  },
];

type Props = {
  children: React.ReactNode;
  currentHref?: string;
};

export default function AppLayout({ children, currentHref = "/" }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="grid min-h-screen grid-cols-1 gap-4 md:grid-cols-[auto_1fr]">
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-slate-900 p-2 md:hidden"
      >
        {sidebarOpen ? (
          <X className="h-5 w-5 text-slate-100" />
        ) : (
          <Menu className="h-5 w-5 text-slate-100" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-40 h-screen w-64 transform bg-slate-950 px-4 py-6 transition-transform md:pointer-events-auto md:static md:transform-none md:bg-transparent md:p-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="pointer-events-auto mb-8">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-300" />
            <div>
              <p className="text-xs uppercase tracking-wider text-cyan-300">
                RoadmapAI
              </p>
              <p className="text-sm font-bold text-slate-100">Learning</p>
            </div>
          </Link>
        </div>

        <nav className="pointer-events-auto space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                currentHref === item.href
                  ? "border-l-2 border-cyan-400 bg-cyan-400/10 text-cyan-100"
                  : "text-slate-300 hover:bg-slate-900/50",
              )}
            >
              <span className="flex items-center gap-3">
                {item.icon}
                {item.label}
              </span>
              {item.badge && (
                <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-semibold text-slate-900">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="pointer-events-auto mt-8 border-t border-slate-700 pt-4">
          <Link
            href="/auth"
            className="block rounded-lg border border-cyan-500/60 bg-cyan-500/10 px-3 py-2 text-center text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/20"
            onClick={() => setSidebarOpen(false)}
          >
            Log in
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="relative overflow-hidden pt-12 md:pt-0">{children}</main>
    </div>
  );
}
