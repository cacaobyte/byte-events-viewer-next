"use client"

import { useSearchParams } from "next/navigation"
// import { signIn } from "next-auth/react"

import { Icons } from "./icons"
import { Button } from "./ui/button"

export default function GoogleSignInButton() {
  const searchParams = useSearchParams()
  // const callbackUrl = searchParams.get("callbackUrl")

  return (
    <Button
      className="w-full"
      variant="outline"
      type="button"
      // onClick={() =>
      //   signIn("google", { callbackUrl: callbackUrl ?? "/dashboard" })
      // }
    >
      <Icons.google className="mr-2 size-4" />
      Continuar con Google
    </Button>
  )
}
