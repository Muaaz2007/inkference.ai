'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatedBackground } from '@/components/animated-background'
import { NavBar } from '@/components/nav-bar'
import { GlassCard } from '@/components/glass-card'
import { ImageIcon, Sparkles, Upload, Camera } from 'lucide-react'
import Image from 'next/image'
import { LiquidButton } from '@/components/ui/liquid-glass-button'

export default function UploadPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const capturedFile = sessionStorage.getItem('capturedFile')
    const capturedPreview = sessionStorage.getItem('capturedPreview')
    
    if (capturedFile && capturedPreview) {
      // Reconstruct file from base64
      fetch(capturedPreview)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' })
          setFile(file)
          setPreview(capturedPreview)
        })
      
      // Clean up
      sessionStorage.removeItem('capturedFile')
      sessionStorage.removeItem('capturedPreview')
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleProcess = async () => {
    if (!file) return

    setIsProcessing(true)
    
    try {
      const reader = new FileReader()
      reader.onloadend = () => {
        sessionStorage.setItem('uploadedFile', reader.result as string)
        sessionStorage.setItem('fileName', file.name)
        router.push('/processing')
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('[v0] Upload error:', error)
      alert('Failed to start processing')
      setIsProcessing(false)
    }
  }

  return (
    <>
      <AnimatedBackground />
      <NavBar />
      <main className="min-h-screen flex items-center justify-center p-4 pt-28">
        <GlassCard>
          <div className="text-xs text-muted-foreground dark:text-gray-400 mb-6">Step 2 of 3</div>
          
          <h1 className="text-2xl font-bold text-foreground dark:text-white mb-2">
            Upload your form
          </h1>
          
          <p className="text-sm text-muted-foreground dark:text-gray-300 mb-6">
            Drop a photo of your paper form or select a file to analyze it with AI.
          </p>
          
          {!file ? (
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {/* Option 1: Upload from device */}
              <label 
                htmlFor="file-upload" 
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all"
              >
                <input
                  id="file-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleFileChange}
                  className="sr-only"
                />
                <Upload className="w-10 h-10 text-blue-500 mb-3" />
                <p className="text-sm font-medium text-foreground dark:text-white mb-1">
                  Upload from device
                </p>
                <p className="text-xs text-muted-foreground dark:text-gray-400">
                  PNG, JPG supported
                </p>
              </label>
              
              {/* Option 2: Take photo with camera */}
              <button
                onClick={() => router.push('/capture')}
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all"
              >
                <Camera className="w-10 h-10 text-blue-500 mb-3" />
                <p className="text-sm font-medium text-foreground dark:text-white mb-1">
                  Take photo with camera
                </p>
                <p className="text-xs text-muted-foreground dark:text-gray-400">
                  Use your device camera
                </p>
              </button>
            </div>
          ) : (
            <>
              {/* File preview */}
              <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="flex items-start gap-3">
                  <Image 
                    src={preview || "/placeholder.svg"} 
                    alt="Preview" 
                    width={60}
                    height={60}
                    className="rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground dark:text-white truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground dark:text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
              </div>
              
              <LiquidButton 
                onClick={handleProcess}
                disabled={!file || isProcessing}
                className="w-full disabled:opacity-50"
                size="xxl"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                {isProcessing ? 'Starting...' : 'Process with AI →'}
              </LiquidButton>
              
              <button
                onClick={() => {
                  setFile(null)
                  setPreview(null)
                }}
                className="w-full mt-3 text-sm text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-white transition-colors"
              >
                Choose different file
              </button>
            </>
          )}
          
          <p className="text-xs text-muted-foreground dark:text-gray-400 text-center mt-4">
            We don't store your image permanently for this demo.
          </p>
          
          <div className="text-center text-xs text-muted-foreground dark:text-gray-400 mt-6">
            Step 2 of 3 · Upload form
          </div>
        </GlassCard>
      </main>
    </>
  )
}
