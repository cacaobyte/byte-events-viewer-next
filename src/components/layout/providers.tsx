"use client"

import React from "react"

import SessionProvider from "./session-provider"
import ThemeProvider from "./ThemeToggle/theme-provider"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SessionProvider>{children}</SessionProvider>
      </ThemeProvider>
    </>
  )
}
