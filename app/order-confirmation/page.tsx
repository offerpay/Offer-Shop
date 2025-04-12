"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getOrderById } from "@/lib/order-storage"
import type { Order } from "@/lib/types"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function OrderConfirmationPage() {
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get the order ID from session storage
    const orderId = sessionStorage.getItem("lastOrderId")

    if (!orderId) {
      // No order ID found, redirect to home
      router.push("/")
      return
    }

    // Get the order details
    const orderDetails = getOrderById(orderId)
    if (orderDetails) {
      setOrder(orderDetails)

      // Update order status to processing and payment status to paid
      // In a real application, this would happen after payment confirmation from the payment gateway
      // For demo purposes, we'll simulate a successful payment
      import("@/lib/order-storage").then(({ updateOrder }) => {
        updateOrder(orderId, {
          status: "processing",
          paymentStatus: "paid",
          updatedAt: new Date().toISOString(),
        })
      })

      // Clear the lastOrderId from sessionStorage to prevent duplicate processing
      // But only after we've successfully retrieved the order
      sessionStorage.removeItem("lastOrderId")
    }

    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Processing Your Order</h1>
        <p className="mb-8">Please wait while we confirm your order details...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Order Not Found</h1>
        <p className="mb-8">We couldn't find your order details. Please contact customer support.</p>
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
        <p className="text-xl mb-2">Your order has been confirmed.</p>
        <p className="text-neutral-600">Order ID: {order.id}</p>
      </div>

      <div className="max-w-3xl mx-auto border rounded-lg overflow-hidden">
        <div className="bg-neutral-50 p-4 border-b">
          <h2 className="font-bold">Order Summary</h2>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <h3 className="font-medium mb-2">Shipping Information</h3>
            <div className="text-neutral-600">
              <p>{order.shippingDetails.fullName}</p>
              <p>{order.shippingDetails.address}</p>
              <p>
                {order.shippingDetails.city}, {order.shippingDetails.postalCode}
              </p>
              <p>{order.shippingDetails.country.toUpperCase()}</p>
              <p>{order.shippingDetails.phone}</p>
              <p>{order.shippingDetails.email}</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-medium mb-2">Items</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="text-left p-3">Product</th>
                    <th className="text-center p-3">Quantity</th>
                    <th className="text-right p-3">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="p-3">{item.name}</td>
                      <td className="p-3 text-center">{item.quantity}</td>
                      <td className="p-3 text-right">${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-neutral-50 border-t">
                  <tr>
                    <td colSpan={2} className="p-3 text-right font-medium">
                      Total
                    </td>
                    <td className="p-3 text-right font-bold">${order.totalAmount.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="text-center">
            <p className="mb-6">We'll send you a shipping confirmation email when your order ships.</p>
            <Button asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
