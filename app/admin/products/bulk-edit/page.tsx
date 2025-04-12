"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Save, Trash2 } from "lucide-react"
import { getProducts, updateProduct, deleteProduct } from "@/lib/product-storage"
import Image from "next/image"
import type { Product } from "@/lib/types"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const categories = [
  { value: "cameras", label: "Cameras" },
  { value: "bags", label: "Bags" },
  { value: "accessories", label: "Accessories" },
  { value: "new", label: "New Arrivals" },
]

export default function BulkEditPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [products, setProducts] = useState<Array<Product & { selected: boolean }>>([])
  const [bulkPrice, setBulkPrice] = useState<string>("")
  const [bulkPriceOperation, setBulkPriceOperation] = useState<"set" | "increase" | "decrease">("set")
  const [bulkPricePercentage, setBulkPricePercentage] = useState<boolean>(false)
  const [bulkCategory, setBulkCategory] = useState<string>("")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Get products from storage
        const storedProducts = getProducts()
        const productsWithSelection = storedProducts.map((product) => ({
          ...product,
          selected: false,
        }))
        setProducts(productsWithSelection)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching products:", error)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const toggleProductSelection = (index: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product, i) => (i === index ? { ...product, selected: !product.selected } : product)),
    )
  }

  const selectAll = () => {
    setProducts((prevProducts) => prevProducts.map((product) => ({ ...product, selected: true })))
  }

  const deselectAll = () => {
    setProducts((prevProducts) => prevProducts.map((product) => ({ ...product, selected: false })))
  }

  const applyBulkPriceChange = () => {
    if (!bulkPrice || isNaN(Number(bulkPrice))) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price value.",
        variant: "destructive",
      })
      return
    }

    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (!product.selected) return product

        let newPrice = product.price
        const priceValue = Number(bulkPrice)

        if (bulkPriceOperation === "set") {
          newPrice = priceValue
        } else if (bulkPriceOperation === "increase") {
          if (bulkPricePercentage) {
            newPrice = product.price * (1 + priceValue / 100)
          } else {
            newPrice = product.price + priceValue
          }
        } else if (bulkPriceOperation === "decrease") {
          if (bulkPricePercentage) {
            newPrice = product.price * (1 - priceValue / 100)
          } else {
            newPrice = product.price - priceValue
          }
        }

        // Ensure price is not negative
        newPrice = Math.max(0, newPrice)
        // Round to 2 decimal places
        newPrice = Math.round(newPrice * 100) / 100

        return { ...product, price: newPrice }
      }),
    )

    toast({
      title: "Prices updated",
      description: "The prices have been updated for selected products.",
    })
  }

  const applyBulkCategoryChange = () => {
    if (!bulkCategory) {
      toast({
        title: "No category selected",
        description: "Please select a category to apply.",
        variant: "destructive",
      })
      return
    }

    const selectedCount = products.filter((p) => p.selected).length
    if (selectedCount === 0) {
      toast({
        title: "No products selected",
        description: "Please select products to update their category.",
        variant: "destructive",
      })
      return
    }

    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (!product.selected) return product
        return { ...product, category: bulkCategory }
      }),
    )

    toast({
      title: "Categories updated",
      description: `The category has been updated for ${selectedCount} selected products.`,
    })
  }

  const handleSaveChanges = async () => {
    setSaving(true)

    try {
      const selectedProducts = products.filter((product) => product.selected)

      if (selectedProducts.length === 0) {
        throw new Error("No products selected")
      }

      // Update each selected product
      for (const product of selectedProducts) {
        const { selected, ...productData } = product
        const success = updateProduct(product.id, productData)

        if (!success) {
          console.error(`Failed to update product: ${product.id}`)
        }
      }

      toast({
        title: "Changes saved",
        description: `Successfully updated ${selectedProducts.length} products.`,
      })

      router.push("/admin/dashboard")
    } catch (error) {
      console.error("Error saving products:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save products.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteSelected = () => {
    const selectedCount = products.filter((p) => p.selected).length
    if (selectedCount === 0) {
      toast({
        title: "No products selected",
        description: "Please select products to delete.",
        variant: "destructive",
      })
      return
    }

    setShowDeleteDialog(true)
  }

  const confirmDelete = () => {
    setShowDeleteDialog(false)
    setSaving(true)

    try {
      const selectedProducts = products.filter((product) => product.selected)
      const deletedIds: string[] = []

      // Delete each selected product
      for (const product of selectedProducts) {
        const success = deleteProduct(product.id)
        if (success) {
          deletedIds.push(product.id)
        }
      }

      // Update the products list
      setProducts(products.filter((product) => !deletedIds.includes(product.id)))

      toast({
        title: "Products deleted",
        description: `Successfully deleted ${deletedIds.length} products.`,
      })

      if (products.length === deletedIds.length) {
        router.push("/admin/dashboard")
      }
    } catch (error) {
      console.error("Error deleting products:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete products.",
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
          <h1 className="text-2xl font-bold">Bulk Edit Products</h1>
        </div>
        <div className="border rounded-lg p-6 bg-white">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (products.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Bulk Edit Products</h1>
        </div>
        <div className="border rounded-lg p-6 bg-white text-center">
          <p className="mb-4">No products found to edit.</p>
          <Button asChild>
            <a href="/admin/products/new">Add Products</a>
          </Button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Bulk Edit Products</h1>
      </div>

      <div className="admin-content-container">
        <div className="border rounded-lg p-6 bg-white mb-6">
          <h2 className="text-lg font-medium mb-4">Bulk Price Update</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <Label htmlFor="bulkPriceOperation">Operation</Label>
              <select
                id="bulkPriceOperation"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={bulkPriceOperation}
                onChange={(e) => setBulkPriceOperation(e.target.value as "set" | "increase" | "decrease")}
              >
                <option value="set">Set price to</option>
                <option value="increase">Increase price by</option>
                <option value="decrease">Decrease price by</option>
              </select>
            </div>
            <div>
              <Label htmlFor="bulkPrice">Value</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="bulkPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={bulkPrice}
                  onChange={(e) => setBulkPrice(e.target.value)}
                  placeholder="Enter value"
                />
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="bulkPricePercentage"
                    checked={bulkPricePercentage}
                    onCheckedChange={(checked) => setBulkPricePercentage(checked === true)}
                    disabled={bulkPriceOperation === "set"}
                  />
                  <Label htmlFor="bulkPricePercentage" className="text-sm cursor-pointer">
                    %
                  </Label>
                </div>
              </div>
            </div>
            <div>
              <Button
                onClick={applyBulkPriceChange}
                disabled={!bulkPrice || products.filter((p) => p.selected).length === 0}
              >
                Apply to Selected
              </Button>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-6 bg-white mb-6">
          <h2 className="text-lg font-medium mb-4">Bulk Category Update</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
              <Label htmlFor="bulkCategory">Category</Label>
              <Select value={bulkCategory} onValueChange={setBulkCategory}>
                <SelectTrigger id="bulkCategory">
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
            <div>
              <Button
                onClick={applyBulkCategoryChange}
                disabled={!bulkCategory || products.filter((p) => p.selected).length === 0}
              >
                Apply to Selected
              </Button>
            </div>
          </div>
        </div>

        <div className="border rounded-lg bg-white overflow-hidden">
          <div className="p-4 border-b bg-neutral-50 flex justify-between items-center">
            <h2 className="font-medium">Products ({products.length})</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={selectAll}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={deselectAll}>
                Deselect All
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b">
                <tr>
                  <th className="w-12 p-4 text-center">
                    <span className="sr-only">Select</span>
                  </th>
                  <th className="text-left p-4">Product</th>
                  <th className="text-center p-4 w-32">Category</th>
                  <th className="text-right p-4 w-32">Price</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product.id} className="border-b">
                    <td className="p-4 text-center">
                      <Checkbox checked={product.selected} onCheckedChange={() => toggleProductSelection(index)} />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 flex-shrink-0">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-sm text-neutral-500 truncate max-w-md">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      {categories.find((c) => c.value === product.category)?.label ||
                        product.category ||
                        "Uncategorized"}
                    </td>
                    <td className="p-4 text-right font-medium">${product.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t bg-neutral-50 flex justify-end">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push("/admin/dashboard")}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteSelected}
                disabled={saving || products.filter((p) => p.selected).length === 0}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Selected
                  </>
                )}
              </Button>
              <Button onClick={handleSaveChanges} disabled={saving || products.filter((p) => p.selected).length === 0}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete {products.filter((p) => p.selected).length} selected products. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  )
}
