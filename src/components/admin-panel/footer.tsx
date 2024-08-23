import { Icons } from "../icons"

export function Footer() {
  return (
    <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 z-20 w-full shadow backdrop-blur">
      <div className="mx-4 flex h-10 items-center justify-between md:mx-8">
        <div className="flex items-center space-x-2">
          <div className="bg-accent flex size-6 items-center justify-center rounded-full text-xs">
            <Icons.cacaoByte2 className="size-4" />
          </div>
          <span className="text-muted-foreground text-xs md:text-sm">
            CacaoByte © 2024
          </span>
        </div>
        <div className="text-muted-foreground text-xs leading-loose md:text-sm">
          Version 1.0.0
        </div>
      </div>
    </div>
  )
}
