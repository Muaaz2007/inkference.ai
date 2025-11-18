'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatedBackground } from '@/components/animated-background'
import { NavBar } from '@/components/nav-bar'
import { GlassCard } from '@/components/glass-card'
import { Camera, X, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CapturePage() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)

  useEffect(() => {
    // Request camera access on mount
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // Try back camera on mobile
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        })
        
        setStream(mediaStream)
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      } catch (err) {
        console.error('[v0] Camera access error:', err)
        setError('Unable to access camera. Please check permissions and try again.')
      }
    }

    startCamera()

    // Cleanup on unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return

    setIsCapturing(true)

    try {
      const video = videoRef.current
      const canvas = canvasRef.current

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw current video frame to canvas
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Cannot get canvas context')

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b)
            else reject(new Error('Failed to create blob'))
          },
          'image/jpeg',
          0.95
        )
      })

      // Create file object
      const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' })

      // Convert to base64 for storage
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        
        // Store in sessionStorage
        sessionStorage.setItem('capturedFile', file.name)
        sessionStorage.setItem('capturedPreview', base64)

        // Stop camera
        if (stream) {
          stream.getTracks().forEach(track => track.stop())
        }

        // Navigate back to upload
        router.push('/upload')
      }
      reader.readAsDataURL(blob)
    } catch (err) {
      console.error('[v0] Capture error:', err)
      setError('Failed to capture photo. Please try again.')
      setIsCapturing(false)
    }
  }

  const handleCancel = () => {
    // Stop camera
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }
    
    // Navigate back
    router.push('/upload')
  }

  return (
    <>
      <AnimatedBackground />
      <NavBar />
      <main className="min-h-screen flex items-center justify-center p-4 pt-28">
        <GlassCard className="max-w-2xl w-full">
          <div className="text-xs text-muted-foreground dark:text-gray-400 mb-6">
            Step 2 of 3 · Capture form photo
          </div>
          
          <h1 className="text-2xl font-bold text-foreground dark:text-white mb-2">
            Point your camera at the form
          </h1>
          
          <p className="text-sm text-muted-foreground dark:text-gray-300 mb-6">
            Position your form in the frame and capture when ready.
          </p>

          {error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900 dark:text-red-200 mb-1">
                    Camera Error
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative w-full aspect-video bg-gray-900 rounded-xl overflow-hidden mb-6">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-4 border-2 border-white/50 rounded-lg" />
              </div>
            </div>
          )}

          {/* Hidden canvas for capture */}
          <canvas ref={canvasRef} className="hidden" />

          <div className="flex gap-3">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex-1"
              disabled={isCapturing}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            
            <Button
              onClick={handleCapture}
              disabled={!!error || isCapturing}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Camera className="w-4 h-4 mr-2" />
              {isCapturing ? 'Capturing...' : 'Capture'}
            </Button>
          </div>

          <div className="text-center text-xs text-muted-foreground dark:text-gray-400 mt-6">
            Step 2 of 3 · Capture form photo
          </div>
        </GlassCard>
      </main>
    </>
  )
}
