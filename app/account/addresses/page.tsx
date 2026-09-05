import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { createClient } from "@/lib/supabase/server";
import { routes } from "@/lib/site";
import { AddressList } from "./AddressList";
import { AddAddressPanel } from "./AddAddressPanel";

export const metadata: Metadata = {
  title: "My Addresses",
  description: "Manage your saved Al Aeraf delivery addresses.",
};

export const dynamic = "force-dynamic";

export default async function AddressesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null; // account/layout.tsx already guarantees this

  const { data: addresses } = await supabase
    .from("addresses")
    .select("*")
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  const list = addresses ?? [];

  return (
    <section className="bg-ivory pt-[7.5rem] pb-24 sm:pt-40 sm:pb-32">
      <Container>
        <Reveal>
          <Link
            href={routes.account}
            className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.04em] text-muted uppercase transition-colors hover:text-forest"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
            My Account
          </Link>
        </Reveal>

        <div className="mt-5">
          <Reveal delay={60}>
            <Eyebrow>Delivery</Eyebrow>
          </Reveal>
          <Reveal delay={110}>
            <h1 className="display-3 balance mt-4 font-display text-forest">Your Addresses</h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="lede pretty mt-3 max-w-xl text-sm text-muted sm:text-base">
              Save the places you have delivered to, mark a default, and keep coordinates on file
              for whenever ordering opens up.
            </p>
          </Reveal>
        </div>

        <Reveal delay={220} className="mt-10">
          <AddressList addresses={list} />
        </Reveal>

        <Reveal delay={260} className="mt-6">
          <AddAddressPanel hasAddresses={list.length > 0} />
        </Reveal>
      </Container>
    </section>
  );
}
