"use client"

import { MeshGradient } from "@paper-design/shaders-react"
import { useTheme } from "@/components/theme-provider"

export function AnimatedBackground() {
  const { theme } = useTheme()
  
  const isDark = theme === "dark" || (theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches)
  
  return (
    <>
      <div className="fixed inset-0 -z-10 bg-black dark:bg-black">
        <MeshGradient
          className="w-full h-full absolute inset-0"
          colors={
            isDark 
              ? ["#1e3a8a", "#1e40af", "#3b82f6", "#60a5fa"]
              : ["#dbeafe", "#bfdbfe", "#93c5fd", "#60a5fa"]
          }
          speed={1.2}
          backgroundColor={isDark ? "#0f172a" : "#f0f9ff"}
        />
      </div>
      
      {/* Lighting overlay effects */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-blue-200/10 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-white/20 dark:bg-blue-400/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-sky-100/10 dark:bg-sky-400/10 rounded-full blur-xl animate-pulse" />
      </div>
    </>
  )
}
