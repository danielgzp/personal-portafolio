import { Languages } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { changeLocaleAction } from "@/lang/actions"
import { availableLanguages } from "@/lang/configs"

export function LocaleSwitcher() {
  const t = useTranslations("common")
  const locale = useLocale()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-9 rounded-full">
          <Languages className="size-4" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Idioma</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={locale} onValueChange={changeLocaleAction}>
            {availableLanguages.map((lang) => (
              <DropdownMenuRadioItem key={lang.code} value={lang.code}>
                <span>{lang.prefix}</span>
                {t("language", { locale: lang.code })}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
