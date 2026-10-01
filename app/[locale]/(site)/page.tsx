import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/PostCard";
import { latestPosts } from "@/lib/data";
import { DEMO_ADMIN } from "@/lib/env";
import { getMessages, isLocale, path } from "@/lib/i18n";

const GALLERY = ["photo2", "photo9", "photo7", "photo5"];

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const m = getMessages(locale);
  const t = m.home;
  const posts = await latestPosts(3);

  return (
    <>
      <section className="dark-surface relative isolate overflow-hidden bg-juniper">
        <Image src="/media/hero-1600.webp" alt="" fill priority sizes="100vw" className="-z-10 object-cover object-[50%_30%]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0f1f17]/90 via-[#0f1f17]/60 to-[#0f1f17]/20" />
        <div className="container-page flex min-h-[560px] flex-col justify-center gap-6 py-20 lg:min-h-[640px]">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sun">{t.eyebrow}</p>
          <h1 className="max-w-3xl font-serif text-[clamp(34px,6vw,58px)] font-semibold leading-[1.08] text-white">{t.title}</h1>
          <p className="max-w-2xl text-lg leading-relaxed text-[#e3ebe4]">{t.lead}</p>
          <div className="flex flex-wrap gap-3">
            <a href="#demo" className="rounded-full bg-sun px-6 py-3 font-semibold text-ink">{t.tryDemo}</a>
            <Link href={path(locale, "/news")} className="rounded-full border-[1.5px] border-white px-6 py-3 font-semibold text-white">{t.readNews}</Link>
          </div>
        </div>
      </section>

      <section className="container-page py-20" aria-labelledby="features-title">
        <h2 id="features-title" className="font-serif text-[clamp(28px,4vw,40px)] font-semibold">{t.featuresTitle}</h2>
        <p className="mt-2 text-lg text-soft">{t.featuresLead}</p>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.features.map((f, i) => (
            <li key={f.title} className="rounded-2xl border border-line bg-white p-7">
              <span aria-hidden="true" className="grid size-10 place-items-center rounded-full bg-moss font-serif font-semibold text-juniper">{i + 1}</span>
              <h3 className="mt-4 font-serif text-xl font-semibold">{f.title}</h3>
              <p className="mt-2 leading-relaxed text-soft">{f.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white py-20" aria-labelledby="news-title">
        <div className="container-page">
          <div className="flex items-end justify-between gap-4">
            <h2 id="news-title" className="font-serif text-[clamp(28px,4vw,40px)] font-semibold">{t.latestNews}</h2>
            <Link href={path(locale, "/news")} className="font-semibold text-juniper">{t.allNews} →</Link>
          </div>
          {posts.length > 0 ? (
            <div className="mt-10 grid gap-8 md:grid-cols-3">{posts.map((post) => <PostCard key={post.id} post={post} locale={locale} />)}</div>
          ) : (
            <p className="mt-6 text-soft">{m.news.empty}</p>
          )}
        </div>
      </section>

      <section id="demo" className="container-page scroll-mt-4 py-20" aria-labelledby="demo-title">
        <h2 id="demo-title" className="font-serif text-[clamp(28px,4vw,40px)] font-semibold">{m.demoAccess.title}</h2>
        <p className="mt-2 text-lg text-soft">{m.demoAccess.lead}</p>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-line bg-white p-7">
            <h3 className="font-serif text-xl font-semibold">{m.demoAccess.registerTitle}</h3>
            <p className="mt-2 leading-relaxed text-soft">{m.demoAccess.registerText}</p>
            <Link href={path(locale, "/register")} className="mt-5 inline-block rounded-full bg-forest px-5 py-2.5 font-semibold text-white">{m.nav.join}</Link>
          </div>
          <div className="rounded-2xl border border-line bg-white p-7">
            <h3 className="font-serif text-xl font-semibold">{m.demoAccess.adminTitle}</h3>
            <p className="mt-2 leading-relaxed text-soft">{m.demoAccess.adminText}</p>
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 rounded-xl bg-paper p-4 text-sm">
              <dt className="text-soft">{m.demoAccess.email}</dt>
              <dd className="font-mono">{DEMO_ADMIN.email}</dd>
              <dt className="text-soft">{m.demoAccess.password}</dt>
              <dd className="font-mono">{DEMO_ADMIN.password}</dd>
            </dl>
            <Link href={path(locale, "/login?demo=admin")} className="mt-5 inline-block rounded-full bg-forest px-5 py-2.5 font-semibold text-white">{m.nav.login}</Link>
          </div>
        </div>
      </section>

      <section className="dark-surface bg-forest py-20" aria-labelledby="story-title">
        <div className="container-page grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
          <video
            className="aspect-[9/16] max-h-[640px] w-full rounded-3xl object-cover"
            src="/media/spring-drink.mp4"
            poster="/media/spring-drink-poster.webp"
            controls
            muted
            playsInline
            preload="none"
            aria-label={t.storyTitle}
          />
          <div className="flex flex-col gap-5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sun">{t.storyEyebrow}</p>
            <h2 id="story-title" className="font-serif text-[clamp(30px,4vw,44px)] font-semibold text-white">{t.storyTitle}</h2>
            <p className="text-lg leading-relaxed text-mist">{t.storyText}</p>
            <p className="font-serif italic text-sun">{t.storySignature}</p>
          </div>
        </div>
      </section>

      <section className="container-page py-20" aria-labelledby="gallery-title">
        <h2 id="gallery-title" className="font-serif text-[clamp(28px,4vw,40px)] font-semibold">{t.galleryTitle}</h2>
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {GALLERY.map((name) => (
            <Image key={name} src={`/media/${name}-800.webp`} alt="" width={600} height={800} sizes="(min-width: 1024px) 300px, 50vw" className="aspect-[3/4] w-full rounded-2xl object-cover" />
          ))}
        </div>
        <Link href={path(locale, "/gallery")} className="mt-6 inline-block font-semibold text-juniper">{m.nav.gallery} →</Link>
      </section>

      <section className="bg-sand py-16">
        <div className="container-page flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <h2 className="font-serif text-[clamp(26px,3.5vw,34px)] font-semibold">{t.ctaTitle}</h2>
            <p className="mt-2 text-soft">{t.ctaText}</p>
          </div>
          <a href="https://simorghdev.pages.dev/#contact" target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-full bg-forest px-6 py-3 font-semibold text-white">{t.ctaButton}</a>
        </div>
      </section>
    </>
  );
}
