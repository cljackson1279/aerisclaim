import Link from "next/link";

const navCols = [
  {
    heading: "Platform",
    links: [
      { label: "Claims Lifecycle", href: "#platform" },
      { label: "Capabilities", href: "#features" },
      { label: "How It Works", href: "#workflow" },
      { label: "Recovery Reporting", href: "#impact" },
    ],
  },
  {
    heading: "Solutions",
    links: [
      { label: "LTL Shippers", href: "#" },
      { label: "Distributors", href: "#" },
      { label: "3PLs & Brokers", href: "#" },
      { label: "Enterprise Logistics", href: "#" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-[#27272F] bg-[#09090B]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid lg:grid-cols-[280px_1fr] gap-12 lg:gap-16">
          {/* Brand column */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#C01028]">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path
                    d="M7 1L13 4.5V9.5L7 13L1 9.5V4.5L7 1Z"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 5V9M5 7H9"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span className="text-[15px] font-semibold tracking-tight text-white">
                AerisClaim
              </span>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-[240px]">
              The operating system for freight claims recovery. Centralize. Submit. Recover.
            </p>
            <div className="mt-6">
              <Link
                href="#demo"
                className="inline-flex items-center gap-2 bg-[#C01028] hover:bg-[#A00C22] text-white text-xs font-semibold px-4 py-2 rounded-sm transition-colors duration-150"
              >
                Book a Demo
              </Link>
            </div>
          </div>

          {/* Nav columns */}
          <div className="grid sm:grid-cols-3 gap-8">
            {navCols.map((col) => (
              <div key={col.heading}>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-600 mb-4">
                  {col.heading}
                </p>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[#27272F] flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} AerisClaim. All rights reserved.
          </p>
          <p className="text-xs text-zinc-700">
            Freight claims recovery infrastructure
          </p>
        </div>
      </div>
    </footer>
  );
}
