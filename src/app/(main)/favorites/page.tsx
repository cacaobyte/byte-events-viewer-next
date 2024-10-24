"use client"

import * as React from "react"

import { useI18n } from "@/hooks/use-i18n"
import { ProtectedRoute } from "@/components/protected-route"

export default function FavoritesPage() {
  const i18n = useI18n()
  return (
    <ProtectedRoute>
      <div>FavoritesPage {i18n.t("sidebar.support")}</div>
    </ProtectedRoute>
  )
}
