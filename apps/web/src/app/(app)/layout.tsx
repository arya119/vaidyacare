"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Users, 
  UserPlus, 
  Stethoscope, 
  Activity, 
  FileText, 
  Sparkles,
  ShieldCheck,
  Building2
} from "lucide-react";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { label: "Patient Directory", href: "/patients", icon: Users },
    { label: "Register Patient", href: "/patients/new", icon: UserPlus },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900 font-sans antialiased">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-100 flex flex-col justify-between border-r border-slate-800 shadow-xl shrink-0">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-800/80 bg-gradient-to-br from-slate-900 to-teal-950/40">
            <Link href="/patients" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <Stethoscope className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-tight flex items-center gap-1.5 text-white">
                  VaidyaCare
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    EMR
                  </span>
                </h1>
                <p className="text-xs text-slate-400 font-medium">Ayush Clinical Platform</p>
              </div>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Clinical Workflow
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-teal-600 text-white shadow-md shadow-teal-900/30 font-semibold"
                      : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info badge */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 text-xs text-slate-400 space-y-2">
          <div className="flex items-center gap-2 text-teal-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Neon DB Connected</span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>TEAM RAGNOR</span>
            <span className="font-mono text-slate-400">SIH26047</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top bar */}
        <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              ABHA & WHO TM2 Compliant
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/patients/new"
              className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              New Patient
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 md:p-8 max-w-7xl w-full mx-auto flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
