"use client"

import React, { use, useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { TranslationKeyPaths } from "@/context/i18n-provider"

import useAuth from "@/hooks/use-auth"
import { useI18n } from "@/hooks/use-i18n"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

import { Icons } from "../icons"
import { Skeleton } from "../ui/skeleton"
import useFetch from "@/hooks/use-fetch"
import { getDecryptedToken } from "@/lib/utils"

const screenTitles: Record<string, TranslationKeyPaths> = {
  "/favorites": "protected-route.favorites",
  "/my-events": "protected-route.my-events",
  "/notifications": "protected-route.notifications",
}

interface validateRouteResponse {
  status: string
};

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const i18n = useI18n()
  const [, , error, fetchData] = useFetch<validateRouteResponse>("/users/viewer/validateRoute");
  const [isValidRoute, setIsValidRoute] = useState(false)

  const validateRoute = async () => {
    try {
      const info = await fetchData({
        headers: {
          Authorization: `Bearer ${getDecryptedToken()}`,
        },
      });

      if (info.status === "GRANTED") {
        setIsValidRoute(true)
      } else {
        setIsValidRoute(false)
      }
    } catch (error) {
      console.log("error:", error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    validateRoute()
  }, [])

  if (isLoading) {
    return (
      <div className="flex size-full items-center justify-center px-4">
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

  if (!isValidRoute) {
    return (
      <div className="flex size-full items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="flex items-center justify-center">
            <div className="bg-primary flex items-center justify-center rounded-lg px-6 py-2">
              <Icons.logo className="text-primary-foreground size-8" />
            </div>
          </CardHeader>
          <CardContent>
            <h2 className="text-center text-lg font-semibold tracking-tight md:text-xl">
              {i18n.t("protected-route.title")}
            </h2>
            <p
              className="text-center text-sm text-gray-500"
              dangerouslySetInnerHTML={{
                __html: i18n.t("protected-route.description", {
                  title: `<strong>${i18n.t(screenTitles[pathname] || "")}</strong>`,
                }) as string,
              }}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            {/* <Button className="w-full" variant="default" asChild>
              <Link href="/sign-up">
                <span>{i18n.t("protected-route.sign-up")}</span>
              </Link>
            </Button> */}
            <Button className="w-full" variant="outline" asChild>
              <Link href="/sign-in">
                <span>{i18n.t("protected-route.sign-in")}</span>
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
