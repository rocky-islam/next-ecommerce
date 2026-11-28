"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";
import {
  addToCartAction,
  getCartAction,
  removeCartLineAction,
  updateCartLineAction,
} from "@/actions/cart";
import { Cart } from "@/lib/shopify/types";

type CartContextType = {
  cart: Cart | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  isLoading: boolean;
  isMutating: boolean;
  totalQuantity: number;
  errorMessage: string | null;
  clearError: () => void;
  addItem: (variantId: string, quantity?: number, openDrawer?: boolean) => Promise<boolean>;
  updateItem: (lineId: string, quantity: number) => Promise<boolean>;
  removeItem: (lineId: string) => Promise<boolean>;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({
  children,
  initialCart = null,
}: {
  children: React.ReactNode;
  initialCart?: Cart | null;
}) {
  const [cart, setCart] = useState<Cart | null>(initialCart);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(!initialCart);
  const [isMutating, setIsMutating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    // If we didn't receive initialCart, load it from cookie
    if (!initialCart) {
      getCartAction()
        .then((fetchedCart) => {
          setCart(fetchedCart);
        })
        .catch((err) => {
          console.error("Failed to fetch cart on mount:", err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [initialCart]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const clearError = () => setErrorMessage(null);

  const addItem = async (
    variantId: string,
    quantity = 1,
    openDrawer = true
  ): Promise<boolean> => {
    setIsMutating(true);
    setErrorMessage(null);

    try {
      const result = await addToCartAction(variantId, quantity);
      if (result.success && result.cart) {
        startTransition(() => {
          setCart(result.cart!);
          if (openDrawer) {
            setIsOpen(true);
          }
        });
        return true;
      } else {
        setErrorMessage(result.error || "Failed to add item to cart");
        return false;
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Error adding to cart");
      return false;
    } finally {
      setIsMutating(false);
    }
  };

  const updateItem = async (lineId: string, quantity: number): Promise<boolean> => {
    setIsMutating(true);
    setErrorMessage(null);

    try {
      const result = await updateCartLineAction(lineId, quantity);
      if (result.success && result.cart) {
        startTransition(() => {
          setCart(result.cart!);
        });
        return true;
      } else {
        setErrorMessage(result.error || "Failed to update item");
        return false;
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Error updating item");
      return false;
    } finally {
      setIsMutating(false);
    }
  };

  const removeItem = async (lineId: string): Promise<boolean> => {
    setIsMutating(true);
    setErrorMessage(null);

    try {
      const result = await removeCartLineAction(lineId);
      if (result.success && result.cart) {
        startTransition(() => {
          setCart(result.cart!);
        });
        return true;
      } else {
        setErrorMessage(result.error || "Failed to remove item");
        return false;
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Error removing item");
      return false;
    } finally {
      setIsMutating(false);
    }
  };

  const clearCart = () => {
    setCart(null);
    setIsOpen(false);
  };

  const totalQuantity = cart?.totalQuantity || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        setIsOpen,
        openCart,
        closeCart,
        isLoading,
        isMutating,
        totalQuantity,
        errorMessage,
        clearError,
        addItem,
        updateItem,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
