export interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  sourceUrl: string
  category: string
}

export interface CartItem extends Product {
  quantity: number
}

export interface ShippingDetails {
  fullName: string
  address: string
  city: string
  postalCode: string
  country: string
  phone: string
  email: string
}

export interface Order {
  id: string
  customerId: string
  items: CartItem[]
  shippingDetails: ShippingDetails
  totalAmount: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  createdAt: string
  updatedAt: string
}

export interface Customer {
  id: string
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
  orders: string[] // Array of order IDs
  createdAt: string
}
