const steps = [
  {
    n: "1",
    title: "Ingest Shipment & Document Data",
    body: "Import shipment records via CSV or create them manually. Upload BOLs, PODs, damage photos, invoices, and carrier emails. AerisClaim classifies and extracts structured data from every document.",
    aside: ["LTL shipments", "Multi-carrier", "Bulk CSV", "Manual entry"],
  },
  {
    n: "2",
    title: "Review Candidates & Build Evidence",
    body: "The system surfaces claimable events ranked by value and deadline urgency. Operators review each evidence bundle, confirm completeness, and convert candidates into active claims.",
    aside: ["Review queue", "Evidence checklist", "Candidate scoring"],
  },
  {
    n: "3",
    title: "Draft, Approve & Submit",
    body: "AI drafts the claim narrative using extracted document data and carrier-specific requirements. Operators review and approve before anything is sent. The system prepares the complete packet per carrier submission instructions.",
    aside: ["AI narrative", "Human approval required", "Carrier routing"],
  },
  {
    n: "4",
    title: "Track, Respond & Report Recovery",
    body: "Carrier responses, follow-ups, denials, appeals, and final settlements are tracked in one place. Recovery reports give finance a clear view of recovered dollars, open exposure, and claim performance—no manual aggregation required.",
    aside: ["Audit log", "Appeal workflow", "Finance report"],
  },
];

export default function Workflow() {
  return (
    <section id="workflow" className="relative py-28 lg:py-40 bg-[#111115]">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#27272F] to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#27272F] to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-7">
          <span className="h-px w-6 bg-zinc-700" />
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-500">
            How It Works
          </span>
        </div>

        <div className="lg:grid lg:grid-cols-[1fr_340px] lg:gap-20 lg:items-end mb-16">
          <h2 className="text-[36px] sm:text-[44px] lg:text-[48px] font-bold leading-[1.08] tracking-[-0.025em] text-white">
            A Disciplined Process,
            <br />Without Exception.
          </h2>
          <p className="mt-5 lg:mt-0 text-[15px] text-zinc-500 leading-relaxed">
            AerisClaim enforces a structured workflow across every claim—so nothing is missed,
            nothing expires, and every action is permanently logged.
          </p>
        </div>

        {/* Steps */}
        <div>
          {steps.map((step) => (
            <div
              key={step.n}
              className="group grid lg:grid-cols-[56px_1fr] gap-6 lg:gap-10 py-9 border-t border-[#27272F] last:border-b"
            >
              {/* Step number */}
              <div className="flex items-start pt-0.5">
                <span className="font-mono text-[11px] font-bold text-zinc-700 w-8 group-hover:text-zinc-500 transition-colors duration-200">
                  0{step.n}
                </span>
              </div>

              {/* Content */}
              <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-16 lg:items-start">
                <div>
                  <h3 className="text-[17px] font-semibold text-zinc-200 mb-3 leading-snug group-hover:text-white transition-colors duration-200">
                    {step.title}
                  </h3>
                  <p className="text-[14px] text-zinc-500 leading-relaxed">{step.body}</p>
                </div>

                {/* Aside — tags as small detail items */}
                <div className="mt-5 lg:mt-0 border-t lg:border-t-0 lg:border-l border-[#27272F] pt-5 lg:pt-0 lg:pl-8 flex lg:flex-col gap-2 flex-wrap">
                  {step.aside.map((a) => (
                    <span
                      key={a}
                      className="text-[10px] font-medium text-zinc-600 whitespace-nowrap"
                    >
                      {a}
                    </span>
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
