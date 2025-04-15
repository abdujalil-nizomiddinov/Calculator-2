"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Product } from "@/app/page"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SummaryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  products: Product[]
  totalProfit: number
}

export default function SummaryDialog({ open, onOpenChange, products, totalProfit }: SummaryDialogProps) {
  // Filter products that were sold during this session
  const soldProducts = products.filter((product) => product.sold > 0)

  // Get all sales history entries from all products
  const allSalesHistory = soldProducts.flatMap((product) =>
    product.salesHistory.map((sale) => ({
      productName: product.name,
      productId: product.id,
      timestamp: sale.timestamp,
      quantity: sale.quantity,
      profit: (product.sellPrice - product.buyPrice) * sale.quantity,
    })),
  )

  // Sort sales history by timestamp (most recent first)
  const sortedSalesHistory = [...allSalesHistory].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Session Summary</DialogTitle>
          <DialogDescription>Review your sales for this session</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {soldProducts.length === 0 ? (
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <p className="text-yellow-800">No products were sold during this session.</p>
            </Card>
          ) : (
            <Tabs defaultValue="summary">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="history">Sales History</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4 mt-4">
                <h3 className="font-medium">Products Sold:</h3>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-3">Product</th>
                        <th className="text-center p-3">Quantity</th>
                        <th className="text-right p-3">Profit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {soldProducts.map((product) => {
                        const productProfit = (product.sellPrice - product.buyPrice) * product.sold

                        return (
                          <tr key={product.id} className="border-t">
                            <td className="p-3">{product.name}</td>
                            <td className="p-3 text-center">{product.sold}</td>
                            <td className="p-3 text-right">${productProfit.toFixed(2)}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                    <tfoot className="bg-muted/50 font-medium">
                      <tr className="border-t">
                        <td className="p-3" colSpan={2}>
                          Total Profit
                        </td>
                        <td className="p-3 text-right text-green-600">${totalProfit.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-4 mt-4">
                <h3 className="font-medium">Sales Timeline:</h3>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-3">Time</th>
                        <th className="text-left p-3">Product</th>
                        <th className="text-center p-3">Quantity</th>
                        <th className="text-right p-3">Profit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedSalesHistory.length > 0 ? (
                        sortedSalesHistory.map((sale, index) => (
                          <tr key={index} className="border-t">
                            <td className="p-3">{sale.timestamp}</td>
                            <td className="p-3">{sale.productName}</td>
                            <td className="p-3 text-center">{sale.quantity}</td>
                            <td className="p-3 text-right">${sale.profit.toFixed(2)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-3 text-center text-muted-foreground">
                            No sales history available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
