import Link from "next/link"
import { Facebook } from "lucide-react"

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-slate-900 dark:text-white">
              Sharing: AI - Automation - Software Dev
            </Link>
          </div>
          <div className="flex items-center">
            <Link
              href="https://www.facebook.com/groups/666286742493554"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
            >
              <Facebook className="h-6 w-6" />
              <span className="sr-only">Facebook Group</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

