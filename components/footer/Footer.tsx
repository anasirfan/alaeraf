import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { footer, hero } from "@/data/content";
import { site } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="scroll-mt-20 bg-forest text-cream">
      {/* The two worlds, restated one last time — and held apart */}
      <Container>
        <ul className="grid border-t border-cream/12 sm:grid-cols-2">
          {hero.index.map((item, i) => (
            <li
              key={item.no}
              className={
                i === 0
                  ? "border-b border-cream/12 sm:border-b-0 sm:border-r sm:border-cream/12 sm:pr-8"
                  : "sm:pl-8"
              }
            >
              <Link
                href={item.href}
                className="group flex items-center justify-between gap-6 py-7 transition-opacity duration-300 hover:opacity-75"
              >
                <span>
                  <span className="eyebrow block text-sage-soft/75">{item.kicker}</span>
                  <span className="mt-2 block font-display text-xl text-cream sm:text-2xl">
                    {item.title}
                  </span>
                </span>
                <ArrowUpRight
                  className="h-5 w-5 shrink-0 text-cream/50 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cream"
                  strokeWidth={1.5}
                />
              </Link>
            </li>
          ))}
        </ul>
      </Container>

      <Container className="border-t border-cream/12 py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Brand */}
          <div className="lg:col-span-5">
            <span className="relative block h-11 w-[10.5rem]">
              <Image
                src="/logo-light.png"
                alt={`${site.name} — ${site.tagline}`}
                fill
                sizes="168px"
                className="object-contain object-left"
              />
            </span>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-cream/60">
              {footer.blurb}
            </p>
          </div>

          {/* Link columns */}
          {footer.columns.map((col) => (
            <nav key={col.title} className="lg:col-span-2" aria-label={col.title}>
              <h2 className="eyebrow text-sage-soft/70">{col.title}</h2>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-cream/70 transition-colors duration-300 hover:text-cream"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Contact */}
          <div className="lg:col-span-3">
            <h2 className="eyebrow text-sage-soft/70">Contact</h2>
            <dl className="mt-5 space-y-3.5">
              {footer.contact.map((row) => (
                <div key={row.label}>
                  <dt className="text-[0.7rem] tracking-[0.14em] text-cream/55 uppercase">
                    {row.label}
                  </dt>
                  <dd className="mt-1 text-sm text-cream/70">
                    {"href" in row && row.href ? (
                      <a
                        href={row.href}
                        className="transition-colors duration-300 hover:text-cream"
                      >
                        {row.value}
                      </a>
                    ) : (
                      row.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-cream/12 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.75rem] text-cream/60">
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="eyebrow text-cream/55">{site.tagline}</p>
        </div>
      </Container>
    </footer>
  );
}
