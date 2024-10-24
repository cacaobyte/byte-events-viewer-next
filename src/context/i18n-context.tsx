"use client"

import * as React from "react"
import { translations } from "@/constants/translations"
import { I18n, type TranslateOptions } from "i18n-js"

// Obtener todas las claves de traducción disponibles del objeto translations
type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`
}[keyof ObjectType & (string | number)]

export type TranslationKeyPaths = NestedKeyOf<(typeof translations)["es"]>

const i18n = new I18n(translations)
i18n.enableFallback = true

export interface I18nContextProps {
  t: <T = string>(
    scope: TranslationKeyPaths,
    options?: TranslateOptions
  ) => string | T
  setLocale: (locale: string) => void
  locale: string
}

export const I18nContext = React.createContext<I18nContextProps>({
  t: () => "",
  locale: "es",
  setLocale: () => {},
})

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocale] = React.useState<string>("es")

  React.useEffect(() => {
    const browserLanguage = navigator.language || navigator.languages[0]
    const languageCode = browserLanguage.split("-")[0]

    setLocale(languageCode)
  }, [])

  React.useEffect(() => {
    if (i18n.locale !== locale) {
      i18n.locale = locale
    }
  }, [locale])

  const i18nWrapper = React.useMemo(() => {
    return {
      t: (scope: TranslationKeyPaths, options?: TranslateOptions) =>
        i18n.t(scope, options),
      locale,
      setLocale: (newLocale: string) => {
        setLocale(newLocale)
        i18n.locale = newLocale
      },
    }
  }, [locale])

  return (
    <I18nContext.Provider value={i18nWrapper}>{children}</I18nContext.Provider>
  )
}
