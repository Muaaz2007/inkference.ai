'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AnimatedBackground } from '@/components/animated-background'
import { NavBar } from '@/components/nav-bar'
import { GlassCard } from '@/components/glass-card'
import { Download, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { LiquidButton } from '@/components/ui/liquid-glass-button'

interface ProcessingResult {
  id: string
  parsed: Record<string, any>
  pdf_url: string | null
}

export default function ResultsPage() {
  const router = useRouter()
  const [results, setResults] = useState<ProcessingResult | null>(null)

  useEffect(() => {
    const storedResults = sessionStorage.getItem('processingResults')
    if (!storedResults) {
      router.push('/upload')
      return
    }

    try {
      const parsed = JSON.parse(storedResults)
      setResults(parsed)
    } catch (err) {
      console.error('[v0] Failed to parse results:', err)
      router.push('/upload')
    }
  }, [router])

  if (!results) {
    return (
      <>
        <AnimatedBackground />
        <NavBar />
        <main className="min-h-screen flex items-center justify-center p-4 pt-28">
          <GlassCard>
            <p className="text-gray-600 dark:text-gray-300">Loading results...</p>
          </GlassCard>
        </main>
      </>
    )
  }

  const formType = results.parsed.formType || 'Unknown'
  const confidenceHints = results.parsed.confidenceHints || {}
  const avgConfidence = Object.keys(confidenceHints).length > 0
    ? Object.values(confidenceHints).reduce((a: number, b: any) => a + Number(b), 0) / Object.keys(confidenceHints).length
    : 0.85

  // Filter out metadata fields
  const extractedData = Object.entries(results.parsed)
    .filter(([key]) => !['formType', 'confidenceHints'].includes(key))
    .map(([key, value]) => ({
      label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      value: typeof value === 'object' ? JSON.stringify(value) : String(value || 'N/A'),
      confidence: confidenceHints[key] || null
    }))

  const issues: string[] = []
  extractedData.forEach(item => {
    if (item.confidence && item.confidence < 0.7) {
      issues.push(`Low confidence on ${item.label} (${(item.confidence * 100).toFixed(0)}%)`)
    }
    if (item.value === 'N/A' || item.value === 'null') {
      issues.push(`Missing ${item.label} field`)
    }
  })

  const handleDownloadJSON = () => {
    const dataStr = JSON.stringify(results.parsed, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'form-extraction-results.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadPDF = () => {
    if (results.pdf_url) {
      window.open(results.pdf_url, '_blank')
    }
  }

  return (
    <>
      <AnimatedBackground />
      <NavBar />
      <main className="min-h-screen flex items-center justify-center p-4 pt-28">
        <GlassCard className="max-w-2xl">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Form analysis results
          </h1>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
            Review extracted details below. Export the full JSON if you need all fields.
          </p>
          
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Form type</span>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                {formType}
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Confidence: <span className="font-semibold text-gray-900 dark:text-white">
                {avgConfidence.toFixed(2)}
              </span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Left column - Extracted data */}
            <div className="space-y-3">
              {extractedData.slice(0, 6).map((item) => (
                <div key={item.label} className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{item.label}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{item.value}</span>
                  {item.confidence && (
                    <span className="text-xs text-gray-400">
                      {(item.confidence * 100).toFixed(0)}% confidence
                    </span>
                  )}
                </div>
              ))}
            </div>
            
            {/* Right column - Validation */}
            {issues.length > 0 ? (
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-sm font-semibold text-amber-900 dark:text-amber-300">Issues found</span>
                </div>
                <ul className="space-y-2">
                  {issues.map((issue, index) => (
                    <li key={index} className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed flex gap-2">
                      <span className="text-amber-600 dark:text-amber-400">•</span>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-semibold text-green-900 dark:text-green-300">No issues found</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <LiquidButton onClick={handleDownloadJSON} className="flex-1" size="xl">
              <Download className="w-5 h-5 mr-2" />
              Download detailed JSON
            </LiquidButton>
            
            {results.pdf_url && (
              <LiquidButton onClick={handleDownloadPDF} className="flex-1" size="xl">
                <Download className="w-5 h-5 mr-2" />
                Download PDF
              </LiquidButton>
            )}
            
            <LiquidButton asChild className="flex-1" size="xl">
              <Link href="/upload">
                Process another form
              </Link>
            </LiquidButton>
          </div>
          
          <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
            Step 3 of 3 · Review & export
          </div>
        </GlassCard>
      </main>
    </>
  )
}
