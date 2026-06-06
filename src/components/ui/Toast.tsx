import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'
import { useToast, type ToastType } from '@/context/ToastContext'

const iconMap: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
}

const colorMap: Record<ToastType, string> = {
  success: 'border-green-500/40 text-green-400',
  error: 'border-red-500/40 text-red-400',
  info: 'border-blue-500/40 text-blue-400',
  warning: 'border-yellow-500/40 text-yellow-400',
}

const bgMap: Record<ToastType, string> = {
  success: 'bg-green-500/10',
  error: 'bg-red-500/10',
  info: 'bg-blue-500/10',
  warning: 'bg-yellow-500/10',
}

export function Toaster() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => {
          const Icon = iconMap[toast.type]
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 80, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className={`pointer-events-auto flex items-start gap-2.5 rounded-xl border px-3.5 py-3 shadow-lg backdrop-blur-sm ${bgMap[toast.type]} ${colorMap[toast.type]}`}
            >
              <Icon className="w-4 h-4 mt-0.5 shrink-0" />
              <p className="text-sm flex-1 min-w-0 text-text-primary">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 transition-colors text-text-secondary hover:text-text-primary"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
