import * as React from "react"

import { ProtectedRoute } from "@/components/protected-route"

export default function NotificationsPage() {
  return (
    <ProtectedRoute>
      <div>NotificationsPage</div>
    </ProtectedRoute>
  )
}
