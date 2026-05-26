import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-2 border-border rounded-full" />
        <motion.div
          className="absolute inset-0 border-2 border-transparent border-t-gold rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    </div>
  );
}
