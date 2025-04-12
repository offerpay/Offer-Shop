"use client"

import { useSearchParams } from "next/navigation"
import ProductGrid from "@/components/product-grid"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Search Results</h1>
        {query && (
          <p className="text-neutral-600">
            Showing results for: <span className="font-medium">"{query}"</span>
          </p>
        )}
      </div>

      <ProductGrid searchQuery={query} />
    </div>
  )
}
