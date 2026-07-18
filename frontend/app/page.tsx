import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-mono p-8 selection:bg-blue-500 selection:text-white">
      {/* Header Grid */}
      <header className="max-w-6xl w-full mx-auto flex justify-between items-center py-6 border-b border-slate-900">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse"></span>
          <span className="font-bold tracking-tight text-white">techspend.ai</span>
        </div>
        <div className="flex gap-4 text-xs">
          <Link href="/login" className="hover:text-blue-400 transition-colors">
            [ Sign In ]
          </Link>
          <Link href="/register" className="text-slate-400 hover:text-white transition-colors">
            [ Onboard Workspace ]
          </Link>
        </div>
      </header>

      {/* Hero content */}
      <main className="max-w-4xl mx-auto flex-1 flex flex-col justify-center items-center text-center my-12">
        <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-4 py-1.5 text-xs text-slate-400 mb-6">
          <span className="bg-blue-500/10 text-blue-400 font-bold px-1.5 py-0.5 rounded text-[10px]">
            ACTIVE v1.0
          </span>
          Enterprise Technology Spend Decision Intelligence
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
          The Bloomberg Terminal for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
            Technology Spend
          </span>
        </h1>

        <p className="max-w-2xl text-slate-400 text-sm md:text-base leading-relaxed mb-10">
          Unify IT Asset Management, SaaS Management, Cloud FinOps, and AI cost guardrails
          into a single decision-centric platform. Transition from passive reporting to active
          financial intelligence.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/register"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-8 py-3 rounded transition-colors shadow-lg shadow-blue-500/10"
          >
            Provision New Org Tenant
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-sm px-8 py-3 rounded transition-all"
          >
            Access Console
          </Link>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="max-w-6xl w-full mx-auto border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div>
          TechSpend AI &copy; 2026. Made for CFOs, CIOs, Procurement and Internal Audit.
        </div>
      </footer>
    </div>
  );
}
