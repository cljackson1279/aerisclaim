const personas = [
  {
    role: "Claims Manager",
    subtitle: "Operations & Filing",
    headline: "Stop chasing evidence across email. File complete packets, every time.",
    outcomes: [
      "Evidence bundle verified before every submission—no manual checklist",
      "AI-drafted narratives ready for review, not written from scratch each filing",
      "Deadlines tracked per carrier automatically—no calendar to maintain",
      "Appeal workflow built in when carriers deny, underpay, or request more documentation",
    ],
  },
  {
    role: "VP Logistics",
    subtitle: "Operations Leadership",
    headline: "Full visibility into exposure, deadlines, and carrier performance across your network.",
    outcomes: [
      "Open exposure by carrier, claim type, and aging—without a status meeting",
      "Deadline risk surfaced before windows close, not after",
      "Carrier denial rate and settlement rate tracked per claim type over time",
      "Claims throughput measurable from a single view—no manual aggregation",
    ],
  },
  {
    role: "CFO / Finance",
    subtitle: "Financial Oversight",
    headline: "Recovery results documented well enough to present to a board, not just a spreadsheet.",
    outcomes: [
      "Every recovered dollar logged with audit trail, submission records, and carrier correspondence",
      "Write-off prevention built into the workflow—not a manual override",
      "Fee reconciliation included in every reporting cycle with transparent source data",
      "Monthly and quarterly recovery summaries formatted for executive review, ready to export",
    ],
  },
];

export default function Personas() {
  return (
    <section className="relative py-28 lg:py-40 bg-[#0E0E12]">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#27272F] to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#27272F] to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="lg:grid lg:grid-cols-[1fr_420px] lg:gap-20 lg:items-end mb-16">
          <h2 className="text-[36px] sm:text-[44px] lg:text-[48px] font-bold leading-[1.08] tracking-[-0.025em] text-white">
            What AerisClaim Means
            <br />for Your Team.
          </h2>
          <p className="mt-5 lg:mt-0 text-[15px] text-zinc-500 leading-relaxed">
            Freight claims touch operations, finance, and executive leadership differently.
            AerisClaim is built so every stakeholder gets the clarity they need.
          </p>
        </div>

        {/* Persona rows */}
        <div className="border-t border-[#27272F]">
          {personas.map((p) => (
            <div
              key={p.role}
              className="group py-10 lg:py-12 border-b border-[#27272F] lg:grid lg:grid-cols-[220px_1fr] lg:gap-16"
            >
              {/* Left: role */}
              <div className="mb-6 lg:mb-0 lg:pt-0.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 mb-1">
                  {p.role}
                </p>
                <p className="text-[11px] text-zinc-700">{p.subtitle}</p>
              </div>

              {/* Right: headline + outcomes */}
              <div>
                <p className="text-[17px] font-semibold text-zinc-200 mb-7 leading-snug group-hover:text-white transition-colors duration-200 max-w-[560px]">
                  {p.headline}
                </p>
                <div className="grid sm:grid-cols-2 gap-x-12 gap-y-3">
                  {p.outcomes.map((o) => (
                    <div key={o} className="flex items-start gap-3">
                      <span className="mt-[6px] h-px w-4 shrink-0 bg-zinc-700" />
                      <span className="text-[13px] text-zinc-500 leading-snug">{o}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
