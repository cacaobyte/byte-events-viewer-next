"use client"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="absolute left-1/2 top-1/2 mb-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center">
      <span className="from-foreground to-foreground/50 bg-gradient-to-b bg-clip-text text-[10rem] font-extrabold leading-none text-transparent">
        404
      </span>
      <h2 className="font-heading my-2 text-2xl font-bold">
        ¡Algo ha desaparecido 🛸!
      </h2>
      <p>¡Lo siento, la página que buscas no existe o ha sido movida!</p>
      <div className="mt-8 flex justify-center gap-2">
        <Button onClick={() => router.back()} variant="default" size="lg">
          Ir atrás
        </Button>
        <Button onClick={() => router.push("/")} variant="ghost" size="lg">
          Regresar al inicio
        </Button>
      </div>
    </div>
  )
}
