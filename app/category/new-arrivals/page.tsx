import ProductGrid from "@/components/product-grid"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "New Arrivals | TechStyle",
  description: "Check out our latest cameras, bags, and accessories.",
}

export default function NewArrivalsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">New Arrivals</h1>
        <p className="text-neutral-600">
          Discover our latest additions to our collection of premium cameras, bags, and accessories. Be the first to get
          your hands on these exciting new products.
        </p>
      </div>

      <ProductGrid category="new" />
    </div>
  )
}
