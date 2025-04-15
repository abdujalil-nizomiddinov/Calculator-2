"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import ProductCard from "@/components/product-card"
import AddProductDialog from "@/components/add-product-dialog"
import SummaryDialog from "@/components/summary-dialog"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Update the Product type to remove the optional image property
export type Product = {
  id: string
  name: string
  buyPrice: number
  sellPrice: number
  quantity: number
  sold: number
  salesHistory: Array<{
    timestamp: string
    quantity: number
  }>
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isSummaryOpen, setIsSummaryOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Load products from localStorage on initial render
  useEffect(() => {
    const savedProducts = localStorage.getItem("products")
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    }

    const sessionStatus = localStorage.getItem("sessionActive")
    if (sessionStatus === "true") {
      setIsSessionActive(true)
    }
  }, [])

  // Save products to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products))
  }, [products])

  // Save session status to localStorage
  useEffect(() => {
    localStorage.setItem("sessionActive", isSessionActive.toString())
  }, [isSessionActive])

  // Modify the handleStartSession function to reset sales history
  const handleStartSession = () => {
    // Reset sold count and sales history for all products
    setProducts((prevProducts) =>
      prevProducts.map((product) => ({
        ...product,
        sold: 0,
        salesHistory: [],
      })),
    )
    setIsSessionActive(true)
    toast({
      title: "Session started",
      description: "You can now start selling products",
    })
  }

  const handleEndSession = () => {
    setIsSessionActive(false)
    setIsSummaryOpen(true)
  }

  // Update the handleAddProduct function to not include image
  const handleAddProduct = (product: Omit<Product, "id" | "sold" | "quantity" | "salesHistory">) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      quantity: 1,
      sold: 0,
      salesHistory: [],
    }

    setProducts((prevProducts) => [...prevProducts, newProduct])
    setIsAddProductOpen(false)
    toast({
      title: "Product added",
      description: `${product.name} has been added to your inventory`,
    })
  }

  const handleEditProduct = (product: Product) => {
    setProducts((prevProducts) => prevProducts.map((p) => (p.id === product.id ? product : p)))
    setEditingProduct(null)
    toast({
      title: "Product updated",
      description: `${product.name} has been updated`,
    })
  }

  const handleDeleteProduct = (productId: string) => {
    setProducts((prevProducts) => prevProducts.filter((p) => p.id !== productId))
    toast({
      title: "Product deleted",
      description: "The product has been removed from your inventory",
    })
  }

  // Update the handleSellProduct function to record timestamps
  const handleSellProduct = (productId: string, quantity: number) => {
    const now = new Date().toLocaleString()

    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            sold: product.sold + quantity,
            salesHistory: [...product.salesHistory, { timestamp: now, quantity }],
          }
        }
        return product
      }),
    )

    const productName = products.find((p) => p.id === productId)?.name
    toast({
      title: "Sale recorded",
      description: `Sold ${quantity} ${productName}`,
    })
  }

  const calculateTotalProfit = () => {
    return products.reduce((total, product) => {
      const profit = (product.sellPrice - product.buyPrice) * product.sold
      return total + profit
    }, 0)
  }

  return (
    <main className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Sales Calculator</h1>
        <div className="space-x-4">
          {!isSessionActive ? (
            <Button onClick={handleStartSession} size="lg" className="bg-green-600 hover:bg-green-700">
              Start
            </Button>
          ) : (
            <Button onClick={handleEndSession} size="lg" className="bg-red-600 hover:bg-red-700">
              End
            </Button>
          )}
        </div>
      </div>

      {isSessionActive && (
        <div className="mb-6">
          <Card className="p-4 bg-green-50 border-green-200">
            <p className="text-green-800 font-medium">Session is active. Add products and record sales.</p>
          </Card>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Products</h2>
        <Button onClick={() => setIsAddProductOpen(true)} className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">No products added yet</p>
          <Button onClick={() => setIsAddProductOpen(true)}>Add Your First Product</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSell={handleSellProduct}
              onEdit={() => setEditingProduct(product)}
              onDelete={handleDeleteProduct}
              isSessionActive={isSessionActive}
            />
          ))}
        </div>
      )}

      <AddProductDialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen} onSave={handleAddProduct} />

      <AddProductDialog
        open={!!editingProduct}
        onOpenChange={(open) => !open && setEditingProduct(null)}
        onSave={handleEditProduct}
        product={editingProduct}
        isEditing={true}
      />

      <SummaryDialog
        open={isSummaryOpen}
        onOpenChange={setIsSummaryOpen}
        products={products}
        totalProfit={calculateTotalProfit()}
      />

      <Toaster />
    </main>
  )
}
