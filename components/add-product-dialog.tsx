"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Product } from "@/app/page"

interface AddProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (product: Omit<Product, "id" | "sold" | "quantity" | "salesHistory"> | Product) => void
  product?: Product | null
  isEditing?: boolean
}

export default function AddProductDialog({
  open,
  onOpenChange,
  onSave,
  product,
  isEditing = false,
}: AddProductDialogProps) {
  const [name, setName] = useState("")
  const [buyPrice, setBuyPrice] = useState("")
  const [sellPrice, setSellPrice] = useState("")
  const [errors, setErrors] = useState({
    name: false,
    buyPrice: false,
    sellPrice: false,
  })

  // Reset form when dialog opens/closes or product changes
  useEffect(() => {
    if (open && product) {
      setName(product.name)
      setBuyPrice(product.buyPrice.toString())
      setSellPrice(product.sellPrice.toString())
    } else if (!open) {
      // Reset form when dialog closes
      setName("")
      setBuyPrice("")
      setSellPrice("")
      setErrors({
        name: false,
        buyPrice: false,
        sellPrice: false,
      })
    }
  }, [open, product])

  const validateForm = () => {
    const newErrors = {
      name: name.trim() === "",
      buyPrice: buyPrice === "" || isNaN(Number(buyPrice)) || Number(buyPrice) < 0,
      sellPrice: sellPrice === "" || isNaN(Number(sellPrice)) || Number(sellPrice) < 0,
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some(Boolean)
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    if (isEditing && product) {
      onSave({
        ...product,
        name,
        buyPrice: Number(buyPrice),
        sellPrice: Number(sellPrice),
      })
    } else {
      onSave({
        name,
        buyPrice: Number(buyPrice),
        sellPrice: Number(sellPrice),
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Product" : "Add New Product"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-red-500 text-sm">Name is required</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="buyPrice">Buy Price</Label>
            <Input
              id="buyPrice"
              type="number"
              min="0"
              step="0.01"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              className={errors.buyPrice ? "border-red-500" : ""}
            />
            {errors.buyPrice && <p className="text-red-500 text-sm">Valid buy price is required</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sellPrice">Sell Price</Label>
            <Input
              id="sellPrice"
              type="number"
              min="0"
              step="0.01"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
              className={errors.sellPrice ? "border-red-500" : ""}
            />
            {errors.sellPrice && <p className="text-red-500 text-sm">Valid sell price is required</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{isEditing ? "Save Changes" : "Add Product"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
