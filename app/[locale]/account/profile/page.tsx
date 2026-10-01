import { notFound } from "next/navigation";
import { AccountNav } from "@/components/AccountShell";
import { ProfileForm } from "@/components/ProfileForm";
import { requireMember } from "@/lib/auth";
import { getMessages, isLocale } from "@/lib/i18n";

export default async function ProfilePage({ params }: PageProps<"/[locale]/account/profile">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const profile = await requireMember(locale);
  const m = getMessages(locale);
  return (
    <>
      <AccountNav locale={locale} profile={profile} current="/profile" />
      <div className="container-page py-10">
        <h1 className="mb-8 font-serif text-4xl font-semibold">{m.account.profile}</h1>
        <ProfileForm profile={profile} t={m.account} auth={m.auth} />
      </div>
    </>
  );
}
