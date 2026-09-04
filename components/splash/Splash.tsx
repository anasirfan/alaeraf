"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { SPLASH_SESSION_KEY } from "@/lib/splash";

/**
 * First-load brand moment: a leaf drawn in hairline, a droplet that falls
 * and ripples, then the panel wipes upward to reveal the hero.
 *
 * The whole timeline is CSS (see globals.css), so the panel clears itself
 * even with JavaScript disabled. This component only:
 *   1. unmounts the panel once the wipe has finished, and
 *   2. records that the splash has played, so it shows once per session.
 *
 * `SPLASH_SESSION_KEY` is also read by an inline pre-paint script in
 * app/layout.tsx, which hides the panel before the first paint on repeat
 * views — no flash of the splash on internal navigation or refresh.
 */

const TOTAL_MS = 2_750; // 1.88s hold + 0.72s wipe, plus a little slack
const REDUCED_MS = 1_400;

export function Splash() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    // The pre-paint script marks repeat views, where CSS has already hidden
    // the panel; there we only need to drop it from the tree.
    const alreadyPlayed = document.documentElement.dataset.splash === "done";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const previousOverflow = document.documentElement.style.overflow;
    if (!alreadyPlayed) {
      document.documentElement.style.overflow = "hidden";
    }

    const release = () => {
      document.documentElement.style.overflow = previousOverflow;
      document.documentElement.dataset.splash = "done";
      try {
        sessionStorage.setItem(SPLASH_SESSION_KEY, "1");
      } catch {
        // Private mode or blocked storage — the splash simply replays.
      }
      setDone(true);
    };

    const delay = alreadyPlayed ? 0 : reduced ? REDUCED_MS : TOTAL_MS;
    const timer = window.setTimeout(release, delay);

    return () => {
      window.clearTimeout(timer);
      document.documentElement.style.overflow = previousOverflow;
    };
  }, []);

  if (done) return null;

  return (
    <div className="splash" role="status" aria-label={`${site.name} — loading`}>
      <div className="splash__glow" aria-hidden="true" />
      <div className="splash__grain grain" aria-hidden="true" />

      <div className="splash__inner">
        {/* Leaf + droplet + ripple */}
        <svg
          viewBox="0 0 120 142"
          className="splash__leaf h-28 w-auto sm:h-36"
          aria-hidden="true"
        >
          {/* ripples where the dew lands */}
          <circle className="splash__ripple" cx="60" cy="126" r="24" />
          <circle className="splash__ripple splash__ripple--late" cx="60" cy="126" r="24" />

          {/* dew gathering at the leaf tip, then falling */}
          <ellipse className="splash__drop" cx="60" cy="110" rx="3" ry="4" />

          {/* leaf */}
          <path
            className="s-outline"
            pathLength="1"
            d="M60 6C33 31 25 70 60 108C95 70 87 31 60 6Z"
          />
          <path className="s-rib" pathLength="1" d="M60 14V104" />
          <path className="s-vein" pathLength="1" d="M60 36C51 38 44 44 39 53" />
          <path className="s-vein" pathLength="1" d="M60 36C69 38 76 44 81 53" />
          <path className="s-vein" pathLength="1" d="M60 58C52 60 46 66 42 74" />
          <path className="s-vein" pathLength="1" d="M60 58C68 60 74 66 78 74" />
        </svg>

        {/* Wordmark */}
        <div className="splash__logo mt-8 sm:mt-10">
          <span className="relative block h-12 w-[13rem] sm:h-14 sm:w-[15.5rem]">
            <Image
              src="/logo-light.png"
              alt={site.name}
              fill
              priority
              sizes="248px"
              className="object-contain"
            />
          </span>
        </div>

        {/* The wordmark already carries "Pure by Nature" — say what we make instead. */}
        <p className="splash__tagline eyebrow mt-5 text-center text-sage-soft/70">
          Herbal Hair Oil <span className="mx-1.5 opacity-50">·</span> Pure RO Water
        </p>

        <div className="splash__bar mt-11 h-px w-36 sm:w-48" aria-hidden="true" />
      </div>
    </div>
  );
}
