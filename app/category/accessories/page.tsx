import ProductGrid from "@/components/product-grid"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Accessories | Fashion Store",
  description: "Shop our collection of premium accessories to complete your look.",
}

export default function AccessoriesPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Accessories</h1>
        <p className="text-neutral-600">
          Complete your look with our premium accessories. From watches to scarves, our accessories add the perfect
          finishing touch to any outfit.
        </p>
      </div>

      <ProductGrid category="accessories" />
    </div>
  )
}
