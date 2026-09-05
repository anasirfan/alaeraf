import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Shared editorial frame for /login, /signup, /forgot-password and
 * /reset-password — same rhythm as the rest of the site (eyebrow, serif
 * headline, lede) around a single centered card, rather than a generic
 * auth-template look.
 */
export function AuthShell({
  eyebrow,
  title,
  lede,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <section className="bg-ivory pt-[7.5rem] pb-24 sm:pt-40 sm:pb-32">
      <Container>
        <div className="mx-auto max-w-md text-center">
          <Reveal>
            <Eyebrow className="justify-center">{eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={90}>
            <h1 className="display-3 balance mt-5 font-display text-forest">{title}</h1>
          </Reveal>
          {lede && (
            <Reveal delay={150}>
              <p className="lede pretty mt-4 text-sm text-muted sm:text-base">{lede}</p>
            </Reveal>
          )}
        </div>

        <Reveal delay={220} className="mx-auto mt-10 max-w-md">
          <div className="rounded-sm border border-line bg-cream/40 p-6 sm:p-9">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-muted">{footer}</div>}
        </Reveal>
      </Container>
    </section>
  );
}
