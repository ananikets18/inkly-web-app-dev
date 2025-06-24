import Link from 'next/link'
import { PenLine } from 'lucide-react'

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 cursor-pointer" aria-label="Go to homepage">
      <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
        <PenLine className="w-4 h-4 text-white" />
      </div>
      <span className="text-xl font-semibold text-gray-900">Inkly</span>
    </Link>
  )
}
