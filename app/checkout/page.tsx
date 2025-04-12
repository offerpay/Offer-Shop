"use client"

import Link from "next/link"
import Image from "next/image"
import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import type { ShippingDetails } from "@/lib/types"
import { generatePaymentUrl } from "@/lib/payment-utils"
import { saveCheckoutState, getSavedCheckoutState, clearSavedCheckoutState } from "@/lib/checkout-storage"
import { createOrderFromCheckout } from "@/lib/order-storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Shield, Lock } from "lucide-react"

// Payment method icons
const paymentIcons = [
  {
    name: "Visa",
    image: "https://static-00.iconduck.com/assets.00/visa-icon-512x329-mpibmtt8.png",
  },
  {
    name: "MasterCard",
    image: "https://static-00.iconduck.com/assets.00/mastercard-icon-512x329-xpgofnyv.png",
  },
  {
    name: "American Express",
    image: "https://static-00.iconduck.com/assets.00/amex-icon-512x329-615em17t.png",
  },
  {
    name: "Discover",
    image: "https://static-00.iconduck.com/assets.00/discover-icon-512x329-wuydsv1l.png",
  },
  {
    name: "Diners",
    image: "https://static-00.iconduck.com/assets.00/diners-icon-512x329-1b4d5v6e.png",
  },
  {
    name: "JCB",
    image: "https://static-00.iconduck.com/assets.00/jcb-icon-512x329-71kgcv0c.png",
  },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()

  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
    email: "",
  })

  // Load saved checkout data if available
  useEffect(() => {
    const savedCheckout = getSavedCheckoutState()
    if (savedCheckout && savedCheckout.shippingDetails) {
      setShippingDetails((prev) => ({
        ...prev,
        ...savedCheckout.shippingDetails,
      }))
    }
  }, [])

  // Save checkout data whenever shipping details change
  useEffect(() => {
    // Only save if at least one field has been filled
    const hasData = Object.values(shippingDetails).some((value) => value.trim() !== "")
    if (hasData) {
      saveCheckoutState(items, shippingDetails)
    }
  }, [shippingDetails, items])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setShippingDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleCountryChange = (value: string) => {
    setShippingDetails((prev) => ({ ...prev, country: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate shipping details
    if (
      !shippingDetails.fullName ||
      !shippingDetails.address ||
      !shippingDetails.city ||
      !shippingDetails.postalCode ||
      !shippingDetails.country ||
      !shippingDetails.phone ||
      !shippingDetails.email
    ) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      // Create an order in the system
      const order = createOrderFromCheckout(items, shippingDetails, subtotal)

      // Store order ID for reference after payment
      sessionStorage.setItem("lastOrderId", order.id)

      // Generate the payment URL with the cart total
      const paymentUrl = generatePaymentUrl(subtotal)

      // Clear saved checkout state since we're creating an order
      clearSavedCheckoutState()

      // Clear the cart after successful checkout
      clearCart()

      // Show success message
      toast({
        title: "Order created",
        description: "Your order has been created and you will be redirected to complete your payment.",
      })

      // Redirect to the payment URL
      window.location.href = paymentUrl
    } catch (error) {
      console.error("Error creating order:", error)
      toast({
        title: "Error",
        description: "There was a problem creating your order. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <p className="mb-8">Your cart is empty. Please add items to your cart before proceeding to checkout.</p>
        <Button asChild>
          <Link href="/category/cameras">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">Shipping Information</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={shippingDetails.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" name="address" value={shippingDetails.address} onChange={handleChange} required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" value={shippingDetails.city} onChange={handleChange} required />
                  </div>

                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={shippingDetails.postalCode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select value={shippingDetails.country} onValueChange={handleCountryChange} required>
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                      <SelectItem value="de">Germany</SelectItem>
                      <SelectItem value="fr">France</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={shippingDetails.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={shippingDetails.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 mb-4">
                <h3 className="font-medium mb-4">Payment Information</h3>

                {/* Payment method icons */}
                <div className="flex flex-wrap gap-3 mb-4">
                  {paymentIcons.map((icon) => (
                    <div key={icon.name} className="bg-white p-2 rounded border">
                      <Image src={icon.image || "/placeholder.svg"} alt={icon.name} width={48} height={30} />
                    </div>
                  ))}
                </div>

                {/* Security badges */}
                <div className="flex flex-col gap-2 text-sm text-neutral-600">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>Secure checkout with 256-bit SSL encryption</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-green-600" />
                    <span>Your payment information is never stored on our servers</span>
                  </div>
                </div>

                <p className="text-sm text-neutral-600 mt-4">
                  After submitting your shipping details, you will be redirected to our secure payment processor to
                  complete your purchase.
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Proceed to Payment
              </Button>
            </form>
          </div>
        </div>

        <div>
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <span>{item.quantity} ×</span>
                    <span>{item.name}</span>
                  </div>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
