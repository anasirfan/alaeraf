"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/Button";

type Variant = "solid" | "outline" | "light" | "lightOutline" | "water";
type Size = "md" | "lg";

/**
 * A submit <Button> that knows its own pending state via useFormStatus —
 * must be rendered inside the <form> it submits. Keeps every auth/account
 * form's loading state consistent without each page re-deriving it.
 */
export function SubmitButton({
  children,
  pendingLabel = "Please wait…",
  variant = "solid",
  size = "lg",
  className = "",
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant={variant} size={size} disabled={pending} className={className}>
      {pending ? pendingLabel : children}
    </Button>
  );
}
