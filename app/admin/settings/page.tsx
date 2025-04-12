"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Save } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"

// Importar las funciones de autenticación
import { getAdminCredentials, updateAdminCredentials } from "@/lib/admin-auth"

interface SiteSettings {
  siteName: string
  siteDescription: string
  contactEmail: string
  contactPhone: string
  contactAddress: string
  socialLinks: {
    facebook: string
    instagram: string
    twitter: string
  }
  seo: {
    metaTitle: string
    metaDescription: string
    keywords: string
    googleAnalyticsId: string
  }
  features: {
    enableReviews: boolean
    enableWishlist: boolean
    enableComparisons: boolean
    enableNewsletter: boolean
  }
}

const defaultSettings: SiteSettings = {
  siteName: "Offers Shop",
  siteDescription: "Premium cameras, bags, and accessories for tech enthusiasts.",
  contactEmail: "contact@offerpay.shop",
  contactPhone: "+1 (917) 208-4154",
  contactAddress: "123 Tech Avenue\nNew York, NY 10001\nUnited States",
  socialLinks: {
    facebook: "https://facebook.com/offersshop",
    instagram: "https://instagram.com/offersshop",
    twitter: "https://twitter.com/offersshop",
  },
  seo: {
    metaTitle: "Offers Shop | Premium Cameras, Bags & Accessories",
    metaDescription: "Shop the latest cameras, bags, and accessories for tech enthusiasts.",
    keywords: "cameras, bags, accessories, tech, photography, offers, shop",
    googleAnalyticsId: "",
  },
  features: {
    enableReviews: true,
    enableWishlist: false,
    enableComparisons: false,
    enableNewsletter: true,
  },
}

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)

  // Agregar un nuevo estado para las credenciales de administrador
  const [adminCredentials, setAdminCredentials] = useState({
    username: "",
    password: "",
  })

  useEffect(() => {
    // Check if admin is authenticated
    const isAuthenticated = localStorage.getItem("adminAuthenticated") === "true"
    if (!isAuthenticated) {
      router.push("/admin")
      return
    }

    // Load settings from localStorage
    const loadSettings = () => {
      try {
        const storedSettings = localStorage.getItem("siteSettings")
        if (storedSettings) {
          setSettings(JSON.parse(storedSettings))
        }

        // Cargar credenciales de administrador
        const adminCreds = getAdminCredentials()
        setAdminCredentials({
          username: adminCreds.username,
          password: "", // No mostrar la contraseña actual por seguridad
        })
      } catch (error) {
        console.error("Error loading settings:", error)
        toast({
          title: "Error",
          description: "Failed to load settings.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // Handle nested properties
    if (name.includes(".")) {
      const [section, field] = name.split(".")
      setSettings((prev) => ({
        ...prev,
        [section]: {
          ...prev[section as keyof SiteSettings],
          [field]: value,
        },
      }))
    } else {
      setSettings((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleFeatureToggle = (feature: keyof SiteSettings["features"], checked: boolean) => {
    setSettings((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: checked,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Save settings to localStorage
      localStorage.setItem("siteSettings", JSON.stringify(settings))

      toast({
        title: "Settings saved",
        description: "Your settings have been successfully saved.",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings.",
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
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        <div className="border rounded-lg p-6 bg-white">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="admin-content-container">
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="social">Social Media</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="admin">Admin Credentials</TabsTrigger>
            </TabsList>

            <div className="border rounded-lg bg-white overflow-hidden">
              <TabsContent value="general" className="p-6 space-y-6">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    name="siteName"
                    value={settings.siteName}
                    onChange={handleChange}
                    className="max-w-md"
                  />
                </div>

                <div>
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    name="siteDescription"
                    value={settings.siteDescription}
                    onChange={handleChange}
                    rows={3}
                    className="max-w-md"
                  />
                </div>
              </TabsContent>

              <TabsContent value="contact" className="p-6 space-y-6">
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={handleChange}
                    className="max-w-md"
                  />
                </div>

                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={settings.contactPhone}
                    onChange={handleChange}
                    className="max-w-md"
                  />
                </div>

                <div>
                  <Label htmlFor="contactAddress">Contact Address</Label>
                  <Textarea
                    id="contactAddress"
                    name="contactAddress"
                    value={settings.contactAddress}
                    onChange={handleChange}
                    rows={3}
                    className="max-w-md"
                  />
                </div>
              </TabsContent>

              <TabsContent value="social" className="p-6 space-y-6">
                <div>
                  <Label htmlFor="socialLinks.facebook">Facebook URL</Label>
                  <Input
                    id="socialLinks.facebook"
                    name="socialLinks.facebook"
                    value={settings.socialLinks.facebook}
                    onChange={handleChange}
                    className="max-w-md"
                  />
                </div>

                <div>
                  <Label htmlFor="socialLinks.instagram">Instagram URL</Label>
                  <Input
                    id="socialLinks.instagram"
                    name="socialLinks.instagram"
                    value={settings.socialLinks.instagram}
                    onChange={handleChange}
                    className="max-w-md"
                  />
                </div>

                <div>
                  <Label htmlFor="socialLinks.twitter">Twitter URL</Label>
                  <Input
                    id="socialLinks.twitter"
                    name="socialLinks.twitter"
                    value={settings.socialLinks.twitter}
                    onChange={handleChange}
                    className="max-w-md"
                  />
                </div>
              </TabsContent>

              <TabsContent value="seo" className="p-6 space-y-6">
                <div>
                  <Label htmlFor="seo.metaTitle">Meta Title</Label>
                  <Input
                    id="seo.metaTitle"
                    name="seo.metaTitle"
                    value={settings.seo.metaTitle}
                    onChange={handleChange}
                    className="max-w-md"
                  />
                </div>

                <div>
                  <Label htmlFor="seo.metaDescription">Meta Description</Label>
                  <Textarea
                    id="seo.metaDescription"
                    name="seo.metaDescription"
                    value={settings.seo.metaDescription}
                    onChange={handleChange}
                    rows={3}
                    className="max-w-md"
                  />
                </div>

                <div>
                  <Label htmlFor="seo.keywords">Keywords (comma separated)</Label>
                  <Input
                    id="seo.keywords"
                    name="seo.keywords"
                    value={settings.seo.keywords}
                    onChange={handleChange}
                    className="max-w-md"
                  />
                </div>

                <div>
                  <Label htmlFor="seo.googleAnalyticsId">Google Analytics ID</Label>
                  <Input
                    id="seo.googleAnalyticsId"
                    name="seo.googleAnalyticsId"
                    value={settings.seo.googleAnalyticsId}
                    onChange={handleChange}
                    placeholder="G-XXXXXXXXXX or UA-XXXXXXXX-X"
                    className="max-w-md"
                  />
                  <p className="text-sm text-neutral-500 mt-1">
                    Enter your Google Analytics tracking ID (e.g., G-XXXXXXXXXX for GA4 or UA-XXXXXXXX-X for Universal
                    Analytics)
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="features" className="p-6 space-y-6">
                <div className="flex items-center justify-between max-w-md">
                  <div>
                    <Label htmlFor="features.enableReviews" className="block mb-1">
                      Product Reviews
                    </Label>
                    <p className="text-sm text-neutral-500">Allow customers to leave reviews on products</p>
                  </div>
                  <Switch
                    id="features.enableReviews"
                    checked={settings.features.enableReviews}
                    onCheckedChange={(checked) => handleFeatureToggle("enableReviews", checked)}
                  />
                </div>

                <div className="flex items-center justify-between max-w-md">
                  <div>
                    <Label htmlFor="features.enableWishlist" className="block mb-1">
                      Wishlist
                    </Label>
                    <p className="text-sm text-neutral-500">Allow customers to save products to a wishlist</p>
                  </div>
                  <Switch
                    id="features.enableWishlist"
                    checked={settings.features.enableWishlist}
                    onCheckedChange={(checked) => handleFeatureToggle("enableWishlist", checked)}
                  />
                </div>

                <div className="flex items-center justify-between max-w-md">
                  <div>
                    <Label htmlFor="features.enableComparisons" className="block mb-1">
                      Product Comparisons
                    </Label>
                    <p className="text-sm text-neutral-500">Allow customers to compare multiple products</p>
                  </div>
                  <Switch
                    id="features.enableComparisons"
                    checked={settings.features.enableComparisons}
                    onCheckedChange={(checked) => handleFeatureToggle("enableComparisons", checked)}
                  />
                </div>

                <div className="flex items-center justify-between max-w-md">
                  <div>
                    <Label htmlFor="features.enableNewsletter" className="block mb-1">
                      Newsletter
                    </Label>
                    <p className="text-sm text-neutral-500">Show newsletter signup form</p>
                  </div>
                  <Switch
                    id="features.enableNewsletter"
                    checked={settings.features.enableNewsletter}
                    onCheckedChange={(checked) => handleFeatureToggle("enableNewsletter", checked)}
                  />
                </div>
              </TabsContent>
              <TabsContent value="admin" className="p-6 space-y-6">
                <div>
                  <Label htmlFor="adminUsername">Admin Username</Label>
                  <Input
                    id="adminUsername"
                    name="adminUsername"
                    value={adminCredentials.username}
                    onChange={(e) => setAdminCredentials((prev) => ({ ...prev, username: e.target.value }))}
                    className="max-w-md"
                  />
                </div>

                <div>
                  <Label htmlFor="adminPassword">Admin Password</Label>
                  <Input
                    id="adminPassword"
                    name="adminPassword"
                    type="password"
                    value={adminCredentials.password}
                    onChange={(e) => setAdminCredentials((prev) => ({ ...prev, password: e.target.value }))}
                    className="max-w-md"
                  />
                  <p className="text-sm text-neutral-500 mt-1">Leave blank to keep the current password.</p>
                </div>

                <Button
                  onClick={() => {
                    if (!adminCredentials.username) {
                      toast({
                        title: "Error",
                        description: "Username cannot be empty.",
                        variant: "destructive",
                      })
                      return
                    }

                    try {
                      const success = updateAdminCredentials({
                        username: adminCredentials.username,
                        password: adminCredentials.password || getAdminCredentials().password,
                      })

                      if (success) {
                        toast({
                          title: "Credentials updated",
                          description: "Admin credentials have been successfully updated.",
                        })
                      } else {
                        throw new Error("Failed to update credentials")
                      }
                    } catch (error) {
                      console.error("Error updating admin credentials:", error)
                      toast({
                        title: "Error",
                        description: "Failed to update admin credentials.",
                        variant: "destructive",
                      })
                    }
                  }}
                >
                  Update Credentials
                </Button>
              </TabsContent>
            </div>
          </Tabs>

          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
