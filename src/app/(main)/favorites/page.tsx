import * as React from "react"

import { ProtectedRoute } from "@/components/protected-route"

export default function FavoritesPage() {
  return (
    <ProtectedRoute>
      <div>FavoritesPage</div>
    </ProtectedRoute>
  )
}
