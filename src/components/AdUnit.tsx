export default function AdUnit({ slot }: { slot: string }) {
    return (
        <div style={{
            width: '100%',
            height: '250px',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            border: '1px dashed #ccc',
            margin: 'var(--spacing-lg) 0'
        }}>
            <p>Ad Space ({slot})</p>
            {/* 
        This is where you would insert the Google AdSense script.
        Example:
        <ins className="adsbygoogle"
             style={{ display: 'block' }}
             data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
             data-ad-slot={slot}
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        <script>
             (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
      */}
        </div>
    )
}
