'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { i18n } from '../i18n-config'

export default function LanguageSwitcher() {
    const pathname = usePathname()

    const redirectedPathName = (locale: string) => {
        if (!pathname) return '/'
        const segments = pathname.split('/')
        segments[1] = locale
        return segments.join('/')
    }

    // Helper names
    const labels: Record<string, string> = {
        en: 'EN',
        hi: 'HI',
        es: 'ES'
    }

    return (
        <div style={{ marginLeft: 'var(--spacing-md)', display: 'flex', gap: '0.5rem' }}>
            {i18n.locales.map((locale) => {
                return (
                    <Link
                        key={locale}
                        href={redirectedPathName(locale)}
                        style={{
                            padding: '0.2rem 0.5rem',
                            border: '1px solid var(--color-moss-green)',
                            borderRadius: '4px',
                            color: 'var(--color-moss-green)',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            textDecoration: 'none',
                            backgroundColor: pathname.startsWith(`/${locale}`) ? 'var(--color-sand)' : 'transparent'
                        }}
                    >
                        {labels[locale as string] || locale.toUpperCase()}
                    </Link>
                )
            })}
        </div>
    )
}
