"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Check, X } from "lucide-react"
import { addProduct } from "@/lib/product-storage"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ExtractedProduct {
  name: string
  price: number
  description: string
  image: string
  sourceUrl: string
  selected: boolean
  category?: string
}

const categories = [
  { value: "cameras", label: "Cameras" },
  { value: "bags", label: "Bags" },
  { value: "accessories", label: "Accessories" },
  { value: "new", label: "New Arrivals" },
]

export default function HtmlImportPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [htmlCode, setHtmlCode] = useState("")
  const [products, setProducts] = useState<ExtractedProduct[]>([])
  const [defaultCategory, setDefaultCategory] = useState("cameras")

  const extractProductsFromHtml = (html: string) => {
    try {
      // Create a DOM parser
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, "text/html")

      const extractedProducts: ExtractedProduct[] = []

      // This is a generic extraction logic - you may need to adjust based on the actual HTML structure
      // Look for product containers
      const productElements = doc.querySelectorAll(
        ".product-item, .product-card, [data-product], .item, article, .card, .product, li",
      )

      productElements.forEach((element, index) => {
        const product = extractProductData(element, index)
        if (product) extractedProducts.push(product)
      })

      // If still no products found, try to extract from the entire document
      if (extractedProducts.length === 0) {
        // Look for all images that might be product images
        const images = doc.querySelectorAll("img")
        images.forEach((img, index) => {
          const imgSrc = img.getAttribute("src") || ""
          if (!imgSrc) return

          // Try to find product info near this image
          const parent = img.closest("div, article, section, li")
          if (parent) {
            const product = extractProductData(parent, index)
            if (product) extractedProducts.push(product)
          }
        })
      }

      return extractedProducts
    } catch (error) {
      console.error("Error parsing HTML:", error)
      return []
    }
  }

  const extractProductData = (element: Element, index: number): ExtractedProduct | null => {
    // Try to extract product name from href attribute
    let name = ""
    let sourceUrl = ""

    // First try to find links with href containing "/products/"
    const productLinks = element.querySelectorAll('a[href*="/products/"]')
    if (productLinks.length > 0) {
      const href = productLinks[0].getAttribute("href") || ""
      sourceUrl = href

      // Extract product name from URL path
      if (href.includes("/products/")) {
        const pathParts = href.split("/products/")[1].split("/")[0].split("-")
        // Remove the first word as instructed
        if (pathParts.length > 1) {
          pathParts.shift() // Remove first word
          name = pathParts.join(" ")
        } else {
          name = pathParts[0]
        }
      }
    }

    // If no name found from href, try other methods
    if (!name) {
      const nameElement = element.querySelector("h1, h2, h3, h4, .product-name, .title")
      if (nameElement) {
        name = nameElement.textContent?.trim() || ""
      }
    }

    // Try to extract price - look specifically for elements with Price in aria-label or class
    let price = 0
    const priceElements = element.querySelectorAll(
      '[aria-label="Price"], .price, [class*="price"], [data-price], .product-price',
    )

    if (priceElements.length > 0) {
      const priceText = priceElements[0].textContent || ""
      // Extract numbers from the price text
      const priceMatch = priceText.match(/[\d,.]+/)
      if (priceMatch) {
        // Convert to number, removing any non-numeric characters except decimal point
        price = Number.parseFloat(priceMatch[0].replace(/[^\d.]/g, ""))
      }
    }

    // Try to extract image
    let image = ""
    const imgElements = element.querySelectorAll("img")
    if (imgElements.length > 0) {
      // Get the first image
      image = imgElements[0].getAttribute("src") || imgElements[0].getAttribute("data-src") || ""

      // Replace P10.jpg with P0.jpg as instructed
      if (image.includes("P10.jpg")) {
        image = image.replace("P10.jpg", "P0.jpg")
      }

      // Make sure the image URL is absolute
      if (image && !image.startsWith("http") && !image.startsWith("/")) {
        image = "/" + image
      }
    }

    // Try to extract description
    let description = ""
    const descElement = element.querySelector(".description, .product-description, p")
    if (descElement) {
      description = descElement.textContent?.trim() || ""
    }

    // If we couldn't extract essential information, return null
    if (!name && !image) {
      return null
    }

    // Use defaults for missing data
    name = name || `Product ${index + 1}`
    price = price || 29.99
    description = description || `Description for ${name}`
    image = image || "/placeholder.svg?height=600&width=600"

    // Capitalize first letter of each word in name
    name = name.replace(/\b\w/g, (char) => char.toUpperCase())

    return {
      name,
      price,
      description,
      image,
      sourceUrl,
      selected: true,
    }
  }

  const handleExtractProducts = () => {
    if (!htmlCode.trim()) {
      toast({
        title: "No HTML provided",
        description: "Please paste HTML code to extract products.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const extractedProducts = extractProductsFromHtml(htmlCode)

      if (extractedProducts.length === 0) {
        toast({
          title: "No products found",
          description: "Could not extract any products from the provided HTML. Please check the format.",
          variant: "destructive",
        })
      } else {
        setProducts(extractedProducts)
        toast({
          title: "Products extracted",
          description: `Successfully extracted ${extractedProducts.length} products from the HTML.`,
        })
      }
    } catch (error) {
      console.error("Error extracting products:", error)
      toast({
        title: "Error",
        description: "Failed to extract products from the HTML code.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleProductSelection = (index: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product, i) => (i === index ? { ...product, selected: !product.selected } : product)),
    )
  }

  const handleImportSelected = async () => {
    setLoading(true)

    try {
      const selectedProducts = products.filter((product) => product.selected)

      if (selectedProducts.length === 0) {
        throw new Error("No products selected")
      }

      // Import each selected product
      for (const product of selectedProducts) {
        const { selected, ...productData } = product
        addProduct({
          ...productData,
          category: defaultCategory, // Use the selected default category
        })
      }

      toast({
        title: "Products imported",
        description: `Successfully imported ${selectedProducts.length} products.`,
      })

      router.push("/admin/dashboard")
    } catch (error) {
      console.error("Error importing products:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to import products.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Import Products from HTML</h1>
      </div>

      <div className="admin-content-container">
        <div className="border rounded-lg p-6 bg-white mb-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="htmlCode">HTML Code</Label>
              <Textarea
                id="htmlCode"
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
                placeholder="Paste HTML code here..."
                className="min-h-[200px] font-mono text-sm"
              />
              <p className="text-sm text-neutral-500 mt-1">
                Paste the HTML code from a product page to extract product information.
              </p>
            </div>
            <Button onClick={handleExtractProducts} disabled={loading || !htmlCode.trim()}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Extracting...
                </>
              ) : (
                "Extract Products"
              )}
            </Button>
          </div>
        </div>

        {products.length > 0 && (
          <div className="border rounded-lg bg-white overflow-hidden">
            <div className="p-4 border-b bg-neutral-50 flex justify-between items-center">
              <h2 className="font-medium">Found {products.length} Products</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setProducts(products.map((p) => ({ ...p, selected: true })))}
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setProducts(products.map((p) => ({ ...p, selected: false })))}
                >
                  Deselect All
                </Button>
              </div>
            </div>

            <div className="p-4 border-b bg-neutral-100">
              <div className="flex items-center gap-4">
                <div className="w-40">
                  <Label htmlFor="defaultCategory">Default Category</Label>
                  <Select value={defaultCategory} onValueChange={setDefaultCategory}>
                    <SelectTrigger id="defaultCategory">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-sm text-neutral-500">All imported products will be assigned to this category</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {products.map((product, index) => (
                <div
                  key={index}
                  className={`border rounded-lg overflow-hidden ${product.selected ? "border-primary" : "border-neutral-200"}`}
                >
                  <div className="relative h-48">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=600&width=600&text=Image+Error"
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => toggleProductSelection(index)}
                      className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                        product.selected
                          ? "bg-primary text-white"
                          : "bg-white text-neutral-500 border border-neutral-300"
                      }`}
                    >
                      {product.selected ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium truncate">{product.name}</h3>
                    <p className="text-sm text-neutral-500 truncate">{product.description}</p>
                    <p className="font-bold mt-1">${product.price.toFixed(2)}</p>
                    <p className="text-xs text-neutral-500 mt-1">
                      Category: {categories.find((c) => c.value === defaultCategory)?.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t bg-neutral-50 flex justify-end">
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => router.push("/admin/dashboard")}>
                  Cancel
                </Button>
                <Button
                  onClick={handleImportSelected}
                  disabled={loading || products.filter((p) => p.selected).length === 0}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    `Import ${products.filter((p) => p.selected).length} Products`
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
