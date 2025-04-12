import type { Product } from "@/lib/types"

// Initial demo products
const initialProducts: Product[] = [
  {
    id: "1",
    name: "Designer Tote Bag",
    price: 129.99,
    image: "/placeholder.svg?height=600&width=600",
    description: "A stylish tote bag perfect for everyday use.",
    sourceUrl: "https://example.com/original-product-1",
    category: "bags",
  },
  {
    id: "2",
    name: "Leather Crossbody",
    price: 89.99,
    image: "/placeholder.svg?height=600&width=600",
    description: "Elegant crossbody bag made from premium leather.",
    sourceUrl: "https://example.com/original-product-2",
    category: "bags",
  },
  {
    id: "3",
    name: "Canvas Backpack",
    price: 69.99,
    image: "/placeholder.svg?height=600&width=600",
    description: "Durable canvas backpack with multiple compartments.",
    sourceUrl: "https://example.com/original-product-3",
    category: "bags",
  },
  {
    id: "4",
    name: "Digital SLR Camera",
    price: 899.99,
    image: "/placeholder.svg?height=600&width=600",
    description: "Professional digital SLR camera with 24MP sensor.",
    sourceUrl: "https://example.com/original-product-4",
    category: "cameras",
  },
  {
    id: "5",
    name: "Mirrorless Camera",
    price: 799.99,
    image: "/placeholder.svg?height=600&width=600",
    description: "Compact mirrorless camera with 4K video capability.",
    sourceUrl: "https://example.com/original-product-5",
    category: "cameras",
  },
  {
    id: "6",
    name: "Camera Lens Filter",
    price: 49.99,
    image: "/placeholder.svg?height=600&width=600",
    description: "Professional UV filter for camera lenses.",
    sourceUrl: "https://example.com/original-product-6",
    category: "accessories",
  },
]

/**
 * Get all products from storage
 */
export function getProducts(): Product[] {
  if (typeof window === "undefined") {
    return initialProducts
  }

  const storedProducts = localStorage.getItem("products")
  if (!storedProducts) {
    // Initialize with demo products if none exist
    localStorage.setItem("products", JSON.stringify(initialProducts))
    return initialProducts
  }

  try {
    return JSON.parse(storedProducts)
  } catch (error) {
    console.error("Error parsing products from localStorage:", error)
    return initialProducts
  }
}

/**
 * Get a single product by ID
 */
export function getProductById(id: string): Product | undefined {
  const products = getProducts()
  return products.find((product) => product.id === id)
}

/**
 * Add a new product
 */
export function addProduct(product: Omit<Product, "id">): Product {
  const products = getProducts()

  // Generate a unique ID
  const newId = Date.now().toString()

  const newProduct: Product = {
    ...product,
    id: newId,
  }

  // Add to products array
  const updatedProducts = [...products, newProduct]
  localStorage.setItem("products", JSON.stringify(updatedProducts))

  return newProduct
}

/**
 * Update an existing product
 */
export function updateProduct(id: string, updatedProduct: Omit<Product, "id">): Product | null {
  const products = getProducts()
  const index = products.findIndex((product) => product.id === id)

  if (index === -1) {
    console.error(`Product with ID ${id} not found`)
    return null
  }

  const product: Product = {
    ...updatedProduct,
    id,
  }

  products[index] = product
  localStorage.setItem("products", JSON.stringify(products))
  console.log(`Updated product ${id} with category: ${updatedProduct.category}`)

  return product
}

/**
 * Delete a product
 */
export function deleteProduct(id: string): boolean {
  const products = getProducts()
  const updatedProducts = products.filter((product) => product.id !== id)

  if (updatedProducts.length === products.length) {
    return false
  }

  localStorage.setItem("products", JSON.stringify(updatedProducts))
  return true
}
