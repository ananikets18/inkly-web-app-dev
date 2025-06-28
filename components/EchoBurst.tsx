"use client";
import { motion, AnimatePresence } from "framer-motion";

export default function EchoBurst({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.8 }}
          animate={{ opacity: 1, y: -10, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute -top-3 left-8 text-purple-600 text-xs font-semibold pointer-events-none"
        >
          +1 Echo
        </motion.div>
      )}
    </AnimatePresence>
  );
}
