"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { readCartFromStorage, writeCartToStorage } from "./storage";
import { clampQuantity, toCartItem, type AddableProduct, type CartItem } from "./types";

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  /** True once the guest cart has been loaded from storage (avoids a flash of "empty" on first paint). */
  isReady: boolean;
  addItem: (product: AddableProduct, quantity?: number) => void;
  incrementItem: (productId: string) => void;
  decrementItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  /** Replaces the whole cart, e.g. after the /cart page re-checks products against Supabase. */
  replaceItems: (items: CartItem[]) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Load the guest cart once, client-side only. This intentionally reads
  // localStorage and calls setState inside a mount effect rather than a
  // useState lazy initializer: localStorage doesn't exist during server
  // rendering, so a lazy initializer would return a different value on the
  // client's first (hydration) render than the server rendered, causing a
  // hydration mismatch. Starting from the SSR-matching empty array and
  // syncing in an effect is the correct, hydration-safe pattern here even
  // though it trips the generic "no setState in effect" lint rule.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- see note above: hydration-safe browser-storage sync, not a derived-state anti-pattern.
    setItems(readCartFromStorage());
    setIsReady(true);
  }, []);

  // Persist on every change, but never before the initial load has run —
  // otherwise the pre-load empty state would overwrite a real saved cart.
  // Gated on `isReady` *state* (not a ref) deliberately: a ref flipped
  // synchronously inside the load effect above would already read as
  // "true" here even on a commit where this effect's own closure still
  // holds the pre-load `items` value (e.g. under Strict Mode's double
  // effect invocation in dev), which would write that stale empty array
  // straight back over the just-loaded cart. Gating on state instead means
  // this effect only ever observes `isReady` and `items` from the same
  // render, so it can't fire with one updated and the other stale.
  useEffect(() => {
    if (!isReady) return;
    writeCartToStorage(items);
  }, [items, isReady]);

  const addItem = useCallback((product: AddableProduct, quantity = 1) => {
    if (product.stock_status === "out_of_stock") return;
    setItems((current) => {
      const existing = current.find((item) => item.productId === product.id);
      if (existing) {
        return current.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: clampQuantity(item.quantity + quantity), unavailable: false }
            : item,
        );
      }
      return [...current, toCartItem(product, quantity)];
    });
  }, []);

  const incrementItem = useCallback((productId: string) => {
    setItems((current) =>
      current.map((item) =>
        item.productId === productId
          ? { ...item, quantity: clampQuantity(item.quantity + 1) }
          : item,
      ),
    );
  }, []);

  const decrementItem = useCallback((productId: string) => {
    setItems((current) =>
      current
        .map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity >= 1),
    );
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setItems((current) =>
      current
        .map((item) =>
          item.productId === productId ? { ...item, quantity: clampQuantity(quantity) } : item,
        )
        .filter((item) => item.quantity >= 1),
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((current) => current.filter((item) => item.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const replaceItems = useCallback((next: CartItem[]) => setItems(next), []);

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((sum, item) => (item.unavailable ? sum : sum + item.price * item.quantity), 0),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount,
      subtotal,
      isReady,
      addItem,
      incrementItem,
      decrementItem,
      setQuantity,
      removeItem,
      clearCart,
      replaceItems,
    }),
    [items, itemCount, subtotal, isReady, addItem, incrementItem, decrementItem, setQuantity, removeItem, clearCart, replaceItems],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
