import Link from "next/link"
import { usePathname } from "next/navigation"
import { TranslationKeyPaths } from "@/context/i18n-provider"
import { Home } from "lucide-react"

import { useI18n } from "@/hooks/use-i18n"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function PathnameBreadcrumbs() {
  const pathname = usePathname()
  const i18n = useI18n()

  if (!pathname) return null

  const pathSegments = pathname.split("/").filter((segment) => segment)

  const paths = pathSegments.map((_, index) => {
    return "/" + pathSegments.slice(0, index + 1).join("/")
  })

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link className="flex items-center" href="/">
              <Home className="mr-1 size-4" />
              {i18n.t("title.home")}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {paths.length > 0 && <BreadcrumbSeparator />}
        {paths.map((path, index) => (
          <BreadcrumbItem key={index}>
            {index < paths.length - 1 ? (
              <BreadcrumbLink asChild>
                <Link href={path}>
                  {i18n.t(
                    `title.${pathSegments[index]}` as TranslationKeyPaths
                  )}
                </Link>
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage>
                {i18n.t(`title.${pathSegments[index]}` as TranslationKeyPaths)}
              </BreadcrumbPage>
            )}
            {index < paths.length - 1 && <BreadcrumbSeparator />}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
