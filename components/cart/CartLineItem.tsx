"use client";

import Image from "next/image";
import { Minus, Plus, Trash2, TriangleAlert } from "lucide-react";
import { productImageUrl } from "@/lib/catalog/images";
import { useCart } from "@/lib/cart/CartContext";
import { MAX_CART_QUANTITY, type CartItem } from "@/lib/cart/types";

function formatPrice(value: number) {
  return `Rs ${Math.round(value).toLocaleString()}`;
}

export function CartLineItem({ item }: { item: CartItem }) {
  const { incrementItem, decrementItem, removeItem } = useCart();
  const atMax = item.quantity >= MAX_CART_QUANTITY;
  const outOfStock = !item.unavailable && item.stockStatus === "out_of_stock";
  const blocked = item.unavailable || outOfStock;

  return (
    <div className="flex gap-4 border-b border-line py-6 first:pt-0 last:border-b-0 sm:gap-5">
      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-sm bg-sand sm:h-28 sm:w-24">
        {item.imagePath ? (
          <Image
            src={productImageUrl(item.imagePath)}
            alt={item.imageAlt ?? item.name}
            fill
            sizes="96px"
            quality={75}
            className={`object-cover ${blocked ? "opacity-50 grayscale" : ""}`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[0.65rem] text-muted">
            No image
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              {item.sizeLabel && (
                <p className="text-[0.65rem] font-semibold tracking-[0.08em] text-muted uppercase">
                  {item.sizeLabel}
                </p>
              )}
              <h3 className="mt-1 font-display text-base text-forest sm:text-lg">{item.name}</h3>
            </div>
            <button
              type="button"
              onClick={() => removeItem(item.productId)}
              aria-label={`Remove ${item.name} from cart`}
              className="shrink-0 rounded-full p-2 text-muted transition-colors hover:bg-sand hover:text-forest"
            >
              <Trash2 className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>

          {item.unavailable ? (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-gold">
              <TriangleAlert className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
              No longer available — please remove this item.
            </p>
          ) : outOfStock ? (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-gold">
              <TriangleAlert className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
              Currently out of stock.
            </p>
          ) : null}
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div
            className={`flex items-center rounded-full border border-line ${blocked ? "opacity-40" : ""}`}
            aria-disabled={blocked}
          >
            <button
              type="button"
              onClick={() => decrementItem(item.productId)}
              disabled={blocked}
              aria-label="Decrease quantity"
              className="flex h-8 w-8 items-center justify-center text-forest disabled:cursor-not-allowed"
            >
              <Minus className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
            <span className="w-7 text-center text-sm tabular-nums text-forest">{item.quantity}</span>
            <button
              type="button"
              onClick={() => incrementItem(item.productId)}
              disabled={blocked || atMax}
              aria-label="Increase quantity"
              className="flex h-8 w-8 items-center justify-center text-forest disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          </div>

          <div className="text-right">
            <p className="font-display text-base text-forest">
              {formatPrice(item.price * item.quantity)}
            </p>
            {item.quantity > 1 && (
              <p className="text-[0.7rem] text-muted">{formatPrice(item.price)} each</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
