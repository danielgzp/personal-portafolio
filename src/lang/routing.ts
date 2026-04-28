import { defineRouting } from "next-intl/routing"
import { createNavigation } from "next-intl/navigation"
import { locales, defaultLocale, defultLocalePrefix } from "./configs"

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: defultLocalePrefix,
  localeDetection: true,
})

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
