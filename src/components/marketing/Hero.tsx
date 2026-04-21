import Link from "next/link";

const mockClaims = [
  {
    pro: "PRO-847291",
    carrier: "FedEx Freight",
    type: "Damage",
    value: "$4,200",
    status: "ready",
    deadline: null,
  },
  {
    pro: "PRO-831044",
    carrier: "Old Dominion",
    type: "Shortage",
    value: "$1,840",
    status: "draft",
    deadline: "8d",
  },
  {
    pro: "PRO-829003",
    carrier: "XPO Logistics",
    type: "Loss",
    value: "$8,750",
    status: "review",
    deadline: null,
  },
  {
    pro: "PRO-812445",
    carrier: "Estes Express",
    type: "Damage",
    value: "$2,100",
    status: "pending",
    deadline: "14d",
  },
  {
    pro: "PRO-808012",
    carrier: "ABF Freight",
    type: "Shortage",
    value: "$960",
    status: "draft",
    deadline: "21d",
  },
];

const statusConfig: Record<string, { label: string; cls: string }> = {
  ready:   { label: "Ready",     cls: "bg-emerald-950/70 text-emerald-400 border border-emerald-900" },
  draft:   { label: "Draft",     cls: "bg-zinc-800/60 text-zinc-400 border border-zinc-700/60" },
  review:  { label: "In Review", cls: "bg-amber-950/70 text-amber-400 border border-amber-900" },
  pending: { label: "Pending",   cls: "bg-sky-950/70 text-sky-400 border border-sky-900" },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#09090B]">
      {/* Atmospheric glow — tight top-center, not diffuse */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px]"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 48% -8%, rgb(192 16 40 / 0.11) 0%, transparent 62%)",
        }}
      />
      {/* Very faint grid — lower opacity, larger cells */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl w-full px-6 lg:px-8 pt-36 pb-20 lg:pt-0 lg:pb-0">
        <div className="lg:grid lg:grid-cols-[1fr_500px] lg:gap-14 xl:gap-20 lg:items-center lg:min-h-screen">

          {/* ── Left: Content ──────────────────────────────────── */}
          <div>
            {/* Eyebrow */}
            <div className="animate-fade-up flex items-center gap-3 mb-8">
              <span className="h-px w-10 bg-[#C01028]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#C01028]">
                Freight Claims Recovery Infrastructure
              </span>
            </div>

            {/* Headline — two intentionally different weights */}
            <h1 className="animate-fade-up-delay-1">
              <span className="block text-[58px] sm:text-[72px] lg:text-[80px] xl:text-[92px] font-bold leading-[0.96] tracking-[-0.03em] text-white">
                Freight Claims
                <br />Recovery.
              </span>
              <span className="mt-3 block text-[30px] sm:text-[36px] lg:text-[40px] xl:text-[46px] font-semibold leading-[1.05] tracking-[-0.02em] text-zinc-500">
                Centralized. Submitted.
                <br />Recovered.
              </span>
            </h1>

            {/* Sub */}
            <p className="animate-fade-up-delay-2 mt-8 text-[16px] lg:text-[17px] leading-[1.7] text-zinc-400 max-w-[500px]">
              Most claims teams carry significant annual exposure across email
              threads, carrier portals, and shared spreadsheets—with no central
              record and no deadline enforcement. AerisClaim changes that.
            </p>

            {/* CTAs */}
            <div className="animate-fade-up-delay-3 mt-10 flex flex-wrap items-center gap-3">
              <Link
                href="#demo"
                className="inline-flex items-center gap-2 bg-[#C01028] hover:bg-[#A00C22] text-white text-[13px] font-semibold px-6 py-[11px] rounded-sm transition-colors duration-150"
              >
                Book a Demo
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                  <path d="M2.5 6.5H10.5M10.5 6.5L7.5 3.5M10.5 6.5L7.5 9.5"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                href="#platform"
                className="inline-flex items-center gap-2 border border-zinc-700/80 hover:border-zinc-600 text-zinc-400 hover:text-zinc-200 text-[13px] font-medium px-6 py-[11px] rounded-sm transition-all duration-150"
              >
                See the Platform
              </Link>
            </div>
          </div>

          {/* ── Right: Claims Pipeline UI ───────────────────────── */}
          <div className="animate-fade-in hidden lg:block mt-8 lg:mt-0">
            <div className="relative">
              {/* Glow behind panel */}
              <div
                aria-hidden="true"
                className="absolute -inset-8 rounded-2xl pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 90% 70% at 50% 50%, rgb(192 16 40 / 0.055) 0%, transparent 68%)",
                }}
              />

              {/* Main panel */}
              <div className="relative rounded-lg border border-[#27272F] bg-[#0E0E12] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)]">

                {/* App chrome — tab strip */}
                <div className="flex items-center gap-0 border-b border-[#1E1E26] bg-[#0B0B0F]">
                  <div className="flex items-center gap-1.5 px-4 py-2.5 border-r border-[#1E1E26]">
                    <span className="h-2 w-2 rounded-full bg-zinc-700" />
                    <span className="h-2 w-2 rounded-full bg-zinc-700" />
                    <span className="h-2 w-2 rounded-full bg-zinc-700" />
                  </div>
                  {["Claims", "Shipments", "Reports"].map((tab, i) => (
                    <button
                      key={tab}
                      type="button"
                      className={`px-4 py-2.5 text-[11px] font-medium border-r border-[#1E1E26] transition-colors ${
                        i === 0
                          ? "text-zinc-200 bg-[#111115]"
                          : "text-zinc-600 hover:text-zinc-400"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                  <div className="flex-1" />
                  <div className="flex items-center gap-1.5 px-4">
                    <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#C01028]" />
                    <span className="text-[10px] text-[#C01028] font-medium">3 active</span>
                  </div>
                </div>

                {/* Pipeline header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E1E26]">
                  <span className="text-[11px] font-semibold text-zinc-300 tracking-wide">Claims Pipeline</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-medium uppercase tracking-widest text-zinc-700 border border-[#27272F] px-2 py-0.5 rounded-sm">All</span>
                    <span className="text-[9px] font-medium uppercase tracking-widest text-zinc-500 bg-[#27272F]/60 border border-[#33333E] px-2 py-0.5 rounded-sm">Active</span>
                  </div>
                </div>

                {/* Column headers */}
                <div className="grid grid-cols-[88px_1fr_60px_64px_86px] gap-x-3 px-4 py-2 border-b border-[#1E1E26]">
                  {["PRO #", "CARRIER", "TYPE", "VALUE", "STATUS"].map((h) => (
                    <span key={h} className="text-[9px] font-bold uppercase tracking-[0.14em] text-zinc-700">
                      {h}
                    </span>
                  ))}
                </div>

                {/* Rows */}
                {mockClaims.map((claim, i) => (
                  <div
                    key={claim.pro}
                    className={`grid grid-cols-[88px_1fr_60px_64px_86px] gap-x-3 px-4 py-2.5 border-b border-[#1E1E26] last:border-0 ${
                      i === 0 ? "bg-[rgb(192_16_40/0.035)]" : "hover:bg-[#111118] transition-colors"
                    }`}
                  >
                    <span className="font-mono text-[10px] text-zinc-400 truncate">{claim.pro}</span>
                    <span className="text-[11px] text-zinc-400 truncate">{claim.carrier}</span>
                    <span className="text-[11px] text-zinc-600">{claim.type}</span>
                    <span className="text-[11px] font-medium text-zinc-300">{claim.value}</span>
                    <div className="flex items-center gap-1">
                      <span className={`text-[8px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-sm ${statusConfig[claim.status].cls}`}>
                        {statusConfig[claim.status].label}
                      </span>
                      {claim.deadline && (
                        <span className="text-[9px] font-medium text-amber-600">⚠{claim.deadline}</span>
                      )}
                    </div>
                  </div>
                ))}

                {/* Footer summary */}
                <div className="grid grid-cols-3 divide-x divide-[#1E1E26] bg-[#0B0B0F] border-t border-[#1E1E26]">
                  {[
                    { label: "MTD Recovery", value: "$47,230", color: "text-emerald-400" },
                    { label: "Open Exposure", value: "$22,890", color: "text-zinc-300" },
                    { label: "Claims Filed",  value: "24 this month", color: "text-zinc-300" },
                  ].map((s) => (
                    <div key={s.label} className="px-4 py-3">
                      <p className="text-[9px] font-semibold uppercase tracking-widest text-zinc-700 mb-1">{s.label}</p>
                      <p className={`text-[13px] font-semibold ${s.color}`}>{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating deadline card — lower left, slightly overlapping */}
              <div className="absolute -bottom-4 -left-7 z-10 rounded-md border border-[#27272F] bg-[#0E0E12]/98 px-3.5 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-zinc-600 mb-1">Deadline Alert</p>
                <p className="text-[11px] font-semibold text-[#C01028] leading-none">8 days remaining</p>
                <p className="text-[10px] text-zinc-600 mt-1">Old Dominion · PRO-831044 · $1,840</p>
              </div>

              {/* Subtle right-side annotation */}
              <div className="absolute -right-5 top-1/3 z-10 rounded-md border border-[#27272F] bg-[#0E0E12]/98 px-3 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-zinc-600 mb-1">Evidence</p>
                <p className="text-[11px] font-semibold text-zinc-300">4 / 5 docs verified</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 inset-x-0 h-28"
        style={{ background: "linear-gradient(to top, #09090B, transparent)" }}
      />
    </section>
  );
}
