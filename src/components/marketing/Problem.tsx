const problems = [
  {
    n: "01",
    title: "Fragmented Intake",
    body: "Damage reports, PODs, BOLs, photos, and carrier emails live across disconnected inboxes, portals, and shared drives. Without a central record, nothing is prioritized and nothing gets filed.",
    consequence: "Claims that should be filed never make it into a queue. Evidence expires before anyone notices it's missing.",
  },
  {
    n: "02",
    title: "Missed Filing Windows",
    body: "LTL carriers enforce strict deadlines—some as short as 90 days from delivery. Without systematic tracking, windows close unnoticed and the revenue is permanently forfeit.",
    consequence: "Miss one window and the revenue is gone. Carriers enforce their deadlines without exception, and there is no appeal for an expired claim.",
  },
  {
    n: "03",
    title: "Manual Evidence Assembly",
    body: "Building a complete packet per claim—BOL, POD, inspection report, photos, invoice—by hand, per carrier, every time. Hours of effort per claim, with no guarantee of completeness.",
    consequence: "The highest-value claims require the most documentation. They're also the first to be deprioritized when the team is underwater.",
  },
];

export default function Problem() {
  return (
    <section id="problem" className="relative bg-[#09090B] py-28 lg:py-40">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#27272F] to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[5fr_7fr] lg:gap-20 xl:gap-28">

          {/* ── Left: Editorial statement — sticky on scroll ── */}
          <div className="mb-16 lg:mb-0 lg:sticky lg:top-32 lg:self-start">
            <div className="flex items-center gap-3 mb-10">
              <span className="h-px w-8 bg-[#C01028]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#C01028]">
                The Problem
              </span>
            </div>

            <p className="text-[38px] sm:text-[44px] lg:text-[40px] xl:text-[48px] font-bold leading-[1.06] tracking-[-0.025em] text-white mb-6">
              The problem isn&apos;t the claims.
            </p>
            <p className="text-[24px] sm:text-[28px] lg:text-[26px] xl:text-[30px] font-semibold leading-[1.2] tracking-[-0.015em] text-zinc-500 mb-10">
              It&apos;s the absence of a system to manage them.
            </p>

            <p className="text-[15px] text-zinc-500 leading-relaxed max-w-[380px] mb-10">
              Most freight teams carry six-figure annual exposure across email threads,
              shared drives, and carrier portals—with no central record, no deadline
              enforcement, and no reliable measure of what&apos;s being recovered.
            </p>

            {/* Cost-of-inaction callout */}
            <div className="border-l-2 border-[#27272F] pl-5">
              <p className="text-[13px] text-zinc-600 leading-relaxed">
                By the time most teams build a claims process, they&apos;ve already missed
                the filing windows on their best recovery opportunities. The revenue
                doesn&apos;t come back.
              </p>
            </div>
          </div>

          {/* ── Right: Problems with consequence lines ────────── */}
          <div className="border-t border-[#27272F]">
            {problems.map((p) => (
              <div
                key={p.n}
                className="group grid grid-cols-[48px_1fr] gap-6 py-10 border-b border-[#27272F]"
              >
                {/* Number */}
                <div className="pt-0.5">
                  <span className="font-mono text-[11px] font-bold text-zinc-700 tracking-widest group-hover:text-zinc-500 transition-colors duration-200">
                    {p.n}
                  </span>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-[18px] font-semibold text-white mb-3 leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-[14px] text-zinc-500 leading-relaxed mb-5">
                    {p.body}
                  </p>
                  {/* Consequence — harder, more specific */}
                  <div className="flex items-start gap-3 pt-4 border-t border-[#1E1E24]">
                    <span className="mt-[6px] h-px w-4 shrink-0 bg-zinc-800" />
                    <p className="text-[12px] text-zinc-600 leading-relaxed italic">
                      {p.consequence}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Closing statement */}
            <div className="pt-10">
              <p className="text-[14px] text-zinc-700 leading-relaxed">
                The result is predictable: claims expire, evidence goes missing,
                and recoverable dollars are permanently written off. Not because the
                claims weren&apos;t valid—because the workflow failed them.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
