import ProductGrid from "@/components/product-grid"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cameras | Fashion Store",
  description: "Shop our collection of premium cameras and photography equipment.",
}

export default function CamerasPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Cameras</h1>
        <p className="text-neutral-600">
          Discover our collection of premium cameras and photography equipment. From digital SLRs to compact
          point-and-shoots, we have everything you need to capture life's most important moments.
        </p>
      </div>

      <ProductGrid category="cameras" />
    </div>
  )
}
