"use client"

import { useRouter } from "next/navigation"

import { useI18n } from "@/hooks/use-i18n"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export function Header() {
  const i18n = useI18n()
  const router = useRouter()

  return (
    <>
      <header className="border-border/95 bg-card/10 supports-[backdrop-filter]:bg-card/10 sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b px-4 py-3 backdrop-blur sm:h-auto sm:px-6">
        <Button
          className="h-8"
          onClick={() => {
            router.back()
          }}
        >
          <Icons.back />
          {i18n.t("common.back")}
        </Button>

        {/* <nav>
          <Button variant="outline" className="mr-2">
            Log In
          </Button>
          <Button variant="default">Contact</Button>
        </nav> */}
      </header>
    </>
  )
}
