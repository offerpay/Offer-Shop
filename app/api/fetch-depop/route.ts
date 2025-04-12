import { NextResponse } from "next/server"

// This is a simulated API that would normally fetch data from Depop
// In a real implementation, we would use server-side scraping or an API
export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url || !url.includes("depop.com")) {
      return NextResponse.json({ error: "Invalid URL. Please provide a valid Depop product URL." }, { status: 400 })
    }

    // Check if this is a profile URL or a product URL
    if (url.match(/depop\.com\/[^/]+\/?$/)) {
      // This is a profile URL - handle bulk import
      return handleProfileImport(url)
    } else {
      // This is a product URL - handle single product import
      return handleProductImport(url)
    }
  } catch (error) {
    console.error("Error fetching Depop data:", error)
    return NextResponse.json({ error: "Failed to fetch data from Depop" }, { status: 500 })
  }
}

async function handleProductImport(url: string) {
  try {
    // Extract username and product slug from URL (example: https://www.depop.com/products/username-product-slug/)
    const urlParts = url.split("/")
    const productIndex = urlParts.findIndex((part) => part === "products")

    if (productIndex === -1 || productIndex + 1 >= urlParts.length) {
      return NextResponse.json({ error: "Invalid Depop product URL format" }, { status: 400 })
    }

    const productIdentifier = urlParts[productIndex + 1]
    const [username, ...slugParts] = productIdentifier.split("-")
    const productName = slugParts.join(" ").replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())

    // In a real implementation, we would fetch the actual page and extract the price and image
    // For this demo, we'll generate dynamic data based on the URL

    // Generate a dynamic price based on the product name and username
    // This ensures different products have different prices
    const priceBase = productName.length * 3 + username.length * 2
    const price = Math.max(19.99, Math.min(199.99, priceBase)).toFixed(2)

    // Generate a dynamic image URL based on the product identifier
    // In a real implementation, this would be extracted from the page
    const imageId = Math.floor(Math.abs(hashCode(productIdentifier)) % 10) + 1
    const imageUrl = `/placeholder.svg?height=600&width=600&text=${encodeURIComponent(productName)}&seed=${imageId}`

    // Generate a description based on the product name
    const description = `This ${productName.toLowerCase()} is a unique fashion item from Depop seller @${username}. Perfect for any fashion enthusiast looking for distinctive pieces that stand out.`

    // Return the product data
    const productData = {
      name: productName || "Vintage Fashion Item",
      price: Number.parseFloat(price),
      description,
      image: imageUrl,
      sourceUrl: url,
    }

    return NextResponse.json(productData)
  } catch (error) {
    console.error("Error fetching Depop product:", error)
    return NextResponse.json({ error: "Failed to fetch product data from Depop" }, { status: 500 })
  }
}

async function handleProfileImport(profileUrl: string) {
  try {
    // Extract username from profile URL
    const urlParts = profileUrl.split("/")
    const username = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2] || "seller"

    // In a real implementation, we would scrape the profile page to get all products
    // For this demo, we'll generate 6 mock products

    const products = []
    const productTypes = ["Shirt", "Jacket", "Pants", "Dress", "Shoes", "Bag", "Hat", "Scarf"]

    for (let i = 0; i < 6; i++) {
      const productType = productTypes[i % productTypes.length]
      const adjectives = ["Vintage", "Modern", "Classic", "Designer", "Stylish", "Trendy"]
      const adjective = adjectives[i % adjectives.length]

      const productName = `${adjective} ${productType}`

      // Generate a dynamic price
      const price = (25 + i * 5 + (username.length % 10)).toFixed(2)

      // Generate a unique image for each product
      const imageUrl = `/placeholder.svg?height=600&width=600&text=${encodeURIComponent(productName)}&seed=${i}`

      // Generate a description
      const description = `This ${productName.toLowerCase()} is a unique fashion item from Depop seller @${username}. Perfect for any fashion enthusiast looking for distinctive pieces that stand out.`

      products.push({
        name: productName,
        price: Number.parseFloat(price),
        description,
        image: imageUrl,
        sourceUrl: `${profileUrl}/product-${i}`,
      })
    }

    return NextResponse.json({ products, count: products.length })
  } catch (error) {
    console.error("Error fetching Depop profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile data from Depop" }, { status: 500 })
  }
}

// Simple hash function to generate consistent values from strings
function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
}
