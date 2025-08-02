export default function PacmanGame() {
  return (
    <div style={{
      padding: '3rem 2rem',
      maxWidth: '800px',
      margin: '0 auto',
      textAlign: 'center'
    }}>
      <div style={{
        fontSize: '4rem',
        marginBottom: '2rem'
      }}>
        🎮
      </div>
      
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: 700,
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-mono)',
        marginBottom: '1rem'
      }}>
        Pacman
      </h1>
      
      <p style={{
        fontSize: '1.25rem',
        color: 'var(--text-secondary)',
        lineHeight: 1.6,
        fontFamily: 'var(--font-mono)',
        marginBottom: '3rem'
      }}>
        $ classic arcade game coming soon...
      </p>
      
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '3rem 2rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          fontSize: '3rem',
          marginBottom: '1rem'
        }}>
          🟡👻👻👻
        </div>
        <p style={{
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
          fontSize: '1rem',
          margin: 0
        }}>
          # Navigate mazes, collect dots, avoid ghosts
          <br />
          # Use arrow keys to move
          <br />
          # Eat power pellets to turn the tables
        </p>
      </div>
      
      <div style={{
        padding: '1.5rem',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--warning-color)',
        borderRadius: '8px',
        color: 'var(--warning-color)',
        fontFamily: 'var(--font-mono)'
      }}>
        ⚠️ Game under development - Check back soon!
      </div>
    </div>
  )
}