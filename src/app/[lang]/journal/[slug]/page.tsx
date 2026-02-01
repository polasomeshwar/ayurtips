import { getPostData } from '../../../../lib/posts'
import { getDictionary } from '../../../../lib/get-dictionary'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { Locale } from '../../../../i18n-config'

export async function generateMetadata({ params }: { params: Promise<{ lang: string, slug: string }> }): Promise<Metadata> {
    const { lang, slug } = await params
    const post = await getPostData(slug, lang)

    return {
        title: `${post.title} | Prakriti`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.date,
        },
    }
}

export default async function Post({ params }: { params: Promise<{ lang: Locale, slug: string }> }) {
    const { lang, slug } = await params
    const postData = await getPostData(slug, lang)

    return (
        <article style={{
            maxWidth: '700px',
            margin: '0 auto',
            padding: 'var(--spacing-lg) var(--spacing-md)',
            fontFamily: 'var(--font-serif)'
        }}>
            <div style={{ marginBottom: 'var(--spacing-lg)', textAlign: 'center' }}>
                <Link href={`/${lang}/journal`} style={{ fontSize: '0.9rem', color: 'var(--color-stone)', display: 'block', marginBottom: '1rem' }}>
                    &larr; Back to Journal
                </Link>
                <h1 style={{
                    fontSize: '3rem',
                    color: 'var(--color-moss-green)',
                    lineHeight: '1.2',
                    marginBottom: '0.5rem'
                }}>
                    {postData.title}
                </h1>
                <div style={{ color: 'var(--color-terracotta)', fontSize: '1rem' }}>
                    {postData.date}
                </div>
            </div>

            <div
                dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
                style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--color-bark)' }}
                className="prose"
            />
        </article>
    )
}
