import type { Order, ShippingDetails, CartItem, Customer } from "@/lib/types"

// Sample orders for demonstration
const initialOrders: Order[] = [
  {
    id: "order-1",
    customerId: "customer-1",
    items: [
      {
        id: "1",
        name: "Designer Tote Bag",
        price: 129.99,
        image: "/placeholder.svg?height=600&width=600",
        description: "A stylish tote bag perfect for everyday use.",
        sourceUrl: "https://example.com/original-product-1",
        category: "bags",
        quantity: 1,
      },
      {
        id: "6",
        name: "Camera Lens Filter",
        price: 49.99,
        image: "/placeholder.svg?height=600&width=600",
        description: "Professional UV filter for camera lenses.",
        sourceUrl: "https://example.com/original-product-6",
        category: "accessories",
        quantity: 2,
      },
    ],
    shippingDetails: {
      fullName: "John Doe",
      address: "123 Main St",
      city: "New York",
      postalCode: "10001",
      country: "us",
      phone: "+1 555-123-4567",
      email: "john.doe@example.com",
    },
    totalAmount: 229.97,
    status: "delivered",
    paymentStatus: "paid",
    createdAt: "2023-12-15T10:30:00Z",
    updatedAt: "2023-12-18T14:20:00Z",
  },
  {
    id: "order-2",
    customerId: "customer-2",
    items: [
      {
        id: "4",
        name: "Digital SLR Camera",
        price: 899.99,
        image: "/placeholder.svg?height=600&width=600",
        description: "Professional digital SLR camera with 24MP sensor.",
        sourceUrl: "https://example.com/original-product-4",
        category: "cameras",
        quantity: 1,
      },
    ],
    shippingDetails: {
      fullName: "Jane Smith",
      address: "456 Oak Ave",
      city: "Los Angeles",
      postalCode: "90001",
      country: "us",
      phone: "+1 555-987-6543",
      email: "jane.smith@example.com",
    },
    totalAmount: 899.99,
    status: "shipped",
    paymentStatus: "paid",
    createdAt: "2024-01-05T15:45:00Z",
    updatedAt: "2024-01-07T09:10:00Z",
  },
  {
    id: "order-3",
    customerId: "customer-3",
    items: [
      {
        id: "2",
        name: "Leather Crossbody",
        price: 89.99,
        image: "/placeholder.svg?height=600&width=600",
        description: "Elegant crossbody bag made from premium leather.",
        sourceUrl: "https://example.com/original-product-2",
        category: "bags",
        quantity: 1,
      },
      {
        id: "5",
        name: "Mirrorless Camera",
        price: 799.99,
        image: "/placeholder.svg?height=600&width=600",
        description: "Compact mirrorless camera with 4K video capability.",
        sourceUrl: "https://example.com/original-product-5",
        category: "cameras",
        quantity: 1,
      },
    ],
    shippingDetails: {
      fullName: "Robert Johnson",
      address: "789 Pine St",
      city: "Chicago",
      postalCode: "60007",
      country: "us",
      phone: "+1 555-456-7890",
      email: "robert.johnson@example.com",
    },
    totalAmount: 889.98,
    status: "processing",
    paymentStatus: "paid",
    createdAt: "2024-02-20T08:15:00Z",
    updatedAt: "2024-02-20T08:15:00Z",
  },
]

// Sample customers for demonstration
const initialCustomers: Customer[] = [
  {
    id: "customer-1",
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 555-123-4567",
    address: "123 Main St",
    city: "New York",
    postalCode: "10001",
    country: "us",
    orders: ["order-1"],
    createdAt: "2023-12-10T08:30:00Z",
  },
  {
    id: "customer-2",
    fullName: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 555-987-6543",
    address: "456 Oak Ave",
    city: "Los Angeles",
    postalCode: "90001",
    country: "us",
    orders: ["order-2"],
    createdAt: "2024-01-03T14:45:00Z",
  },
  {
    id: "customer-3",
    fullName: "Robert Johnson",
    email: "robert.johnson@example.com",
    phone: "+1 555-456-7890",
    address: "789 Pine St",
    city: "Chicago",
    postalCode: "60007",
    country: "us",
    orders: ["order-3"],
    createdAt: "2024-02-18T11:20:00Z",
  },
]

/**
 * Get all orders from storage
 */
export function getOrders(): Order[] {
  if (typeof window === "undefined") {
    return initialOrders
  }

  const storedOrders = localStorage.getItem("orders")
  if (!storedOrders) {
    // Initialize with demo orders if none exist
    localStorage.setItem("orders", JSON.stringify(initialOrders))
    return initialOrders
  }

  try {
    return JSON.parse(storedOrders)
  } catch (error) {
    console.error("Error parsing orders from localStorage:", error)
    return initialOrders
  }
}

/**
 * Get a single order by ID
 */
export function getOrderById(id: string): Order | undefined {
  const orders = getOrders()
  return orders.find((order) => order.id === id)
}

/**
 * Add a new order
 */
