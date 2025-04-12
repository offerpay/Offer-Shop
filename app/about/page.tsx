import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">About Us</h1>

        <div className="mb-12 relative h-80 rounded-lg overflow-hidden">
          <Image
            src="/placeholder.svg?height=800&width=1600&text=Our+Team"
            alt="Our team"
            fill
            className="object-cover"
          />
        </div>

        <div className="prose prose-neutral max-w-none mb-12">
          <h2>Our Story</h2>
          <p>
            Founded in 2023, TechStyle was born out of a passion for bringing together cutting-edge technology and
            stylish design. Our founder, Alex Chen, noticed a gap in the market for high-quality cameras, bags, and
            accessories that combined functionality with aesthetic appeal.
          </p>

          <p>
            What started as a small online boutique has grown into a beloved destination for tech enthusiasts and
            style-conscious individuals who appreciate thoughtfully designed products. We work directly with
            manufacturers and designers to bring you unique pieces that enhance both your technical capabilities and
            personal style.
          </p>

          <h2>Our Mission</h2>
          <p>
            At TechStyle, our mission is to provide our customers with exceptional cameras, bags, and accessories that
            are not only technologically advanced but also beautifully designed. We believe that technology should be a
            seamless part of your lifestyle, which is why we carefully select our products with both functionality and
            aesthetics in mind.
          </p>

          <h2>Our Values</h2>
          <ul>
            <li>
              <strong>Quality:</strong> We never compromise on quality. Each product in our collection is carefully
              selected for its craftsmanship, durability, and technical excellence.
            </li>
            <li>
              <strong>Innovation:</strong> We are committed to offering the latest innovations in camera technology and
              design.
            </li>
            <li>
              <strong>Customer Focus:</strong> We believe in building lasting relationships with our customers through
              exceptional service and support.
            </li>
            <li>
              <strong>Education:</strong> We strive to help our customers make informed decisions by providing detailed
              product information and expert advice.
            </li>
          </ul>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
          <p className="mb-6">Have questions about our products or services? We'd love to hear from you!</p>
          <Button asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
