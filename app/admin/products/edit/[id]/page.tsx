"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import AdminLayout from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import type { Product } from "@/lib/types"
import { Loader2 } from "lucide-react"
import { getProductById, updateProduct } from "@/lib/product-storage"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const categories = [
  { value: "cameras", label: "Cameras" },
  { value: "bags", label: "Bags" },
  { value: "accessories", label: "Accessories" },
  { value: "new", label: "New Arrivals" },
]

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Omit<Product, "id">>({
    name: "",
    price: 0,
    description: "",
    image: "",
    sourceUrl: "",
    category: "cameras", // Default category
  })

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Get product from storage
        const product = getProductById(params.id as string)

        if (product) {
          setFormData({
            name: product.name,
            price: product.price,
            description: product.description,
            image: product.image,
            sourceUrl: product.sourceUrl,
            category: product.category || "cameras", // Default to cameras if no category
          })
        } else {
          toast({
            title: "Product not found",
            description: "The product you are trying to edit does not exist.",
            variant: "destructive",
          })
          router.push("/admin/dashboard")
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching product:", error)
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }))
  }

  const handleFetchData = async () => {
    if (!formData.sourceUrl) return

    setLoading(true)

    try {
      // Check if the URL is from Depop
      if (formData.sourceUrl.includes("depop.com")) {
        // Call our API to fetch product data from Depop
        const response = await fetch("/api/fetch-depop", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: formData.sourceUrl,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to fetch product data")
        }

        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        // Update form with fetched data
        setFormData((prev) => ({
          ...prev,
          name: data.name || prev.name,
          price: data.price || prev.price,
          description: data.description || prev.description,
          image: data.image || prev.image,
          // Keep the current category
        }))

        toast({
          title: "Data fetched from Depop",
          description: "Product information has been updated from Depop.",
        })
      } else {
        toast({
          title: "Could not fetch data",
          description:
            "Unable to extract product information from the provided URL. Make sure it's a valid Depop product URL.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching product data:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch product data from the source URL.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Validate required fields
      if (!formData.name || !formData.price || !formData.description || !formData.image || !formData.category) {
        throw new Error("Please fill in all required fields")
      }

      // Update the product in storage
      const updatedProduct = updateProduct(params.id as string, {
        name: formData.name,
        price: formData.price,
        description: formData.description,
        image: formData.image,
        sourceUrl: formData.sourceUrl,
        category: formData.category,
      })

      if (!updatedProduct) {
        throw new Error("Failed to update product")
      }

      toast({
        title: "Product updated",
        description: "The product has been successfully updated.",
      })

      router.push("/admin/dashboard")
    } catch (error) {
      console.error("Error updating product:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update the product.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Edit Product</h1>
        </div>

        <div className="border rounded-lg p-6 bg-white">
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-neutral-100 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Product</h1>
      </div>

      <div className="admin-content-container">
        <div className="border rounded-lg p-6 bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <Label htmlFor="sourceUrl">Source URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="sourceUrl"
                    name="sourceUrl"
                    value={formData.sourceUrl}
                    onChange={handleChange}
                    placeholder="https://www.depop.com/products/username-product-name/"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleFetchData}
                    disabled={loading || !formData.sourceUrl}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Fetching...
                      </>
                    ) : (
                      "Fetch Data"
                    )}
                  </Button>
                </div>
                <p className="text-sm text-neutral-500 mt-1">
                  Enter the URL of a Depop product listing to automatically fetch product details.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={handleCategoryChange}>
                    <SelectTrigger id="category">
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
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  required
                />
              </div>

              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="/placeholder.svg or https://example.com/image.jpg"
                  required
                />
                {formData.image && (
                  <div className="mt-2 border rounded p-4 w-full">
                    <div className="relative h-64 w-full md:w-1/3 mx-auto">
                      <Image
                        src={formData.image || "/placeholder.svg"}
                        alt="Product preview"
                        fill
                        className="object-contain"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=600&width=600&text=Image+Error"
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="form-buttons">
              <div className="flex gap-4">
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push("/admin/dashboard")}>
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}
