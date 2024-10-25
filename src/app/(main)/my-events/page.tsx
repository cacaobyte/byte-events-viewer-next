import * as React from "react"

import { ProtectedRoute } from "@/components/protected-route"

export default function MyEventsPage() {
  return (
    <ProtectedRoute>
      <div>MyEventsPage</div>
    </ProtectedRoute>
  )
}
