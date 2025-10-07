import React from 'react'
import { motion } from 'framer-motion'

export default function BubbleBlob() {
  return (
    <div className='absolute inset-0 overflow-hidden'>
      <motion.div
        className="absolute top-0 left-0 w-72 h-72 bg-blue-200 opacity-30 blur-3xl rounded-full"
        animate={{ x: [0, 20, -20, 0], y: [0, 15, -15, 0] }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-200 opacity-30 blur-3xl rounded-full"
        animate={{ x: [0, -25, 25, 0], y: [0, -20, 20, 0] }}
        transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
      />

    </div>
  )
}