import * as React from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProductHighlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode
  category: string
  title: string
  description: string
  imageSrc?: string
  imageAlt?: string
  image?: React.ReactNode
}

export const ProductHighlightCard = React.forwardRef<HTMLDivElement, ProductHighlightCardProps>(
  ({ className, icon, category, title, description, imageSrc, imageAlt, image, ...props }, ref) => {
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const handleMouseMove = ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
      const { left, top } = currentTarget.getBoundingClientRect()
      mouseX.set(clientX - left)
      mouseY.set(clientY - top)
    }

    const rotateX = useTransform(mouseY, [0, 350], [8, -8])
    const rotateY = useTransform(mouseX, [0, 350], [-8, 8])
    const springCfg = { stiffness: 300, damping: 20 }
    const springRotateX = useSpring(rotateX, springCfg)
    const springRotateY = useSpring(rotateY, springCfg)

    const glowX = useTransform(mouseX, [0, 350], [0, 100])
    const glowY = useTransform(mouseY, [0, 350], [0, 100])
    const glowOpacity = useTransform(mouseX, [0, 350], [0, 0.5])

    return (
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove as unknown as React.ComponentProps<typeof motion.div>['onMouseMove']}
        onMouseLeave={() => { mouseX.set(0); mouseY.set(0) }}
        style={{ rotateX: springRotateX, rotateY: springRotateY, transformStyle: 'preserve-3d' }}
        className={cn('relative h-[320px] w-full max-w-[350px] rounded-2xl bg-card shadow-lg transition-shadow duration-300 hover:shadow-2xl', className)}
        {...props as React.ComponentProps<typeof motion.div>}
      >
        <div style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }} className="absolute inset-3 rounded-xl bg-card-foreground/5 shadow-inner overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

          <motion.div
            className="pointer-events-none absolute -inset-px rounded-xl"
            style={{
              opacity: glowOpacity,
              background: `radial-gradient(80px at ${glowX}% ${glowY}%, hsl(var(--primary)), transparent 40%)`,
            }}
          />

          <div className="relative z-10 flex h-full flex-col justify-between p-6">
            <div className="flex items-center space-x-2 text-card-foreground">
              {icon}
              <span className="text-sm font-medium">{category}</span>
            </div>

            <div className="text-card-foreground">
              <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
              <p className="mt-2 max-w-[60%] text-xs text-muted-foreground">{description}</p>
            </div>
          </div>

          {imageSrc ? (
            <motion.img
              src={imageSrc}
              alt={imageAlt || ''}
              style={{ transform: 'translateZ(50px)' }}
              whileHover={{ scale: 1.1, y: -20, x: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="absolute -right-10 -bottom-10 h-48 w-48 object-contain"
            />
          ) : image ? (
            <motion.div
              style={{ transform: 'translateZ(50px)' }}
              whileHover={{ scale: 1.1, y: -20, x: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="absolute -right-10 -bottom-10"
            >
              {image}
            </motion.div>
          ) : null}
        </div>
      </motion.div>
    )
  }
)

ProductHighlightCard.displayName = 'ProductHighlightCard'
