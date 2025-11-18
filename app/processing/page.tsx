'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatedBackground } from '@/components/animated-background'
import { NavBar } from '@/components/nav-bar'
import { GlassCard } from '@/components/glass-card'
import { CheckCircle2, Circle, Loader2 } from 'lucide-react'

const steps = [
  'Reading layout & text',
  'Detecting fields & values',
  'Checking for missing or suspicious fields'
]

const facts = [
  'Digitizing forms can cut processing time by up to 50% in small businesses. A single data entry mistake on a shipping form can delay a shipment by days.',
  'Some clinics still process thousands of paper forms manually every week.',
  'Manual data entry errors cost businesses billions annually in corrections and delays.'
]

export default function ProcessingPage() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const uploadedFile = sessionStorage.getItem('uploadedFile')
    const fileName = sessionStorage.getItem('fileName')

    if (!uploadedFile) {
      router.push('/upload')
      return
    }

    const processForm = async () => {
      try {
        // Convert base64 back to File
        const response = await fetch(uploadedFile)
        const blob = await response.blob()
        const file = new File([blob], fileName || 'form.jpg', { type: 'image/jpeg' })

        const formData = new FormData()
        formData.append('file', file)

        console.log('[v0] Calling /api/formsnap...')
        
        const apiResponse = await fetch('/api/formsnap', {
          method: 'POST',
          body: formData,
        })

        if (!apiResponse.ok) {
          throw new Error('Processing failed')
        }

        const result = await apiResponse.json()
        
        console.log('[v0] API response received:', result)
        
        // Store results in sessionStorage
        sessionStorage.setItem('processingResults', JSON.stringify(result))
        
        // Wait for animation to complete
        setTimeout(() => {
          router.push('/results')
        }, 1000)
      } catch (err) {
        console.error('[v0] Processing error:', err)
        setError(err instanceof Error ? err.message : 'Processing failed')
      }
    }

    processForm()

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2
      })
    }, 100)

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval)
          return prev
        }
        return prev + 1
      })
    }, 2000)

    return () => {
      clearInterval(progressInterval)
      clearInterval(stepInterval)
    }
  }, [router])

  if (error) {
    return (
      <>
        <AnimatedBackground />
        <NavBar />
        <main className="min-h-screen flex items-center justify-center p-4 pt-28">
          <GlassCard>
            <h1 className="text-2xl font-bold text-red-600 mb-4">Processing Error</h1>
            <p className="text-gray-700 dark:text-gray-300 mb-6">{error}</p>
            <button
              onClick={() => router.push('/upload')}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-medium"
            >
              Try Again
            </button>
          </GlassCard>
        </main>
      </>
    )
  }

  return (
    <>
      <AnimatedBackground />
      <NavBar />
      <main className="min-h-screen flex items-center justify-center p-4 pt-28">
        <GlassCard>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-6">Step 3 of 4 · Analyzing your form</div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Extracting fields with AI...
          </h1>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
            We're reading your form layout, text, and handwriting to turn it into clean data.
          </p>
          
          {/* Progress bar */}
          <div className="mb-6">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          {/* Status steps */}
          <div className="space-y-3 mb-8">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center gap-3">
                {index <= currentStep ? (
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                )}
                <span className={index <= currentStep ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
                  {step}
                </span>
              </div>
            ))}
          </div>
          
          {/* Fun fact section */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
            <p className="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-2">Did you know?</p>
            <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
              {facts[0]}
            </p>
          </div>
          
          <button
            disabled
            className="w-full py-3 px-4 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-xl font-medium flex items-center justify-center gap-2"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing...
          </button>
          
          <button
            onClick={() => router.push('/results')}
            className="w-full mt-4 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            Continue to results →
          </button>
          
          <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
            This usually takes just a few seconds.
          </div>
        </GlassCard>
      </main>
    </>
  )
}
