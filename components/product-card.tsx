"use client"

import { useState } from "react"
import Image from "next/image"
import { Trash, Edit, Minus, Plus } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Product } from "@/app/page"
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

interface ProductCardProps {
  product: Product
  onSell: (productId: string, quantity: number) => void
  onEdit: () => void
  onDelete: (productId: string) => void
  isSessionActive: boolean
}

export default function ProductCard({ product, onSell, onEdit, onDelete, isSessionActive }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isSellDialogOpen, setIsSellDialogOpen] = useState(false)

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
  }

  const handleSell = () => {
    onSell(product.id, quantity)
    setIsSellDialogOpen(false)
    setQuantity(1) // Reset quantity after selling
  }

  const profit = (product.sellPrice - product.buyPrice) * product.sold

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 bg-gray-100">
        <Image src="/placeholder.svg?height=200&width=400" alt={product.name} fill className="object-cover" />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8">
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="h-8 w-8 text-red-500 hover:text-red-600"
            >
              <Trash className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>

        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Buy price:</span>
            <span>${product.buyPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Sell price:</span>
            <span>${product.sellPrice.toFixed(2)}</span>
          </div>
          {isSessionActive && (
            <div className="flex justify-between font-medium">
              <span>Sold today:</span>
              <span>{product.sold} units</span>
            </div>
          )}
          {product.sold > 0 && (
            <div className="flex justify-between font-medium text-green-600">
              <span>Profit:</span>
              <span>${profit.toFixed(2)}</span>
            </div>
          )}
        </div>
      </CardContent>

      {isSessionActive && (
        <CardFooter className="p-4 pt-0 flex flex-col gap-3">
          <div className="flex items-center justify-between w-full">
            <span className="font-medium">Quantity:</span>
            <div className="flex items-center">
              <Button variant="outline" size="icon" onClick={decrementQuantity} className="h-8 w-8 rounded-r-none">
                <Minus className="h-3 w-3" />
                <span className="sr-only">Decrease</span>
              </Button>
              <div className="h-8 px-3 flex items-center justify-center border-y">{quantity}</div>
              <Button variant="outline" size="icon" onClick={incrementQuantity} className="h-8 w-8 rounded-l-none">
                <Plus className="h-3 w-3" />
                <span className="sr-only">Increase</span>
              </Button>
            </div>
          </div>
          <Button className="w-full" onClick={() => setIsSellDialogOpen(true)}>
            Sell
          </Button>
        </CardFooter>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {product.name} from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(product.id)} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isSellDialogOpen} onOpenChange={setIsSellDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Sale</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sell {quantity} {product.name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSell}>Confirm Sale</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
