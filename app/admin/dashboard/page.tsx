"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/types"
import AdminLayout from "@/components/admin-layout"
import { PlusCircle, Download, Edit, FileCode } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getProducts, deleteProduct } from "@/lib/product-storage"
import { toast } from "@/components/ui/use-toast"

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if admin is authenticated
    const isAuthenticated = localStorage.getItem("adminAuthenticated") === "true"
    if (!isAuthenticated) {
      router.push("/admin")
      return
    }

    const fetchProducts = async () => {
      try {
        // Get products from storage
        const storedProducts = getProducts()
        setProducts(storedProducts)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching products:", error)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [router])

  const handleDeleteProduct = (id: string) => {
    try {
      const success = deleteProduct(id)

      if (success) {
        setProducts(products.filter((product) => product.id !== id))
        toast({
          title: "Product deleted",
          description: "The product has been successfully deleted.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to delete the product.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: "Failed to delete the product.",
        variant: "destructive",
      })
    }
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex gap-2 flex-wrap">
          <Button asChild variant="outline">
            <Link href="/admin/products/bulk-edit">
              <Edit className="h-4 w-4 mr-2" />
              Bulk Edit
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/products/html-import">
              <FileCode className="h-4 w-4 mr-2" />
              HTML Import
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/products/bulk-import">
              <Download className="h-4 w-4 mr-2" />
              Bulk Import
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/products/new">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      <div className="admin-content-container">
        {loading ? (
          <div className="grid grid-cols-1 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-neutral-100 rounded animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            {products.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-neutral-500 mb-4">No products found</p>
                <div className="flex gap-2 justify-center flex-wrap">
                  <Button asChild variant="outline">
                    <Link href="/admin/products/html-import">Import from HTML</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/admin/products/bulk-import">Bulk Import Products</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/admin/products/new">Add Your First Product</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 border-b">
                    <tr>
                      <th className="text-left p-4">Product</th>
                      <th className="text-right p-4">Price</th>
                      <th className="text-right p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b">
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
                        <td className="p-4 text-right">${product.price.toFixed(2)}</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/admin/products/edit/${product.id}`}>Edit</Link>
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
