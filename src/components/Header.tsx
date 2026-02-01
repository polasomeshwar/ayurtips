import Link from 'next/link'
import LanguageSwitcher from './LanguageSwitcher'

export default function Header({ lang, nav }: { lang: string, nav: any }) {
    return (
        <header style={{
            padding: 'var(--spacing-md) var(--spacing-lg)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--color-sand)',
            backgroundColor: 'var(--color-parchment)'
        }}>
            <div style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', fontWeight: 'bold', color: 'var(--color-moss-green)' }}>
                <Link href={`/${lang}`}>Prakriti</Link>
            </div>
            <nav style={{ display: 'flex', alignItems: 'center' }}>
                <ul style={{ display: 'flex', gap: 'var(--spacing-md)', listStyle: 'none', margin: 0, padding: 0 }}>
                    <li><Link href={`/${lang}`} style={{ color: 'var(--color-bark)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }}>{nav.home}</Link></li>
                    <li><Link href={`/${lang}/about`} style={{ color: 'var(--color-bark)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }}>{nav.about}</Link></li>
                    <li><Link href={`/${lang}/journal`} style={{ color: 'var(--color-bark)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }}>{nav.journal}</Link></li>
                </ul>
                <LanguageSwitcher />
            </nav>
        </header>
    )
}
