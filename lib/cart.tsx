'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string | null
  slug: string
  size: string
  quantity: number
}

interface CartCtx {
  items: CartItem[]
  count: number
  total: number
  open: boolean
  setOpen: (v: boolean) => void
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string, size: string) => void
  updateQty: (id: string, size: string, qty: number) => void
  clear: () => void
}

const Ctx = createContext<CartCtx | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('micron_cart')
      if (saved) setItems(JSON.parse(saved))
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem('micron_cart', JSON.stringify(items))
  }, [items])

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id && i.size === item.size)
      if (existing) {
        return prev.map(i =>
          i.id === item.id && i.size === item.size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
    setOpen(true)
  }, [])

  const removeItem = useCallback((id: string, size: string) => {
    setItems(prev => prev.filter(i => !(i.id === id && i.size === size)))
  }, [])

  const updateQty = useCallback((id: string, size: string, qty: number) => {
    if (qty <= 0) { removeItem(id, size); return }
    setItems(prev => prev.map(i =>
      i.id === id && i.size === size ? { ...i, quantity: qty } : i
    ))
  }, [removeItem])

  const clear = useCallback(() => setItems([]), [])

  const count = items.reduce((s, i) => s + i.quantity, 0)
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)

  return (
    <Ctx.Provider value={{ items, count, total, open, setOpen, addItem, removeItem, updateQty, clear }}>
      {children}
    </Ctx.Provider>
  )
}

export function useCart() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCart must be inside CartProvider')
  return ctx
}
