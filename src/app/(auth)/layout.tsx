import * as React from "react"

import { Header } from "./components/header"

export default function AuthLayoutFull({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="bg-muted/40 flex h-svh w-full flex-col overflow-y-auto">
        <Header />
        <div className="flex flex-1 flex-col items-center justify-center p-4">
          {children}
        </div>
      </div>
    </>
  )
}
