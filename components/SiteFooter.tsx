import { getMessages, type Locale } from "@/lib/i18n";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = getMessages(locale).footer;
  return (
    <footer className="dark-surface bg-forest py-10 text-sm text-mist">
      <div className="container-page flex flex-col gap-2">
        <p>{t.about}</p>
        <p>{t.rights}</p>
        <p>
          <a href="https://simorghdev.pages.dev" target="_blank" rel="noopener noreferrer" className="font-semibold text-white underline">{t.builtBy}</a>
          {" · "}
          <a href="https://github.com/Mahmud0547/kamarob-nature-fund" target="_blank" rel="noopener noreferrer" className="underline">GitHub</a>
        </p>
      </div>
    </footer>
  );
}
