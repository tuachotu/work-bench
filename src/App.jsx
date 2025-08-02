import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import HomePage from './components/Home/HomePage'
import JsonFormatter from './components/Tools/JsonFormatter/JsonFormatter'
import TimezoneConverter from './components/Tools/TimezoneConverter/TimezoneConverter'
import EpochConverter from './components/Tools/EpochConverter/EpochConverter'
import ListCompare from './components/Tools/ListCompare/ListCompare'
import ListDedup from './components/Tools/ListDedup/ListDedup'
import ListSort from './components/Tools/ListSort/ListSort'
import ListUnique from './components/Tools/ListUnique/ListUnique'
import UidGenerator from './components/Tools/UidGenerator/UidGenerator'
import StringOperations from './components/Tools/StringOperations/StringOperations'
import DataConverter from './components/Tools/DataConverter/DataConverter'
import FindPixel from './components/Tools/FindPixel/FindPixel'
import TextProcessing from './components/Tools/TextProcessing/TextProcessing'
import PacmanGame from './components/Games/PacmanGame'
import MarioGame from './components/Games/MarioGame'
import BombermanGame from './components/Games/BombermanGame'
import TankGame from './components/Games/TankGame'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        {/* Formatters */}
        <Route path="/json" element={<JsonFormatter />} />
        <Route path="/yaml" element={<ComingSoon name="YAML Formatter" />} />
        <Route path="/sql" element={<ComingSoon name="SQL Formatter" />} />
        
        {/* List Operations */}
        <Route path="/compare" element={<ListCompare />} />
        <Route path="/dedup" element={<ListDedup />} />
        <Route path="/unique" element={<ListUnique />} />
        <Route path="/sort" element={<ListSort />} />
        
        {/* String Operations */}
        <Route path="/string/length" element={<StringOperations />} />
        <Route path="/string/cleanup" element={<StringOperations />} />
        <Route path="/string/escape" element={<StringOperations />} />
        <Route path="/string/slugify" element={<StringOperations />} />
        
        {/* Encode/Decode */}
        <Route path="/encode/url" element={<ComingSoon name="URL Encoder" />} />
        <Route path="/encode/base64" element={<ComingSoon name="Base64 Encoder" />} />
        
        {/* Conversion */}
        <Route path="/convert/hex" element={<ComingSoon name="HEX/Binary Converter" />} />
        <Route path="/convert/ascii" element={<ComingSoon name="ASCII Converter" />} />
        <Route path="/convert/csv" element={<DataConverter />} />
        <Route path="/convert/yaml" element={<DataConverter />} />
        <Route path="/convert/xml" element={<DataConverter />} />
        
        {/* Generators */}
        <Route path="/generate/uuid" element={<UidGenerator />} />
        <Route path="/generate/hash" element={<ComingSoon name="Hash Generator" />} />
        
        {/* Time */}
        <Route path="/time/zone" element={<TimezoneConverter />} />
        <Route path="/time/epoch" element={<EpochConverter />} />
        
        {/* Images */}
        <Route path="/images/find-pixel" element={<FindPixel />} />
        
        {/* Text Processing */}
        <Route path="/text/random" element={<TextProcessing />} />
        <Route path="/text/format" element={<TextProcessing />} />
        <Route path="/text/cleanup" element={<TextProcessing />} />
        
        {/* Games */}
        <Route path="/games/pacman" element={<PacmanGame />} />
        <Route path="/games/mario" element={<MarioGame />} />
        <Route path="/games/bomberman" element={<BombermanGame />} />
        <Route path="/games/tank" element={<TankGame />} />
        
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Layout>
  )
}

function ComingSoon({ name }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚧</div>
      <h2 style={{ 
        fontSize: '2rem', 
        marginBottom: '1rem',
        color: 'var(--text-primary)'
      }}>
        {name}
      </h2>
      <p style={{ 
        fontSize: '1.125rem',
        color: 'var(--text-secondary)',
        maxWidth: '600px',
        lineHeight: 1.6 
      }}>
        This tool is coming soon! We're working hard to bring you more developer tools.
        For now, enjoy the JSON Formatter and stay tuned for updates on work-bench.dev.
      </p>
    </div>
  )
}

export default App