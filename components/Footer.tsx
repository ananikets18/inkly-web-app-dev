import React from "react"
import Link from "next/link"

const Footer: React.FC = () => (
  <footer className="w-full text-center text-xs text-muted-foreground py-3 bg-background/80 border-t border-border mt-2">
    <div className="flex flex-col items-center gap-1">
      <div>
        Made with <span aria-label="love" role="img">❤️</span> by the Inkly team.
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/terms" className="hover:underline">Terms</Link>
        <span>|</span>
        <Link href="/privacy" className="hover:underline">Privacy</Link>
        <span>|</span>
        <Link href="/guidelines" className="hover:underline">Guidelines</Link>
        <span>|</span>
        <Link href="/contact" className="hover:underline">Contact</Link>
      </div>
    </div>
  </footer>
)

export default Footer
