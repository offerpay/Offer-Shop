"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import AdminLayout from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Loader2, ArrowLeft, User } from "lucide-react"
import { getOrderById, updateOrder, getCustomerById, deleteOrder } from "@/lib/order-storage"
import type { Order, Customer } from "@/lib/types"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)
  const [customer, setCustomer] = useState<Customer | null>(null)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderData = getOrderById(params.id as string)

        if (!orderData) {
          toast({
            title: "Order not found",
            description: "The order you are looking for does not exist.",
            variant: "destructive",
          })
          router.push("/admin/orders")
          return
        }

        setOrder(orderData)

        // Fetch customer data
        const customerData = getCustomerById(orderData.customerId)
        setCustomer(customerData || null)

        setLoading(false)
      } catch (error) {
        console.error("Error fetching order details:", error)
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [params.id, router])

  const handleStatusChange = async (status: Order["status"]) => {
    if (!order) return

    setSaving(true)
    try {
      const updatedOrder = updateOrder(order.id, { status })

      if (updatedOrder) {
        setOrder(updatedOrder)
        toast({
          title: "Order updated",
          description: `Order status has been updated to ${status}.`,
        })
      } else {
        throw new Error("Failed to update order")
      }
    } catch (error) {
      console.error("Error updating order:", error)
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handlePaymentStatusChange = async (paymentStatus: Order["paymentStatus"]) => {
    if (!order) return

    setSaving(true)
    try {
      const updatedOrder = updateOrder(order.id, { paymentStatus })

      if (updatedOrder) {
        setOrder(updatedOrder)
        toast({
          title: "Order updated",
          description: `Payment status has been updated to ${paymentStatus}.`,
        })
      } else {
        throw new Error("Failed to update order")
      }
    } catch (error) {
      console.error("Error updating order:", error)
      toast({
        title: "Error",
        description: "Failed to update payment status.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.push("/admin/orders")}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Orders
          </Button>
        </div>
        <div className="border rounded-lg p-6 bg-white">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.push("/admin/orders")}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Orders
          </Button>
        </div>
        <div className="border rounded-lg p-6 bg-white text-center">
          <p className="text-neutral-500 mb-4">Order not found</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push("/admin/orders")}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Orders
          </Button>
          <h1 className="text-2xl font-bold">Order Details</h1>
        </div>
      </div>

      <div className="admin-content-container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Order {order.id}</CardTitle>
                  <CardDescription>Placed on {formatDate(order.createdAt)}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select value={order.status} onValueChange={handleStatusChange} disabled={saving}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Order Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={order.paymentStatus} onValueChange={handlePaymentStatusChange} disabled={saving}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Payment Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-neutral-50 border-b">
                      <tr>
                        <th className="text-left p-4">Product</th>
                        <th className="text-center p-4">Quantity</th>
                        <th className="text-right p-4">Price</th>
                        <th className="text-right p-4">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="p-4">
                            <div className="flex items-center gap-4">
                              <div className="relative w-12 h-12 flex-shrink-0">
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  fill
                                  className="object-cover rounded"
                                />
                              </div>
                              <div>
                                <h3 className="font-medium">{item.name}</h3>
                                <p className="text-sm text-neutral-500">{item.category}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-center">{item.quantity}</td>
                          <td className="p-4 text-right">${item.price.toFixed(2)}</td>
                          <td className="p-4 text-right font-medium">${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-neutral-50">
                      <tr>
                        <td colSpan={3} className="p-4 text-right font-medium">
                          Total
                        </td>
                        <td className="p-4 text-right font-bold">${order.totalAmount.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">{order.shippingDetails.fullName}</h3>
                      <p className="text-sm text-neutral-500">{order.shippingDetails.email}</p>
                      <p className="text-sm text-neutral-500">{order.shippingDetails.phone}</p>
                    </div>

                    {customer && (
                      <div>
                        <p className="text-sm text-neutral-500">
                          Customer since {new Date(customer.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-neutral-500">Total orders: {customer.orders.length}</p>
                      </div>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => router.push(`/admin/customers/${order.customerId}`)}
                    >
                      View Customer Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p>{order.shippingDetails.fullName}</p>
                    <p>{order.shippingDetails.address}</p>
                    <p>
                      {order.shippingDetails.city}, {order.shippingDetails.postalCode}
                    </p>
                    <p>{order.shippingDetails.country.toUpperCase()}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Order Placed</p>
                        <p className="text-xs text-neutral-500">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>

                    {order.status !== "pending" && (
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Status Updated</p>
                          <p className="text-xs text-neutral-500">{formatDate(order.updatedAt)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-red-600">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-neutral-600">
                      Deleting an order will permanently remove it from the system. This action cannot be undone.
                    </p>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        if (
                          window.confirm("Are you sure you want to delete this order? This action cannot be undone.")
                        ) {
                          try {
                            const success = deleteOrder(order.id)
                            if (success) {
                              toast({
                                title: "Order deleted",
                                description: "The order has been successfully deleted.",
                              })
                              router.push("/admin/orders")
                            } else {
                              throw new Error("Failed to delete order")
                            }
                          } catch (error) {
                            console.error("Error deleting order:", error)
                            toast({
                              title: "Error",
                              description: "Failed to delete the order.",
                              variant: "destructive",
                            })
                          }
                        }
                      }}
                    >
                      Delete Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
