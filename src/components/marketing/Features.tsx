const primary = [
  {
    tag: "Intake",
    title: "Document Ingestion & Classification",
    body: "Every document that touches a shipment—BOL, POD, photo, invoice, carrier email—is captured, classified, and linked automatically. Your team stops routing PDFs and starts reviewing evidence.",
  },
  {
    tag: "Intelligence",
    title: "Claim Candidate Detection",
    body: "Stop guessing which shipments have claimable events. AerisClaim scores and ranks candidates by value and deadline urgency—so your team works the highest-recovery claims first, not the most recent ones.",
  },
];

const featured = {
  tag: "Operations",
  title: "Claim Workspace",
  body: "Every claim gets a structured workspace—source documents, extracted evidence, a completeness checklist, and an AI-drafted narrative. Operators review, edit, and approve before anything goes out. Nothing leaves without a human sign-off.",
  builtIn: [
    "No claim filed without a complete evidence bundle",
    "Every AI-drafted narrative reviewed before submission",
    "Carrier-specific format and requirements enforced",
    "Submission record and timestamp logged automatically",
    "Full audit trail on every edit and state change",
  ],
};

const secondary = [
  {
    tag: "Compliance",
    title: "Deadline & Status Engine",
    body: "Filing windows enforced automatically by carrier and claim type. No spreadsheet to maintain. No deadline missed because someone was out of the office or working the wrong queue.",
  },
  {
    tag: "Submission",
    title: "Carrier Submission Routing",
    body: "Your team stops looking up submission instructions for every carrier. Profiles define what each carrier requires, how to reach them, and what format they accept—enforced per claim.",
  },
  {
    tag: "Reporting",
    title: "Recovery Reporting",
    body: "Finance gets a report they can actually present—recovered dollars, open exposure, cycle time, fee reconciliation, and write-off prevention—formatted for executive review, not just the claims team.",
  },
];

function Tag({ label }: { label: string }) {
  return (
    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-700 border border-[#27272F] px-2 py-0.5 rounded-sm">
      {label}
    </span>
  );
}

export default function Features() {
  return (
    <section id="features" className="relative py-28 lg:py-40 bg-[#09090B]">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#27272F] to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-7">
          <span className="h-px w-6 bg-zinc-700" />
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-500">
            Capabilities
          </span>
        </div>

        <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-16 lg:items-end mb-14">
          <h2 className="text-[36px] sm:text-[44px] lg:text-[48px] xl:text-[52px] font-bold leading-[1.08] tracking-[-0.025em] text-white">
            Six Systems.
            <br />One Platform.
          </h2>
          <p className="mt-5 lg:mt-0 text-[15px] text-zinc-500 leading-relaxed">
            Every capability is purpose-built for freight claims operations—not adapted
            from generic case management or ticketing software.
          </p>
        </div>

        {/* Unified bordered grid */}
        <div className="border border-[#27272F]">

          {/* ── Row 1: Two equal-width cards ──────────────────── */}
          <div className="grid sm:grid-cols-2 divide-x divide-[#27272F] border-b border-[#27272F]">
            {primary.map((cap) => (
              <div
                key={cap.title}
                className="group bg-[#09090B] hover:bg-[#0D0D11] transition-colors duration-200 p-8"
              >
                <Tag label={cap.tag} />
                <h3 className="mt-5 text-[15px] font-semibold text-white leading-snug mb-3">
                  {cap.title}
                </h3>
                <p className="text-[13px] text-zinc-500 leading-relaxed">{cap.body}</p>
              </div>
            ))}
          </div>

          {/* ── Row 2: Featured full-width — Claim Workspace ───── */}
          <div className="bg-[#111115] border-b border-[#27272F] p-8 lg:p-10 group hover:bg-[#131318] transition-colors duration-200">
            <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-16 lg:items-start">
              <div>
                <Tag label={featured.tag} />
                <h3 className="mt-5 text-[18px] font-semibold text-white leading-snug mb-4">
                  {featured.title}
                </h3>
                <p className="text-[14px] text-zinc-400 leading-relaxed">{featured.body}</p>
              </div>
              <div className="mt-6 lg:mt-0 border-t lg:border-t-0 lg:border-l border-[#27272F] pt-6 lg:pt-0 lg:pl-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-600 mb-4">
                  By design
                </p>
                <div className="space-y-2.5">
                  {featured.builtIn.map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <span className="mt-[7px] h-px w-3 shrink-0 bg-zinc-700" />
                      <span className="text-[12px] text-zinc-500 leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Row 3: Three secondary cards ──────────────────── */}
          <div className="grid sm:grid-cols-3 divide-x divide-[#27272F]">
            {secondary.map((cap) => (
              <div
                key={cap.title}
                className="group bg-[#09090B] hover:bg-[#0D0D11] transition-colors duration-200 p-7"
              >
                <Tag label={cap.tag} />
                <h3 className="mt-5 text-[14px] font-semibold text-white leading-snug mb-3">
                  {cap.title}
                </h3>
                <p className="text-[13px] text-zinc-500 leading-relaxed">{cap.body}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
