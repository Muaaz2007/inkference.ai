'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AnimatedBackground } from '@/components/animated-background'
import { NavBar } from '@/components/nav-bar'
import { GlassCard } from '@/components/glass-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LogIn } from 'lucide-react'
import { LiquidButton } from '@/components/ui/liquid-glass-button'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/upload')
  }

  return (
    <>
      <AnimatedBackground />
      <NavBar />
      <main className="min-h-screen flex items-center justify-center p-4 pt-28">
        <GlassCard>
          <div className="text-xs text-gray-500 mb-6">Step 1 of 3</div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Sign in to continue
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="--------"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/50"
              />
            </div>
            
            <LiquidButton type="submit" className="w-full" size="xxl">
              <LogIn className="w-5 h-5 mr-2" />
              Sign in (mock)
            </LiquidButton>
          </form>
          
          <p className="text-xs text-gray-500 text-center mt-6 mb-4">
            This is a mock login for demo purposes only. No data is stored.
          </p>
          
          <Link 
            href="/upload" 
            className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Skip login →
          </Link>
        </GlassCard>
      </main>
    </>
  )
}
