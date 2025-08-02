import { useNavigate, useLocation } from 'react-router-dom'
import Header from './Header'

export default function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  
  const isHome = location.pathname === '/'
  const title = isHome ? 'work-bench.dev' : getPageTitle(location.pathname)

  function getPageTitle(pathname) {
    const routes = {
      // Formatters
      '/json': 'json formatter',
      '/yaml': 'yaml formatter', 
      '/sql': 'sql formatter',
      
      // List Operations
      '/compare': 'list compare',
      '/dedup': 'list dedup',
      '/unique': 'unique items',
      '/sort': 'list sort',
      
      // String Operations
      '/string/length': 'string length',
      '/string/cleanup': 'string cleanup',
      '/string/escape': 'string escape',
      '/string/slugify': 'slugify',
      
      // Encode/Decode
      '/encode/url': 'url encode',
      '/encode/base64': 'base64 encode',
      
      // Conversion
      '/convert/hex': 'hex converter',
      '/convert/ascii': 'ascii converter',
      '/convert/csv': 'csv converter',
      
      // Generators
      '/generate/uuid': 'uuid generator',
      '/generate/hash': 'hash generator',
      
      // Time
      '/time/zone': 'timezone converter',
      '/time/epoch': 'epoch converter'
    }
    return routes[pathname] || 'work-bench.dev'
  }

  const handleBack = () => {
    navigate('/')
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'var(--bg-primary)'
    }}>
      <Header 
        title={title}
        showBack={!isHome}
        onBack={handleBack}
      />
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {children}
      </main>
    </div>
  )
}