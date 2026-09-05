"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { ArrowUp, ArrowDown, Trash2, Upload, Star } from "lucide-react";
import { FormMessage } from "@/components/ui/FormMessage";
import { productImageUrl, ALLOWED_PRODUCT_IMAGE_TYPES, MAX_PRODUCT_IMAGE_BYTES } from "@/lib/catalog/images";
import type { ProductImageRow } from "@/lib/catalog/products";
import { uploadProductImageAction, deleteProductImageAction, reorderProductImagesAction, type ImageState } from "./actions";

export function ProductImageManager({ productId, images }: { productId: string; images: ProductImageRow[] }) {
  const [uploadState, uploadAction] = useActionState<ImageState, FormData>(uploadProductImageAction, undefined);
  const [isReordering, startReorder] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Optimistic local order so up/down clicks feel instant instead of
  // waiting on a full page revalidation before the list visibly moves.
  const [order, setOrder] = useState(images);
  const [syncedIds, setSyncedIds] = useState(() => images.map((i) => i.id).join(","));
  const incomingIds = images.map((i) => i.id).join(",");
  // Adjusting state during render (the documented React pattern for
  // resetting local state when a prop changes): a fresh upload/delete
  // revalidates the server page, which passes a new `images` array down —
  // resync the optimistic local order to it exactly once per change.
  if (incomingIds !== syncedIds) {
    setSyncedIds(incomingIds);
    setOrder(images);
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= order.length) return;
    const next = [...order];
    [next[index], next[target]] = [next[target], next[index]];
    setOrder(next);
    startReorder(() => {
      reorderProductImagesAction(productId, next.map((img) => img.id));
    });
  }

  return (
    <div className="rounded-sm border border-line bg-white p-6">
      <h3 className="mb-1 text-xs font-semibold tracking-[0.1em] text-muted uppercase">Product Images</h3>
      <p className="mb-5 text-xs text-muted">
        The first image is the product&apos;s primary photo. Accepted: {ALLOWED_PRODUCT_IMAGE_TYPES.map((t) => t.split("/")[1]).join(", ")} · up to{" "}
        {Math.round(MAX_PRODUCT_IMAGE_BYTES / (1024 * 1024))}MB.
      </p>

      {order.length === 0 ? (
        <p className="mb-5 rounded-sm border border-dashed border-line bg-cream/40 p-4 text-sm text-muted">
          No images yet — upload the first one below.
        </p>
      ) : (
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {order.map((img, index) => (
            <div key={img.id} className="group relative overflow-hidden rounded-sm border border-line bg-ivory">
              <div className="relative aspect-square">
                <Image
                  src={productImageUrl(img.storage_path)}
                  alt={img.alt_text ?? ""}
                  fill
                  sizes="200px"
                  className="object-cover"
                  unoptimized
                />
              </div>
              {index === 0 && (
                <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-forest/90 px-2 py-0.5 text-[0.6rem] font-semibold text-cream">
                  <Star className="h-2.5 w-2.5 fill-current" />
                  Primary
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-ink/70 px-2 py-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={index === 0 || isReordering}
                    onClick={() => move(index, -1)}
                    aria-label="Move earlier"
                    className="flex h-6 w-6 items-center justify-center rounded-full text-cream disabled:opacity-30"
                  >
                    <ArrowUp className="h-3 w-3" strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    disabled={index === order.length - 1 || isReordering}
                    onClick={() => move(index, 1)}
                    aria-label="Move later"
                    className="flex h-6 w-6 items-center justify-center rounded-full text-cream disabled:opacity-30"
                  >
                    <ArrowDown className="h-3 w-3" strokeWidth={2} />
                  </button>
                </div>
                <form
                  action={deleteProductImageAction}
                  onSubmit={(e) => {
                    if (!confirm("Delete this image?")) e.preventDefault();
                  }}
                >
                  <input type="hidden" name="id" value={img.id} />
                  <input type="hidden" name="productId" value={productId} />
                  <button type="submit" aria-label="Delete image" className="flex h-6 w-6 items-center justify-center rounded-full text-cream hover:text-red-300">
                    <Trash2 className="h-3 w-3" strokeWidth={2} />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      {uploadState?.error && (
        <div className="mb-4">
          <FormMessage type="error">{uploadState.error}</FormMessage>
        </div>
      )}

      <form
        action={(formData) => {
          uploadAction(formData);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }}
        className="flex flex-wrap items-center gap-3"
      >
        <input type="hidden" name="productId" value={productId} />
        <input
          ref={fileInputRef}
          type="file"
          name="file"
          accept={ALLOWED_PRODUCT_IMAGE_TYPES.join(",")}
          required
          className="max-w-full text-sm text-muted file:mr-3 file:rounded-full file:border file:border-line file:bg-cream file:px-4 file:py-2 file:text-xs file:font-semibold file:text-forest hover:file:bg-cream/70"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-full bg-forest px-4 py-2 text-xs font-semibold text-cream transition-colors hover:bg-ink"
        >
          <Upload className="h-3.5 w-3.5" strokeWidth={2} />
          Upload
        </button>
      </form>
    </div>
  );
}
