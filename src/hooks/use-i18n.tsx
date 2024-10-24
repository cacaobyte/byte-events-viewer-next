"use client"

import * as React from "react"
import { I18nContext, I18nContextProps } from "@/context/i18n-context"

export function useI18n(): I18nContextProps {
  const i18n = React.useContext(I18nContext)

  if (!i18n) {
    throw new Error("useI18n must be used within a I18nProvider")
  }

  return i18n
}
