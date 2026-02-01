export default function Footer({ lang }: { lang: string }) {
    return (
        <footer style={{
            backgroundColor: 'var(--color-moss-green)',
            color: 'var(--color-parchment)',
            padding: 'var(--spacing-lg) var(--spacing-md)',
            marginTop: 'auto',
            textAlign: 'center'
        }}>
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <h3 style={{ color: 'var(--color-parchment)', fontFamily: 'var(--font-serif)' }}>Prakriti</h3>
                <p style={{ opacity: 0.8 }}>Ancient Wisdom for Modern Living</p>
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.6 }}>
                &copy; {new Date().getFullYear()} Prakriti. All rights reserved.
            </div>
        </footer>
    )
}
