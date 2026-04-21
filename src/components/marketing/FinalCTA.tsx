import Link from "next/link";

export default function FinalCTA() {
  return (
    <section
      id="demo"
      className="relative py-32 lg:py-48 bg-[#09090B] overflow-hidden"
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#27272F] to-transparent" />

      {/* Tight, disciplined red glow — not diffuse */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 40% 45% at 50% 50%, rgb(192 16 40 / 0.10) 0%, transparent 60%)",
        }}
      />

      {/* Grid — only in the center zone */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.012]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-6 lg:px-8 text-center">
        {/* Eyebrow — red treatment preserved for this section */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="h-px w-10 bg-[#C01028]" />
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#C01028]">
            Get Started
          </span>
          <span className="h-px w-10 bg-[#C01028]" />
        </div>

        {/* Headline — bigger, tighter */}
        <h2 className="text-[44px] sm:text-[56px] lg:text-[64px] xl:text-[72px] font-bold tracking-[-0.03em] text-white leading-[1.0] mb-7">
          Start Recovering
          <br />
          <span className="text-zinc-500">What You&apos;re Owed.</span>
        </h2>

        {/* Sub — tighter, sharper */}
        <p className="text-[16px] text-zinc-500 leading-[1.7] max-w-[480px] mx-auto mb-10">
          Most freight operations leave recoverable claim dollars unrecovered—not because
          the claims aren&apos;t valid, but because the process fails them. AerisClaim fixes the process.
        </p>

        {/* CTAs — decisive, no soft rounding */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="#"
            className="inline-flex items-center gap-2 bg-[#C01028] hover:bg-[#A00C22] text-white text-[13px] font-semibold px-8 py-3.5 rounded-sm transition-colors duration-150"
          >
            Book a Demo
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
              <path d="M2.5 6.5H10.5M10.5 6.5L7.5 3.5M10.5 6.5L7.5 9.5"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <Link
            href="#platform"
            className="inline-flex items-center border border-zinc-700/80 hover:border-zinc-600 text-zinc-400 hover:text-zinc-200 text-[13px] font-medium px-8 py-3.5 rounded-sm transition-all duration-150"
          >
            See the Platform
          </Link>
        </div>

        <p className="mt-8 text-[11px] text-zinc-700">
          Designed for LTL shippers, distributors, and 3PLs — no commitment required
        </p>
      </div>
    </section>
  );
}
