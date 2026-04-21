const metrics = [
  {
    value: "100%",
    label: "of filing deadlines tracked and enforced",
    detail: "Deadline monitoring runs by carrier, claim type, and filing method. When a window is at risk, the system surfaces it—before it closes, not after.",
    forWhom: "Operations",
  },
  {
    value: "< 48 hrs",
    label: "upload to submission-ready packet",
    detail: "For standard LTL damage and shortage claims with documentation in place. AI extraction and draft generation compress manual assembly from days into hours.",
    forWhom: "Claims Manager",
  },
  {
    value: "Every dollar",
    label: "recovered is documented from intake to settlement",
    detail: "Recovery reports include evidence lineage, submission records, carrier correspondence, and settlement terms—a complete record, not a summary.",
    forWhom: "Finance",
  },
  {
    value: "Zero",
    label: "ambiguous claim statuses in the system",
    detail: "Every claim has a structured, explicit status. Transitions are logged—no 'in progress' black holes, no claims that disappear between steps.",
    forWhom: "Leadership",
  },
];

const guarantees = [
  {
    statement: "No claim filed without a complete, verified evidence bundle",
    who: "Ops",
  },
  {
    statement: "Human review required before any AI-generated packet is sent",
    who: "Compliance",
  },
  {
    statement: "Raw files always preserved alongside normalized extracted data",
    who: "Audit",
  },
  {
    statement: "Finance-exportable reports—not dashboard screenshots",
    who: "Finance",
  },
  {
    statement: "Carrier performance data compounds with every resolved claim",
    who: "Intelligence",
  },
  {
    statement: "No claim closes without a documented outcome on record",
    who: "Governance",
  },
];

export default function Impact() {
  return (
    <section id="impact" className="relative py-28 lg:py-40 bg-[#111115]">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#27272F] to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-7">
          <span className="h-px w-6 bg-zinc-700" />
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-500">
            Business Impact
          </span>
        </div>

        <div className="lg:grid lg:grid-cols-[1fr_400px] lg:gap-20 lg:items-end mb-20">
          <h2 className="text-[36px] sm:text-[44px] lg:text-[48px] font-bold leading-[1.08] tracking-[-0.025em] text-white">
            Recovery That Finance
            <br />Can Verify.
          </h2>
          <p className="mt-5 lg:mt-0 text-[15px] text-zinc-500 leading-relaxed">
            AerisClaim tracks every dollar from first claim to final settlement—with
            documentation rigorous enough for write-off prevention, fee reconciliation,
            and board-level reporting.
          </p>
        </div>

        {/* Metrics — 4-up grid, left-border treatment */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 mb-20">
          {metrics.map((m) => (
            <div
              key={m.value}
              className="border-l border-zinc-800 pl-5 hover:border-zinc-700 transition-colors duration-300 group"
            >
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-700 mb-3">
                {m.forWhom}
              </p>
              <p className="text-[36px] xl:text-[40px] font-bold tracking-[-0.03em] text-white mb-1.5 leading-none">
                {m.value}
              </p>
              <p className="text-[12px] font-semibold text-zinc-400 mb-3 leading-snug">
                {m.label}
              </p>
              <p className="text-[12px] text-zinc-600 leading-relaxed">{m.detail}</p>
            </div>
          ))}
        </div>

        {/* Operational guarantees panel */}
        <div className="border border-[#27272F] bg-[#0E0E12]">
          <div className="border-b border-[#27272F] px-8 py-4 lg:px-10 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
              Operational Guarantees
            </p>
            <p className="text-[10px] text-zinc-700">
              By design — not configuration
            </p>
          </div>
          {/* Clean border grid: container holds left+top, each cell holds right+bottom */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 border-l border-t border-[#27272F]">
            {guarantees.map((g) => (
              <div
                key={g.statement}
                className="px-8 lg:px-10 py-6 flex items-start gap-4 border-r border-b border-[#27272F]"
              >
                <div className="flex items-center gap-2 shrink-0 pt-0.5">
                  <span className="h-1 w-1 rounded-full bg-zinc-700 shrink-0" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-700 whitespace-nowrap">
                    {g.who}
                  </span>
                </div>
                <span className="text-[13px] text-zinc-500 leading-snug">{g.statement}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
