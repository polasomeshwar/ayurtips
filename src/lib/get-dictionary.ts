import 'server-only'
import type { Locale } from '../i18n-config'

const dictionaries = {
    en: () => import('../dictionaries/en.json').then((module) => module.default),
    hi: () => import('../dictionaries/hi.json').then((module) => module.default),
    es: () => import('../dictionaries/es.json').then((module) => module.default),
}

export const getDictionary = async (locale: Locale) => {
    return dictionaries[locale as keyof typeof dictionaries]?.() ?? dictionaries.en()
}
