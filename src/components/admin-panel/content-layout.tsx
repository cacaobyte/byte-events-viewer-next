"use client"

import { useSidebarStore } from "@/lib/store"
import { Navbar } from "@/components/admin-panel/navbar"

import { Footer } from "./footer"

interface ContentLayoutProps {
  title: string
  children: React.ReactNode
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  const sidebar = {
    isOpen: useSidebarStore((state) => state.isOpen),
  }
  return (
    <>
      <Navbar title={title} />
      <div className="container min-h-[calc(100vh_-96px)] px-4 py-8 sm:px-8">
        {children}
      </div>
      <footer className="transition-[margin-left] duration-300 ease-in-out">
        <Footer />
      </footer>
    </>
  )
}
