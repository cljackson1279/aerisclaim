import Link from "next/link";

export default function MidCTA() {
  return (
    <div className="relative border-y border-[#1E1E26] bg-[#0B0B0F]">
      {/* Red left accent — one intentional mark in an otherwise zinc section */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#C01028]" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pl-5">
          {/* Left */}
          <div>
            <p className="text-[15px] font-medium text-zinc-300 leading-snug mb-1">
              Ready to see what a disciplined claims operation looks like?
            </p>
            <p className="text-[12px] text-zinc-600">
              30-minute demo · No commitment · Built for LTL shippers and 3PLs
            </p>
          </div>

          {/* Right */}
          <Link
            href="#demo"
            className="inline-flex shrink-0 items-center gap-2 bg-[#C01028] hover:bg-[#A00C22] text-white text-[12px] font-semibold px-5 py-2.5 rounded-sm transition-colors duration-150"
          >
            Book a Demo
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 6H10M10 6L7 3M10 6L7 9"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
