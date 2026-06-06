import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const defaultWords = ["Hello", "Bonjour", "Ciao", "Olà", "やあ", "Hallå", "Guten tag", "হ্যালো"]

const easeOut = [0.76, 0, 0.24, 1] as const

const slideUp = {
  initial: { top: 0 },
  exit: { top: "-100vh", transition: { duration: 0.8, ease: easeOut, delay: 0.2 } },
}

interface PreloaderProps {
  onComplete?: () => void
  words?: string[]
  holdDuration?: number
}

export function Preloader({ onComplete, words: customWords, holdDuration }: PreloaderProps) {
  const words = customWords || defaultWords
  const [index, setIndex] = useState(0)
  const [dimension, setDimension] = useState({ width: 0, height: 0 })
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight })
  }, [])

  useEffect(() => {
    if (words.length === 1) {
      const t1 = setTimeout(() => setIsExiting(true), holdDuration || 2000)
      const t2 = setTimeout(() => onComplete?.(), (holdDuration || 2000) + 1000)
      return () => { clearTimeout(t1); clearTimeout(t2) }
    }
    if (index === words.length - 1) {
      const t1 = setTimeout(() => setIsExiting(true), 1000)
      const t2 = setTimeout(() => onComplete?.(), 2000)
      return () => { clearTimeout(t1); clearTimeout(t2) }
    }
    const t = setTimeout(() => setIndex(i => i + 1), index === 0 ? 1000 : 150)
    return () => clearTimeout(t)
  }, [index, onComplete, words, holdDuration])

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height} L0 0`
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height} L0 0`

  const curve = {
    initial: { d: initialPath, transition: { duration: 0.7, ease: easeOut } },
    exit: { d: targetPath, transition: { duration: 0.7, ease: easeOut, delay: 0.3 } },
  }

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      animate={isExiting ? "exit" : "initial"}
      className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-black z-[999999]"
    >
      {dimension.width > 0 && (
        <>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-white text-[2.5rem] sm:text-5xl lg:text-6xl absolute z-10 font-bold leading-[1.1] tracking-tight"
          >
            {words[index]}
          </motion.p>
          <svg className="absolute top-0 w-full h-[calc(100%+300px)]">
            <motion.path variants={curve} initial="initial" animate={isExiting ? "exit" : "initial"} fill="#070b13" />
          </svg>
        </>
      )}
    </motion.div>
  )
}
