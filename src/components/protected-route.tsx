import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import useAuth from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

import { Icons } from "./icons"
import { Skeleton } from "./ui/skeleton"

const screenTitles = {
  "/favorites": "Favoritos ❤️",
  "/my-events": "Mis Eventos 🗓️",
  "/notifications": "Notificaciones 🔔",
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsLoading(false)
    }
    checkAuth()
  }, [])

  if (isLoading) {
    return (
      <div className="bg-muted flex size-full items-center justify-center rounded-lg">
        <Card className="w-full max-w-md">
          <CardHeader className="flex items-center justify-center">
            <Skeleton className="h-12 w-20 rounded-lg" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="mx-auto h-6 w-3/4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mx-auto h-4 w-5/6" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-muted flex size-full items-center justify-center rounded-lg">
        <Card className="w-full max-w-md">
          <CardHeader className="flex items-center justify-center">
            <div className="bg-primary flex items-center justify-center rounded-lg px-6 py-2">
              <Icons.logo className="text-primary-foreground size-8" />
            </div>
          </CardHeader>
          <CardContent>
            <h2 className="text-center text-lg font-semibold tracking-tight md:text-xl">
              Continue with Vercel
            </h2>
            <p className="text-center text-sm text-gray-500">
              To use v0, create a Vercel account or log into an existing one.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button className="w-full" variant="default" asChild>
              <Link href="/sign-up">
                <span>Sign Up</span>
              </Link>
            </Button>
            <Button className="w-full" variant="outline" asChild>
              <Link href="/sign-in">
                <span>Sign In</span>
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
