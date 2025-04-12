import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <div className="relative h-[70vh] bg-neutral-100">
      <div className="absolute inset-0 bg-[url('https://cdn.lowepro.com/media/wysiwyg/Lowepro/2022/Guides/camera-backpack-guide/csm_guide_street_Protactic_f257aa6bad.jpg')] bg-cover bg-center opacity-90"></div>
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Capture Every Moment</h1>
        <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl">
          Discover our curated collection of premium cameras, bags, and accessories for tech enthusiasts and
          style-conscious individuals.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/category/cameras">Shop Now</Link>
          </Button>
          <Button size="lg" variant="outline" className="bg-white/20 text-white hover:bg-white/30" asChild>
            <Link href="/category/cameras">Explore Cameras</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