export function addOrder(orderData: Omit<Order, "id" | "createdAt" | "updatedAt">): Order {
  const orders = getOrders()
  const customers = getCustomers()

  // Generate a unique ID
  const newId = `order-${Date.now()}`
  const now = new Date().toISOString()

  const newOrder: Order = {
    ...orderData,
    id: newId,
    createdAt: now,
    updatedAt: now,
  }

  // Add to orders array
  const updatedOrders = [...orders, newOrder]
  localStorage.setItem("orders", JSON.stringify(updatedOrders))

  // Update customer's orders list
  const customerIndex = customers.findIndex((c) => c.id === orderData.customerId)
  if (customerIndex >= 0) {
    customers[customerIndex].orders.push(newId)
    localStorage.setItem("customers", JSON.stringify(customers))
  }

  return newOrder
}

/**
 * Update an existing order
 */
export function updateOrder(id: string, updatedOrderData: Partial<Order>): Order | null {
  const orders = getOrders()
  const index = orders.findIndex((order) => order.id === id)

  if (index === -1) {
    return null
  }

  const updatedOrder: Order = {
    ...orders[index],
    ...updatedOrderData,
    id,
    updatedAt: new Date().toISOString(),
  }

  orders[index] = updatedOrder
  localStorage.setItem("orders", JSON.stringify(orders))

  return updatedOrder
}

/**
 * Delete an order
 */
export function deleteOrder(id: string): boolean {
  const orders = getOrders()
  const customers = getCustomers()

  const order = orders.find((o) => o.id === id)
  if (!order) return false

  // Remove order from customer's orders list
  const customerIndex = customers.findIndex((c) => c.id === order.customerId)
  if (customerIndex >= 0) {
    customers[customerIndex].orders = customers[customerIndex].orders.filter((orderId) => orderId !== id)
    localStorage.setItem("customers", JSON.stringify(customers))
  }

  // Remove order
  const updatedOrders = orders.filter((order) => order.id !== id)
  localStorage.setItem("orders", JSON.stringify(updatedOrders))

  return true
}

/**
 * Get all customers from storage
 */
export function getCustomers(): Customer[] {
  if (typeof window === "undefined") {
    return initialCustomers
  }

  const storedCustomers = localStorage.getItem("customers")
  if (!storedCustomers) {
    // Initialize with demo customers if none exist
    localStorage.setItem("customers", JSON.stringify(initialCustomers))
    return initialCustomers
  }

  try {
    return JSON.parse(storedCustomers)
  } catch (error) {
    console.error("Error parsing customers from localStorage:", error)
    return initialCustomers
  }
}

/**
 * Get a single customer by ID
 */
export function getCustomerById(id: string): Customer | undefined {
  const customers = getCustomers()
  return customers.find((customer) => customer.id === id)
}

/**
 * Get a customer by email
 */
export function getCustomerByEmail(email: string): Customer | undefined {
  const customers = getCustomers()
  return customers.find((customer) => customer.email.toLowerCase() === email.toLowerCase())
}

/**
 * Add a new customer
 */
export function addCustomer(customerData: Omit<Customer, "id" | "orders" | "createdAt">): Customer {
  const customers = getCustomers()

  // Check if customer with this email already exists
  const existingCustomer = getCustomerByEmail(customerData.email)
  if (existingCustomer) {
    return existingCustomer
  }

  // Generate a unique ID
  const newId = `customer-${Date.now()}`
  const now = new Date().toISOString()

  const newCustomer: Customer = {
    ...customerData,
    id: newId,
    orders: [],
    createdAt: now,
  }

  // Add to customers array
  const updatedCustomers = [...customers, newCustomer]
  localStorage.setItem("customers", JSON.stringify(updatedCustomers))

  return newCustomer
}

/**
 * Update an existing customer
 */
export function updateCustomer(id: string, updatedCustomerData: Partial<Customer>): Customer | null {
  const customers = getCustomers()
  const index = customers.findIndex((customer) => customer.id === id)

  if (index === -1) {
    return null
  }

  const updatedCustomer: Customer = {
    ...customers[index],
    ...updatedCustomerData,
    id,
  }

  customers[index] = updatedCustomer
  localStorage.setItem("customers", JSON.stringify(customers))

  return updatedCustomer
}

/**
 * Delete a customer
 */
export function deleteCustomer(id: string): boolean {
  const customers = getCustomers()
  const orders = getOrders()

  // Delete all orders for this customer
  const customerOrders = orders.filter((order) => order.customerId === id)
  customerOrders.forEach((order) => {
    deleteOrder(order.id)
  })

  // Delete customer
  const updatedCustomers = customers.filter((customer) => customer.id !== id)

  if (updatedCustomers.length === customers.length) {
    return false
  }

  localStorage.setItem("customers", JSON.stringify(updatedCustomers))
  return true
}

/**
 * Create an order from cart items and shipping details
 */
export function createOrderFromCheckout(
  items: CartItem[],
  shippingDetails: ShippingDetails,
  totalAmount: number,
): Order {
  // First, find or create customer
  let customer = getCustomerByEmail(shippingDetails.email)

  if (!customer) {
    customer = addCustomer({
      fullName: shippingDetails.fullName,
      email: shippingDetails.email,
      phone: shippingDetails.phone,
      address: shippingDetails.address,
      city: shippingDetails.city,
      postalCode: shippingDetails.postalCode,
      country: shippingDetails.country,
    })
  }

  // Create new order
  const order = addOrder({
    customerId: customer.id,
    items,
    shippingDetails,
    totalAmount,
    status: "pending",
    paymentStatus: "pending",
  })

  return order
}
