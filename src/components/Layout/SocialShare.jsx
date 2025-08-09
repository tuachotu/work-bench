export default function SocialShare({ 
  text, 
  hashtags = ['developer', 'tools', 'productivity'], 
  showLabel = true,
  size = 'normal' // normal, small, large
}) {
  const siteUrl = 'https://work-bench.dev'
  const siteMention = 'work-bench.dev'
  
  // Create share text with site mention
  const shareText = `${text} - Check out more developer tools at ${siteMention}`
  const hashtagString = hashtags.join(',')
  
  // URL encode the text for sharing
  const encodedText = encodeURIComponent(shareText)
  const encodedUrl = encodeURIComponent(siteUrl)
  
  // Share URLs
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}&hashtags=${hashtagString}&url=${encodedUrl}`
  const linkedinUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodedText}%20${encodedUrl}`
  
  // Handle share button clicks
  const handleShare = (platform) => {
    const url = platform === 'twitter' ? twitterUrl : linkedinUrl
    
    // Open in new window with specific dimensions
    const width = 600
    const height = 400
    const left = (window.innerWidth - width) / 2
    const top = (window.innerHeight - height) / 2
    
    window.open(
      url,
      'share',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    )
  }
  
  // Size configurations
  const sizeConfig = {
    small: {
      padding: '0.4rem 0.7rem',
      fontSize: '0.8rem',
      iconSize: '14px',
      gap: '0.4rem'
    },
    normal: {
      padding: '0.6rem 1rem',
      fontSize: '0.85rem', 
      iconSize: '16px',
      gap: '0.5rem'
    },
    large: {
      padding: '0.8rem 1.2rem',
      fontSize: '0.9rem',
      iconSize: '18px',
      gap: '0.6rem'
    }
  }
  
  const config = sizeConfig[size]
  
  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: config.gap,
    padding: config.padding,
    border: '1px solid var(--border-color)',
    borderRadius: '6px',
    background: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    textDecoration: 'none',
    fontSize: config.fontSize,
    fontFamily: 'var(--font-mono)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap'
  }
  
  const twitterHoverStyle = {
    background: '#1DA1F2',
    color: 'white',
    borderColor: '#1DA1F2'
  }
  
  const linkedinHoverStyle = {
    background: '#0A66C2',
    color: 'white', 
    borderColor: '#0A66C2'
  }
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      flexWrap: 'wrap'
    }}>
      {showLabel && (
        <span style={{
          fontSize: config.fontSize,
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-mono)',
          fontWeight: 500
        }}>
          Share:
        </span>
      )}
      
      {/* Twitter Button */}
      <button
        onClick={() => handleShare('twitter')}
        style={buttonStyle}
        onMouseEnter={(e) => {
          Object.assign(e.target.style, twitterHoverStyle)
        }}
        onMouseLeave={(e) => {
          Object.assign(e.target.style, buttonStyle)
        }}
        title="Share on Twitter"
      >
        <svg 
          width={config.iconSize} 
          height={config.iconSize} 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        Twitter
      </button>
      
      {/* LinkedIn Button */}
      <button
        onClick={() => handleShare('linkedin')}
        style={buttonStyle}
        onMouseEnter={(e) => {
          Object.assign(e.target.style, linkedinHoverStyle)
        }}
        onMouseLeave={(e) => {
          Object.assign(e.target.style, buttonStyle)
        }}
        title="Share on LinkedIn"
      >
        <svg 
          width={config.iconSize} 
          height={config.iconSize} 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
        LinkedIn
      </button>
    </div>
  )
}