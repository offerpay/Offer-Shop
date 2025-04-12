import ProductGrid from "@/components/product-grid"
import Hero from "@/components/hero"
import FeaturedCategories from "@/components/featured-categories"
import Newsletter from "@/components/newsletter"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Products</h2>
        <ProductGrid />
      </div>
      <FeaturedCategories />
      <Newsletter />
    </main>
  )
}
