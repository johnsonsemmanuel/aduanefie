import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/context/ToastContext'
import { commodityApi, opportunityApi, type CommodityDto } from '@/lib/api'


interface CreateOpportunityModalProps {
  open: boolean
  onClose: () => void
  onCreated: () => void
}

export function CreateOpportunityModal({ open, onClose, onCreated }: CreateOpportunityModalProps) {
  const { addToast } = useToast()
  const [commodities, setCommodities] = useState<CommodityDto[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [commodityId, setCommodityId] = useState('')
  const [type, setType] = useState<'buy' | 'sell'>('sell')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('')
  const [price, setPrice] = useState('')
  const [location, setLocation] = useState('')
  const [quality, setQuality] = useState('Standard')
  const [description, setDescription] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')

  useEffect(() => {
    if (!open) return
    setLoading(true)
    commodityApi.list()
      .then(setCommodities)
      .catch(() => addToast('Failed to load commodities', 'error'))
      .finally(() => setLoading(false))
  }, [open, addToast])

  const selectedCommodity = commodities.find(c => c.id === commodityId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commodityId || !quantity || !unit || !price || !location) {
      addToast('Please fill in all required fields', 'error')
      return
    }
    setSubmitting(true)
    try {
      await opportunityApi.create({
        commodityId,
        type,
        quantity: Number(quantity),
        unit,
        price: Number(price),
        location,
        quality: quality || undefined,
        description: description || undefined,
        deliveryDate: deliveryDate || undefined,
      })
      addToast(`${type === 'sell' ? 'Listing' : 'Request'} created successfully`, 'success')
      onCreated()
      onClose()
    } catch (err: any) {
      addToast(err.message || 'Failed to create listing', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={type === 'sell' ? 'Create Sell Listing' : 'Create Buy Request'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setType('sell')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              type === 'sell'
                ? 'bg-commodity-inputs/20 text-commodity-inputs border border-commodity-inputs/40'
                : 'bg-surface-hover text-text-secondary border border-border'
            }`}
          >
            Selling
          </button>
          <button
            type="button"
            onClick={() => setType('buy')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              type === 'buy'
                ? 'bg-success/20 text-success border border-success/40'
                : 'bg-surface-hover text-text-secondary border border-border'
            }`}
          >
            Buying
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">Commodity *</label>
            <select
              value={commodityId}
              onChange={e => { setCommodityId(e.target.value); setUnit(commodities.find(c => c.id === e.target.value)?.unit || '') }}
              className="w-full h-9 rounded-lg bg-surface border border-border text-text-primary text-sm px-3 focus:outline-none focus:border-primary"
              required
            >
              <option value="">{loading ? 'Loading...' : 'Select commodity'}</option>
              {commodities.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.unit})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">Location *</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. Kumasi, Ashanti Region"
              className="w-full h-9 rounded-lg bg-surface border border-border text-text-primary text-sm px-3 focus:outline-none focus:border-primary"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">Quantity *</label>
            <input
              type="number"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              placeholder="e.g. 500"
              min="0"
              step="0.01"
              className="w-full h-9 rounded-lg bg-surface border border-border text-text-primary text-sm px-3 focus:outline-none focus:border-primary"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">Unit *</label>
            <input
              type="text"
              value={unit}
              onChange={e => setUnit(e.target.value)}
              placeholder="e.g. kg, ton, litre"
              className="w-full h-9 rounded-lg bg-surface border border-border text-text-primary text-sm px-3 focus:outline-none focus:border-primary"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">Price per unit ($) *</label>
            <input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="e.g. 12.50"
              min="0"
              step="0.01"
              className="w-full h-9 rounded-lg bg-surface border border-border text-text-primary text-sm px-3 focus:outline-none focus:border-primary"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">Quality</label>
            <select
              value={quality}
              onChange={e => setQuality(e.target.value)}
              className="w-full h-9 rounded-lg bg-surface border border-border text-text-primary text-sm px-3 focus:outline-none focus:border-primary"
            >
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
              <option value="A">Grade A</option>
              <option value="B">Grade B</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">Delivery Date</label>
            <input
              type="date"
              value={deliveryDate}
              onChange={e => setDeliveryDate(e.target.value)}
              className="w-full h-9 rounded-lg bg-surface border border-border text-text-primary text-sm px-3 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-secondary">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe your product, harvest quality, certifications..."
            rows={3}
            className="w-full rounded-lg bg-surface border border-border text-text-primary text-sm px-3 py-2 focus:outline-none focus:border-primary resize-none"
          />
        </div>

        {selectedCommodity && quantity && price && (
          <div className="bg-surface-hover rounded-lg p-3 flex items-center justify-between">
            <span className="text-xs text-text-secondary">Estimated total value</span>
            <span className="text-sm font-bold text-text-primary">
              ${(Number(quantity) * Number(price)).toLocaleString()}
            </span>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button type="button" variant="secondary" size="sm" fullWidth onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" fullWidth loading={submitting} disabled={submitting}>
            {submitting ? 'Creating...' : `Create ${type === 'sell' ? 'Listing' : 'Request'}`}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
