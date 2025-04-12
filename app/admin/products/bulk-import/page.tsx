"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Check, X, AlertCircle } from "lucide-react"
import { addProduct } from "@/lib/product-storage"
import Image from "next/image"
import type { Product } from "@/lib/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const categories = [
  { value: "cameras", label: "Cameras" },
  { value: "bags", label: "Bags" },
  { value: "accessories", label: "Accessories" },
  { value: "new", label: "New Arrivals" },
]

export default function BulkImportPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [profileUrl, setProfileUrl] = useState("")
  const [products, setProducts] = useState<Array<Product & { selected: boolean }>>([])
  const [defaultCategory, setDefaultCategory] = useState("cameras")

  const handleFetchProducts = async () => {
    if (!profileUrl) return

    setLoading(true)

    try {
      // Check if the URL is from Depop
      if (profileUrl.includes("depop.com")) {
        // Call our API to fetch products from Depop profile
        const response = await fetch("/api/fetch-depop", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: profileUrl,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }

        const depopData = await response.json()

        if (depopData.error) {
          throw new Error(depopData.error)
        }

        if (depopData.products && Array.isArray(depopData.products)) {
          // Add selected property to each product
          const productsWithSelection = depopData.products.map((product: Product) => ({
            ...product,
            selected: true,
            id: `temp-${Math.random().toString(36).substring(2, 11)}`, // Temporary ID for UI purposes
          }))

          setProducts(productsWithSelection)

          toast({
            title: "Products fetched",
            description: `Found ${depopData.products.length} products from the Depop profile.`,
          })
        } else {
          throw new Error("No products found")
        }
      } else {
        toast({
          title: "Invalid URL",
          description: "Please enter a valid Depop profile URL.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch products from Depop.",
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
        const { id, selected, ...productData } = product
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
        <h1 className="text-2xl font-bold">Bulk Import Products</h1>
      </div>

      <div className="admin-content-container">
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important Note</AlertTitle>
          <AlertDescription>
            This is a demonstration feature. In a real production environment, this would connect to the Depop API or
            use server-side scraping to fetch actual products. For this demo, we generate sample products based on the
            profile URL.
          </AlertDescription>
        </Alert>

        <div className="border rounded-lg p-6 bg-white mb-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="profileUrl">Depop Profile URL</Label>
              <div className="flex gap-2">
                <Input
                  id="profileUrl"
                  value={profileUrl}
                  onChange={(e) => setProfileUrl(e.target.value)}
                  placeholder="https://www.depop.com/username/"
                  className="flex-1"
                />
                <Button type="button" onClick={handleFetchProducts} disabled={loading || !profileUrl}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Fetching...
                    </>
                  ) : (
                    "Fetch Products"
                  )}
                </Button>
              </div>
              <p className="text-sm text-neutral-500 mt-1">
                Enter a Depop profile URL to fetch all products from that seller.
              </p>
            </div>
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
                  key={product.id}
                  className={`border rounded-lg overflow-hidden ${product.selected ? "border-primary" : "border-neutral-200"}`}
                >
                  <div className="relative h-48">
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
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
