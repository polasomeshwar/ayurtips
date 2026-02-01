import Link from 'next/link'
import styles from '../page.module.css'
import { getDictionary } from '../../lib/get-dictionary'
import { getSortedPostsData } from '../../lib/posts'
import AdUnit from '../../components/AdUnit'

import type { Locale } from '../../i18n-config'

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  const allPosts = getSortedPostsData(lang)
  const latestPost = allPosts[0]
  const recentPosts = allPosts.slice(1, 4)

  return (
    <div style={{ padding: 'var(--spacing-md)' }}>
      {/* Hero Section */}
      <section style={{
        textAlign: 'center',
        padding: 'var(--spacing-lg) 0',
        marginBottom: 'var(--spacing-lg)',
        backgroundImage: 'radial-gradient(circle at center, var(--color-sand) 0%, transparent 70%)'
      }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: 'var(--spacing-sm)', color: 'var(--color-moss-green)' }}>
          {dict.home.title}
        </h1>
        <p style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', color: 'var(--color-bark)' }}>
          {dict.home.description}
        </p>
      </section>

      {/* Daily Tip (Featured Post) */}
      {latestPost && (
        <section style={{ maxWidth: '800px', margin: '0 auto var(--spacing-lg)' }}>
          <h2 style={{ textAlign: 'center', color: 'var(--color-terracotta)', marginBottom: 'var(--spacing-md)' }}>
            Daily Wisdom
          </h2>
          <div style={{
            padding: 'var(--spacing-lg)',
            backgroundColor: 'rgba(255,255,255,0.6)',
            border: '1px solid var(--color-sand)',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
          }}>
            <small style={{ textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--color-moss-green)' }}>Today's Tip</small>
            <h3 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>
              <Link href={`/${lang}/journal/${latestPost.slug}`} style={{ textDecoration: 'none', color: 'var(--color-bark)' }}>
                {latestPost.title}
              </Link>
            </h3>
            <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem', opacity: 0.8 }}>{latestPost.excerpt}</p>
            <Link href={`/${lang}/journal/${latestPost.slug}`} style={{
              display: 'inline-block',
              padding: '0.8rem 2rem',
              backgroundColor: 'var(--color-moss-green)',
              color: 'var(--color-parchment)',
              borderRadius: '4px',
              fontWeight: 'bold'
            }}>
              Read Full Post
            </Link>
          </div>
        </section>
      )}

      <AdUnit slot="homepage-middle" />

      {/* Recent Posts Grid */}
      {recentPosts.length > 0 && (
        <section style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ marginBottom: 'var(--spacing-md)', textAlign: 'center' }}>Recent Entries</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-md)' }}>
            {recentPosts.map((post) => (
              <div key={post.slug} style={{
                padding: 'var(--spacing-md)',
                backgroundColor: 'rgba(255,255,255,0.4)',
                border: '1px solid var(--color-sand)',
                borderRadius: '8px'
              }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                  <Link href={`/${lang}/journal/${post.slug}`} style={{ textDecoration: 'none', color: 'var(--color-bark)' }}>
                    {post.title}
                  </Link>
                </h3>
                <p style={{ fontSize: '1rem', opacity: 0.8 }}>{post.excerpt}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
