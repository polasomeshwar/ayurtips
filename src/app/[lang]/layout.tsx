import type { Metadata } from 'next'
import { Cormorant_Garamond, Lato } from 'next/font/google'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { getDictionary } from '../../lib/get-dictionary'
import '../globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-lato',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Prakriti - Ayurveda Lifestyle Tips',
  description: 'Daily Ayurveda lifestyle tips for modern living. Authentic, earthy, and practical.',
}

import { i18n } from '../../i18n-config'

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }))
}

import type { Locale } from '../../i18n-config'

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)

  return (
    <html lang={lang} className={`${cormorant.variable} ${lato.variable}`}>
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header lang={lang} nav={dict.nav} />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer lang={lang} />
      </body>
    </html>
  )
}
