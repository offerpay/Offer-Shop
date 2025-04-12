import type { ShippingDetails, CartItem } from "@/lib/types"

interface SavedCheckout {
  cartItems: CartItem[]
  shippingDetails: Partial<ShippingDetails>
  timestamp: string
}

/**
 * Save the current checkout state
 */
export function saveCheckoutState(cartItems: CartItem[], shippingDetails: Partial<ShippingDetails>): void {
  if (typeof window === "undefined") return

  try {
    const checkoutData: SavedCheckout = {
      cartItems,
      shippingDetails,
      timestamp: new Date().toISOString(),
    }

    localStorage.setItem("savedCheckout", JSON.stringify(checkoutData))
  } catch (error) {
    console.error("Error saving checkout state:", error)
  }
}

/**
 * Get the saved checkout state
 */
export function getSavedCheckoutState(): SavedCheckout | null {
  if (typeof window === "undefined") return null

  try {
    const savedCheckout = localStorage.getItem("savedCheckout")
    if (!savedCheckout) return null

    return JSON.parse(savedCheckout)
  } catch (error) {
    console.error("Error getting saved checkout state:", error)
    return null
  }
}

/**
 * Clear the saved checkout state
 */
export function clearSavedCheckoutState(): void {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem("savedCheckout")
  } catch (error) {
    console.error("Error clearing saved checkout state:", error)
  }
}
