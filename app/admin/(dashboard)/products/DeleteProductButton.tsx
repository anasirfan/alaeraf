"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import { deleteProductAction, type DeleteState } from "./actions";

export function DeleteProductButton({ id }: { id: string }) {
  const [state, formAction] = useActionState<DeleteState, FormData>(deleteProductAction, undefined);

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!confirm("Delete this product? This can't be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        aria-label="Delete product"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-red-500 transition-colors hover:border-red-300 hover:bg-red-50"
      >
        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
      </button>
      {state?.error && <p className="mt-1 max-w-[12rem] text-xs text-red-600">{state.error}</p>}
    </form>
  );
}
