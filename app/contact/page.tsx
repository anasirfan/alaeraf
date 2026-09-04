import type { Metadata } from "next";
import { ArrowRight, MapPin, Phone, Globe } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { contactPage } from "@/data/content";
import { routes } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: contactPage.lede,
};

const icons = [Phone, Globe, MapPin];

export default function ContactPage() {
  return (
    <section className="bg-ivory pt-[7.5rem] pb-24 sm:pt-40 sm:pb-32">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <Eyebrow className="justify-center">{contactPage.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={90}>
            <h1 className="display-2 balance mt-6 font-display whitespace-pre-line text-forest">
              {contactPage.headline}
            </h1>
          </Reveal>
          <Reveal delay={150}>
            <p className="lede pretty mx-auto mt-6 max-w-lg text-muted">{contactPage.lede}</p>
          </Reveal>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl gap-6 border-t border-line pt-12 sm:grid-cols-3">
          {contactPage.channels.map((channel, i) => {
            const Icon = icons[i] ?? Phone;
            return (
              <Reveal key={channel.label} delay={120 + i * 90}>
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-forest">
                  <Icon className="h-4 w-4" strokeWidth={1.6} />
                </div>
                <p className="mt-4 text-[0.7rem] tracking-[0.14em] text-muted uppercase">
                  {channel.label}
                </p>
                <p className="mt-1.5 font-display text-lg text-forest">
                  {channel.href ? (
                    <a
                      href={channel.href}
                      className="transition-colors duration-300 hover:text-botanical"
                    >
                      {channel.value}
                    </a>
                  ) : (
                    channel.value
                  )}
                </p>
                {channel.note && (
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{channel.note}</p>
                )}
              </Reveal>
            );
          })}
        </div>

        <Reveal
          delay={420}
          className="mx-auto mt-16 flex max-w-4xl flex-col items-start gap-4 rounded-sm border border-line bg-sand/60 p-8 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            Online ordering isn&apos;t live yet — for now, every order and subscription is set up
            directly over a call or message.
          </p>
          <Button href={routes.deliveryAreas} size="lg" variant="outline">
            Check Delivery Areas
            <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
