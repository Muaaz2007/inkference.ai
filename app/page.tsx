import Link from 'next/link'
import Image from 'next/image'
import { AnimatedBackground } from '@/components/animated-background'
import { NavBar } from '@/components/nav-bar'
import { GlassCard } from '@/components/glass-card'
import { SplineScene } from '@/components/ui/spline-scene'
import { Spotlight } from '@/components/ui/spotlight'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <>
      <AnimatedBackground />
      <NavBar />
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
          {/* Left: Text content */}
          <GlassCard className="text-center lg:text-left relative">
            <Spotlight size={300} />
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
              <Image 
                src="/inkference-logo.png" 
                alt="Inkference AI" 
                width={180} 
                height={40}
                className="h-8 w-auto"
              />
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 text-balance">
              Turn paper forms into clean data.
            </h1>
            
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-2">
              Snap a photo of any form and get structured data plus automatic error checks in seconds. Built with Gemini multimodal AI.
            </p>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-8">
              Powered by Gemini multimodal AI.
            </p>
            
            <Button className="w-full" asChild>
              <Link href="/login" className="flex items-center justify-center gap-2">
                Continue
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              You'll first see a quick login mockup, then upload your form.
            </p>
          </GlassCard>

          {/* Right: 3D Spline scene */}
          <div className="hidden lg:block h-[600px] relative">
            <GlassCard className="h-full p-0 overflow-hidden">
              <SplineScene 
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
              />
            </GlassCard>
          </div>
        </div>
      </main>
    </>
  )
}
