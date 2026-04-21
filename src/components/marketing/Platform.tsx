const stages = [
  {
    step: "01",
    name: "Ingest",
    summary: "Shipment records, BOLs, PODs, photos, invoices, and carrier correspondence—uploaded, classified, and linked.",
    tags: ["BOL / POD", "Photos", "Invoices", "Emails", "CSV Import"],
  },
  {
    step: "02",
    name: "Identify",
    summary: "System surfaces claimable events with confidence scores, estimated values, and evidence completeness assessments.",
    tags: ["Candidate Generation", "Confidence Score", "Evidence Gaps", "Value Estimate"],
  },
  {
    step: "03",
    name: "Prepare",
    summary: "Per-claim evidence bundles assembled. AI drafts claim narratives. Operators review, edit, and approve before any packet leaves the system.",
    tags: ["Evidence Bundle", "AI Draft", "Operator Review", "Approval Gate"],
  },
  {
    step: "04",
    name: "Submit",
    summary: "Carrier-specific submission routing. Email, portal, API, or manual—determined by carrier profile, not tribal knowledge.",
    tags: ["Carrier Routing", "Packet Prep", "Submission Record", "Timestamp"],
  },
  {
    step: "05",
    name: "Track",
    summary: "Acknowledgements, carrier responses, follow-up tasks, denials, and appeals—all tracked in one place with clear next-action state.",
    tags: ["Deadlines", "Responses", "Follow-ups", "Appeals"],
  },
  {
    step: "06",
    name: "Recover",
    summary: "Settlement outcomes recorded. Finance-ready recovery reports generated. Every dollar documented with full audit trail.",
    tags: ["Settlement", "Reporting", "Audit Log", "Fee Reconciliation"],
    terminal: true,
  },
];

export default function Platform() {
  return (
    <section id="platform" className="relative py-28 lg:py-40 bg-[#111115]">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#27272F] to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#27272F] to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[5fr_7fr] lg:gap-20 xl:gap-24 lg:items-start">

          {/* ── Left: Header — zinc label, not red ──────────── */}
          <div className="mb-14 lg:mb-0 lg:sticky lg:top-32">
            <div className="flex items-center gap-3 mb-7">
              <span className="h-px w-6 bg-zinc-700" />
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-500">
                The Platform
              </span>
            </div>

            <h2 className="text-[36px] sm:text-[44px] lg:text-[40px] xl:text-[50px] font-bold leading-[1.08] tracking-[-0.025em] text-white mb-6">
              End-to-End
              <br />Claims Infrastructure
            </h2>

            <p className="text-[15px] text-zinc-500 leading-relaxed mb-10 max-w-[340px]">
              AerisClaim isn&apos;t a form submission tool. It&apos;s an operating system
              covering every stage from first document upload to final settlement—
              carrier-aware, deadline-driven, and audit-ready throughout.
            </p>

            <div className="border border-[#27272F] p-5 rounded-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 mb-3">
                Designed for
              </p>
              <div className="space-y-1.5">
                {["LTL Shippers", "Distributors", "3PLs & Brokers", "Enterprise Logistics Teams"].map((t) => (
                  <div key={t} className="flex items-center gap-2.5">
                    <span className="h-px w-3 bg-zinc-700" />
                    <span className="text-[13px] text-zinc-400">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Operational stage table ──────────────── */}
          <div>
            {/* Table header */}
            <div className="grid grid-cols-[36px_80px_1fr] gap-4 pb-3 border-b border-[#27272F] mb-0">
              {["", "STAGE", "DETAILS"].map((h, i) => (
                <span
                  key={i}
                  className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-700"
                >
                  {h}
                </span>
              ))}
            </div>

            {/* Stage rows */}
            <div>
              {stages.map((s) => (
                <div
                  key={s.step}
                  className={`group grid grid-cols-[36px_80px_1fr] gap-4 py-6 border-b border-[#1E1E26] hover:bg-[#161620] transition-colors duration-150 ${
                    s.terminal ? "hover:bg-[#13131A]" : ""
                  }`}
                >
                  {/* Step number */}
                  <span className="font-mono text-[10px] font-bold text-zinc-700 mt-0.5 group-hover:text-zinc-500 transition-colors">
                    {s.step}
                  </span>

                  {/* Stage name */}
                  <div className="mt-0.5">
                    <span
                      className={`text-[13px] font-semibold tracking-wide ${
                        s.terminal ? "text-white" : "text-zinc-300"
                      }`}
                    >
                      {s.name}
                    </span>
                    {s.terminal && (
                      <span className="ml-2 inline-block text-[8px] font-bold uppercase tracking-widest text-zinc-700 border border-[#27272F] px-1.5 py-0.5 rounded-sm align-middle">
                        Goal
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div>
                    <p className="text-[13px] text-zinc-500 leading-relaxed mb-3">
                      {s.summary}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {s.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-[9px] font-semibold uppercase tracking-[0.12em] px-2 py-0.5 rounded-sm border ${
                            s.terminal
                              ? "text-zinc-400 border-zinc-700/80 bg-zinc-800/30"
                              : "text-zinc-600 border-[#27272F] bg-transparent"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
