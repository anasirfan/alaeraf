import Image from "next/image";
import { productImageUrl } from "@/lib/catalog/images";
import type { CartItem } from "@/lib/cart/types";

function formatPrice(value: number) {
  return `Rs ${Math.round(value).toLocaleString()}`;
}

/**
 * Read-only order-review line — quantities are edited on /cart, not here.
 * Deliberately simpler than CartLineItem (no steppers/remove): checkout is
 * "review what you're about to pay for," not another place to edit the cart.
 */
export function CheckoutItemRow({ item }: { item: CartItem }) {
  return (
    <div className="flex gap-4 border-b border-line py-5 first:pt-0 last:border-b-0 sm:gap-5">
      <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-sm bg-sand sm:h-20 sm:w-16">
        {item.imagePath ? (
          <Image
            src={productImageUrl(item.imagePath)}
            alt={item.imageAlt ?? item.name}
            fill
            sizes="80px"
            quality={72}
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[0.6rem] text-muted">No image</div>
        )}
      </div>

      <div className="flex flex-1 items-center justify-between gap-3">
        <div>
          {item.sizeLabel && (
            <p className="text-[0.6rem] font-semibold tracking-[0.08em] text-muted uppercase">{item.sizeLabel}</p>
          )}
          <p className="mt-0.5 font-display text-sm text-forest sm:text-base">{item.name}</p>
          <p className="mt-1 text-xs text-muted">
            Qty {item.quantity} × {formatPrice(item.price)}
          </p>
        </div>
        <p className="shrink-0 font-display text-sm text-forest sm:text-base">
          {formatPrice(item.price * item.quantity)}
        </p>
      </div>
    </div>
  );
}
