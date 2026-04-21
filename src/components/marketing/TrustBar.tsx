const items = [
  "Multi-tenant architecture",
  "Full audit log on every claim action",
  "Carrier-aware submission routing",
  "Human review before AI-generated content is sent",
  "Finance-exportable recovery reports",
  "Raw files always preserved",
];

export default function TrustBar() {
  return (
    <div className="border-y border-[#1E1E26] bg-[#0B0B0F]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-4">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-zinc-700 shrink-0 whitespace-nowrap">
            By design
          </span>
          <div className="h-3 w-px bg-[#27272F] hidden sm:block" />
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {items.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span className="h-px w-2.5 bg-zinc-800" />
                <span className="text-[11px] text-zinc-600 whitespace-nowrap">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
