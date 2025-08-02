import { Link } from 'react-router-dom'
import InstallInstructions from './InstallInstructions'

const toolGroups = [
  {
    category: 'Formatter',
    tools: [
      { name: 'json', path: '/json', implemented: true },
      { name: 'yaml', path: '/yaml', implemented: false },
      { name: 'sql', path: '/sql', implemented: false }
    ]
  },
  {
    category: 'List',
    tools: [
      { name: 'compare', path: '/compare', implemented: true },
      { name: 'dedup', path: '/dedup', implemented: true },
      { name: 'unique', path: '/unique', implemented: true },
      { name: 'sort', path: '/sort', implemented: true }
    ]
  },
  {
    category: 'String Operations',
    tools: [
      { name: 'length', path: '/string/length', implemented: true },
      { name: 'cleanup', path: '/string/cleanup', implemented: true },
      { name: 'escape', path: '/string/escape', implemented: true },
      { name: 'slugify', path: '/string/slugify', implemented: true }
    ]
  },
  {
    category: 'Encode Decode Operations',
    tools: [
      { name: 'url-encode', path: '/encode/url', implemented: false },
      { name: 'base64', path: '/encode/base64', implemented: false }
    ]
  },
  {
    category: 'Conversion',
    tools: [
      { name: 'hex-binary', path: '/convert/hex', implemented: false },
      { name: 'ascii', path: '/convert/ascii', implemented: false },
      { name: 'csv-json', path: '/convert/csv', implemented: true },
      { name: 'yaml-json', path: '/convert/yaml', implemented: true },
      { name: 'xml-json', path: '/convert/xml', implemented: true }
    ]
  },
  {
    category: 'Time',
    tools: [
      { name: 'timezone', path: '/time/zone', implemented: true },
      { name: 'epoch', path: '/time/epoch', implemented: true }
    ]
  },
  {
    category: 'Generator',
    tools: [
      { name: 'uuid', path: '/generate/uuid', implemented: true },
      { name: 'hash', path: '/generate/hash', implemented: false }
    ]
  },
  {
    category: 'Images',
    tools: [
      { name: 'find-pixel', path: '/images/find-pixel', implemented: true }
    ]
  },
  {
    category: 'Text Processing',
    tools: [
      { name: 'random-text', path: '/text/random', implemented: true },
      { name: 'text-format', path: '/text/format', implemented: true },
      { name: 'text-cleanup', path: '/text/cleanup', implemented: true }
    ]
  },
  {
    category: 'Games',
    tools: [
      { name: 'pacman', path: '/games/pacman', implemented: true },
      { name: 'mario', path: '/games/mario', implemented: true },
      { name: 'bomberman', path: '/games/bomberman', implemented: true },
      { name: 'tank', path: '/games/tank', implemented: true }
    ]
  }
]

export default function HomePage() {
  return (
    <div style={{
      padding: '3rem 2rem',
      maxWidth: '1400px',
      margin: '0 auto',
      width: '100%'
    }}>
      <div style={{
        marginBottom: '3rem',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
          marginBottom: '1rem'
        }}>
          <img 
            src="/icon-192.png" 
            alt="work-bench.dev" 
            style={{ 
              width: '48px', 
              height: '48px',
              borderRadius: '6px'
            }} 
          />
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)',
            margin: 0
          }}>
            work-bench.dev
          </h1>
        </div>
        <p style={{
          fontSize: '1.25rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          fontFamily: 'var(--font-mono)'
        }}>
          $ terminal-inspired developer workbench
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '2rem',
        marginBottom: '3rem'
      }}>
        {toolGroups.map((group, groupIndex) => (
          <div key={groupIndex} style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '1.5rem',
            transition: 'var(--transition)',
            height: 'fit-content'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--accent-color)',
              marginBottom: '1rem',
              fontFamily: 'var(--font-mono)'
            }}>
              {group.category}
            </h2>
            
            <p style={{
              fontSize: '1rem',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              lineHeight: 1.4,
              margin: 0
            }}>
              {group.tools.map((tool, toolIndex) => (
                tool.implemented ? (
                  <Link
                    key={toolIndex}
                    to={tool.path}
                    style={{
                      color: 'var(--text-primary)',
                      textDecoration: 'none',
                      transition: 'var(--transition)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = 'var(--accent-color)'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'var(--text-primary)'
                    }}
                  >
                    {tool.name}
                  </Link>
                ) : (
                  <span
                    key={toolIndex}
                    style={{
                      color: 'var(--text-muted)',
                      cursor: 'not-allowed',
                      opacity: 0.5
                    }}
                  >
                    {tool.name}
                  </span>
                )
              )).reduce((prev, curr, index) => 
                index === 0 ? [curr] : [...prev, ', ', curr], []
              )}
            </p>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '3rem',
        padding: '2rem 0',
        borderTop: '1px solid var(--border-color)',
        color: 'var(--text-muted)',
        fontSize: '0.9rem',
        fontFamily: 'var(--font-mono)',
        textAlign: 'center'
      }}>
        <InstallInstructions />
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '2rem',
          marginTop: '1.5rem',
          flexWrap: 'wrap'
        }}>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              onClick={() => {
                const subject = encodeURIComponent('Feature Request for work-bench.dev')
                const body = encodeURIComponent(`Hi Vikrant,

I would like to request a new tool/feature for work-bench.dev:

Tool/Feature Name: 
Description: 
Use Case: 

Additional Details:


Thanks!`)
                const mailtoUrl = `mailto:vikrant.thakur@gmail.com?subject=${subject}&body=${body}`
                window.location.href = mailtoUrl
              }}
              className="btn"
              style={{ 
                padding: '0.4rem 0.8rem',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              💡 Request a Tool/Feature
            </button>

            <button
              onClick={() => {
                const url = `https://twitter.com/intent/tweet?text=Check out work-bench.dev - A terminal-inspired developer workbench with offline tools&url=${encodeURIComponent('https://work-bench.dev')}`
                window.open(url, '_blank')
              }}
              className="btn btn-secondary"
              style={{ 
                padding: '0.4rem 0.8rem',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              📤 Share
            </button>
            
            <a
              href="https://x.com/vikkrraant"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{ 
                padding: '0.4rem 0.8rem',
                fontSize: '0.8rem',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              💬 Contact
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}