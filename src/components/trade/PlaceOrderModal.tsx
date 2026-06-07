import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { orderApi } from '@/lib/api'
import type { TradeOpportunity } from '@/types'

interface PlaceOrderModalProps {
  open: boolean
  opportunity: TradeOpportunity | null
  onClose: () => void
  onOrderPlaced: () => void
}

export function PlaceOrderModal({ open, opportunity, onClose, onOrderPlaced }: PlaceOrderModalProps) {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [quantity, setQuantity] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!opportunity) return null

  const isOwnListing = user?.id === opportunity.trader.id
  const maxQuantity = opportunity.quantity
  const qty = Number(quantity) || 0
  const total = qty * opportunity.price

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!quantity || qty <= 0) {
      addToast('Enter a valid quantity', 'error')
      return
    }
    if (qty > maxQuantity) {
      addToast(`Quantity exceeds available (${maxQuantity} ${opportunity.unit})`, 'error')
      return
    }
    setSubmitting(true)
    try {
      await orderApi.create({ opportunityId: opportunity.id, quantity: qty })
      addToast('Order placed successfully!', 'success')
      onOrderPlaced()
      onClose()
    } catch (err: any) {
      addToast(err.message || 'Failed to place order', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Place Order" size="sm">
      <div className="space-y-4">
        <div className="bg-surface-hover rounded-lg p-3 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary">Listing</span>
            <span className="text-xs font-medium text-text-primary">{opportunity.type === 'sell' ? 'SELL' : 'BUY'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary">Commodity</span>
            <span className="text-xs font-medium text-text-primary">{opportunity.commodity.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary">Seller</span>
            <span className="text-xs font-medium text-text-primary">{opportunity.trader.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary">Price</span>
            <span className="text-xs font-medium text-text-primary">${opportunity.price}/{opportunity.unit}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary">Available</span>
            <span className="text-xs font-medium text-text-primary">{opportunity.quantity} {opportunity.unit}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary">Location</span>
            <span className="text-xs font-medium text-text-primary">{opportunity.location}</span>
          </div>
        </div>

        {isOwnListing && (
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
            <p className="text-xs text-warning font-medium">This is your own listing. You cannot place an order on it.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">Quantity ({opportunity.unit}) *</label>
            <input
              type="number"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              placeholder={`Max ${maxQuantity}`}
              min="1"
              max={maxQuantity}
              step="0.01"
              disabled={submitting || isOwnListing}
              className="w-full h-9 rounded-lg bg-surface border border-border text-text-primary text-sm px-3 focus:outline-none focus:border-primary disabled:opacity-50"
              required
            />
          </div>

          {qty > 0 && (
            <div className="bg-surface-hover rounded-lg p-3 flex items-center justify-between">
              <div>
                <span className="text-xs text-text-secondary">Total</span>
                <p className="text-[10px] text-text-secondary">{qty} {opportunity.unit} × ${opportunity.price}</p>
              </div>
              <span className="text-base font-bold text-text-primary">${total.toLocaleString()}</span>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <Button type="button" variant="secondary" size="sm" fullWidth onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" fullWidth loading={submitting} disabled={submitting || isOwnListing || !quantity}>
              {submitting ? 'Placing Order...' : 'Confirm Order'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
