import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import Image from 'next/image'

export function NavBar() {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-8 px-6 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-full shadow-sm border border-gray-200/50 dark:border-gray-700/50">
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/inkference-logo.png" 
            alt="Inkference AI" 
            width={140} 
            height={32}
            className="h-6 w-auto"
          />
        </Link>
        <div className="flex items-center gap-6">
          <Link href="#features" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
            Features
          </Link>
          <Link href="#demo" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
            Demo
          </Link>
          <Link href="https://github.com" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
            GitHub
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
