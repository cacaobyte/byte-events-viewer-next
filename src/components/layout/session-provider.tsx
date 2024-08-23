"use client"

import React from "react"
import { usePathname, useRouter } from "next/navigation"

import { useUserStore } from "@/lib/store"

import AdminPanelLayout from "../admin-panel/admin-panel-layout"
import LogoLoader from "../logo-loader"

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { username, rehydrated } = useUserStore((state) => ({
    username: state.username,
    rehydrated: state.rehydrated,
  }))
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (!rehydrated) return

    if (username && pathname === "/") {
      router.push("/home")
    } else if (!username && pathname !== "/") {
      router.push("/")
    }
    setLoading(false)
  }, [username, router, pathname, rehydrated])

  if (loading || !rehydrated) {
    return <LogoLoader />
  }

  if (username) {
    return <AdminPanelLayout>{children}</AdminPanelLayout>
  }

  return <>{children}</>
}
