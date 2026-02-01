import Link from 'next/link'
import { getSortedPostsData } from '../../../lib/posts'
import { getDictionary } from '../../../lib/get-dictionary'

import type { Locale } from '../../../i18n-config'

export default async function JournalIndex({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params
    const posts = getSortedPostsData(lang)
    const dict = await getDictionary(lang as Locale)

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--spacing-md)' }}>
            <h1 style={{
                textAlign: 'center',
                marginBottom: 'var(--spacing-lg)',
                color: 'var(--color-moss-green)',
                fontSize: '2.5rem'
            }}>
                {dict.nav.journal}
            </h1>
            <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                {posts.map(({ slug, date, title, excerpt }) => (
                    <div key={slug} style={{
                        padding: 'var(--spacing-md)',
                        border: '1px solid var(--color-sand)',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.4)',
                        transition: 'transform 0.2s ease'
                    }}>
                        <small style={{ color: 'var(--color-bark)', opacity: 0.7 }}>{date}</small>
                        <h2 style={{ fontSize: '1.5rem', margin: '0.5rem 0' }}>
                            <Link href={`/${lang}/journal/${slug}`} style={{ textDecoration: 'none', color: 'var(--color-terracotta)' }}>
                                {title}
                            </Link>
                        </h2>
                        <p style={{ marginBottom: '1rem', color: 'var(--color-bark)' }}>{excerpt}</p>
                        <Link href={`/${lang}/journal/${slug}`} style={{
                            fontWeight: 'bold',
                            color: 'var(--color-moss-green)',
                            textDecoration: 'underline'
                        }}>
                            Read more &rarr;
                        </Link>
                    </div>
                ))}
                {posts.length === 0 && (
                    <p style={{ textAlign: 'center' }}>No posts found.</p>
                )}
            </div>
        </div>
    )
}
