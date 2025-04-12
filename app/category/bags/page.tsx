import ProductGrid from "@/components/product-grid"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Bags | Fashion Store",
  description: "Shop our collection of premium bags and accessories.",
}

export default function BagsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Bags</h1>
        <p className="text-neutral-600">
          Explore our selection of stylish and functional bags. From everyday totes to elegant evening clutches, our
          collection offers the perfect bag for every occasion.
        </p>
      </div>

      <ProductGrid category="bags" />
    </div>
  )
}
