"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import AdminLayout from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Loader2, ArrowLeft, Mail, Phone, MapPin, ShoppingBag } from "lucide-react"
import { getCustomerById, getOrderById, deleteCustomer } from "@/lib/order-storage"
import type { Customer, Order } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function CustomerDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const customerData = getCustomerById(params.id as string)

        if (!customerData) {
          toast({
            title: "Customer not found",
            description: "The customer you are looking for does not exist.",
            variant: "destructive",
          })
          router.push("/admin/customers")
          return
        }

        setCustomer(customerData)

        // Fetch customer's orders
        const customerOrders = customerData.orders.map((orderId) => getOrderById(orderId)).filter(Boolean) as Order[]
        setOrders(customerOrders)

        setLoading(false)
      } catch (error) {
        console.error("Error fetching customer details:", error)
        setLoading(false)
      }
    }

    fetchCustomerDetails()
  }, [params.id, router])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Processing
          </Badge>
        )
      case "shipped":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Shipped
          </Badge>
        )
      case "delivered":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Delivered
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const calculateTotalSpent = () => {
    return orders.reduce((total, order) => total + order.totalAmount, 0).toFixed(2)
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.push("/admin/customers")}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Customers
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

  if (!customer) {
    return (
      <AdminLayout>
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.push("/admin/customers")}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Customers
          </Button>
        </div>
        <div className="border rounded-lg p-6 bg-white text-center">
          <p className="text-neutral-500 mb-4">Customer not found</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push("/admin/customers")}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Customers
          </Button>
          <h1 className="text-2xl font-bold">Customer Profile</h1>
        </div>
      </div>

      <div className="admin-content-container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{customer.fullName}</CardTitle>
                  <CardDescription>Customer since {formatDate(customer.createdAt)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-neutral-500" />
                      <span>{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-neutral-500" />
                      <span>{customer.phone}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-neutral-500 mt-0.5" />
                      <div>
                        <p>{customer.address}</p>
                        <p>
                          {customer.city}, {customer.postalCode}
                        </p>
                        <p>{customer.country.toUpperCase()}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Total Orders</span>
                      <span className="font-medium">{orders.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Total Spent</span>
                      <span className="font-medium">${calculateTotalSpent()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Average Order Value</span>
                      <span className="font-medium">
                        $
                        {orders.length > 0
                          ? (Number.parseFloat(calculateTotalSpent()) / orders.length).toFixed(2)
                          : "0.00"}
                      </span>
                    </div>
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
                      Deleting a customer will permanently remove all their data, including order history. This action
                      cannot be undone.
                    </p>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        if (
                          window.confirm("Are you sure you want to delete this customer? This action cannot be undone.")
                        ) {
                          try {
                            const success = deleteCustomer(customer.id)
                            if (success) {
                              toast({
                                title: "Customer deleted",
                                description: "The customer has been successfully deleted.",
                              })
                              router.push("/admin/customers")
                            } else {
                              throw new Error("Failed to delete customer")
                            }
                          } catch (error) {
                            console.error("Error deleting customer:", error)
                            toast({
                              title: "Error",
                              description: "Failed to delete the customer.",
                              variant: "destructive",
                            })
                          }
                        }
                      }}
                    >
                      Delete Customer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Order History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-neutral-500">No orders found for this customer</p>
                  </div>
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-neutral-50 border-b">
                        <tr>
                          <th className="text-left p-4">Order ID</th>
                          <th className="text-left p-4">Date</th>
                          <th className="text-right p-4">Total</th>
                          <th className="text-center p-4">Status</th>
                          <th className="text-right p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-b">
                            <td className="p-4 font-mono text-sm">{order.id}</td>
                            <td className="p-4">{formatDate(order.createdAt)}</td>
                            <td className="p-4 text-right font-medium">${order.totalAmount.toFixed(2)}</td>
                            <td className="p-4 text-center">{getStatusBadge(order.status)}</td>
                            <td className="p-4 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push(`/admin/orders/${order.id}`)}
                              >
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
