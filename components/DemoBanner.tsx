import type { Messages } from "@/lib/i18n";

/** Shown on every page: the organisation is a demo, the photos are real. */
export function DemoBanner({ t }: { t: Messages["demo"] }) {
  return (
    <p className="bg-sand px-4 py-2 text-center text-[13px] font-medium leading-snug text-forest">{t.banner}</p>
  );
}

export function SampleTag({ label }: { label: string }) {
  return <span className="rounded-full bg-sand px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-rust">{label}</span>;
}
