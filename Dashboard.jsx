import { useEffect, useState } from 'react'

function Dashboard() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '25px'
    }}>

      {/* HEADER */}
      <div style={{
        padding: '25px',
        borderRadius: '12px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)'
      }}>
        <h1 style={{ color: '#22c55e', marginBottom: '10px' }}>
          Polyglot Capital Intelligence System
        </h1>

        <p style={{ opacity: 0.7 }}>
          Advanced analytics platform for venture capital, deal flow analysis,
          portfolio tracking, and financial intelligence.
        </p>

        <p style={{ marginTop: '10px', fontSize: '14px', opacity: 0.5 }}>
          System Time: {time.toLocaleTimeString()}
        </p>
      </div>

      {/* FEATURE GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '20px'
      }}>

        <div style={cardStyle}>
          <h3>Venture Analytics</h3>
          <p>Track investments, NAV, and fund performance across ventures.</p>
        </div>

        <div style={cardStyle}>
          <h3>Deal Intelligence</h3>
          <p>Analyze pipeline stages, scoring, and sourcing efficiency.</p>
        </div>

        <div style={cardStyle}>
          <h3>LP Management</h3>
          <p>Monitor commitments, capital calls, and investor returns.</p>
        </div>

        <div style={cardStyle}>
          <h3>Exit Analysis</h3>
          <p>Evaluate IPOs, acquisitions, and realized gains.</p>
        </div>

        <div style={cardStyle}>
          <h3>Valuation Engine</h3>
          <p>Track mark-to-market valuations and trends over time.</p>
        </div>

        <div style={cardStyle}>
          <h3>Market Data</h3>
          <p>Benchmark indices and FX rates for macro analysis.</p>
        </div>

      </div>

      {/* SYSTEM INFO */}
      <div style={{
        padding: '20px',
        borderRadius: '12px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)'
      }}>
        <h3 style={{ marginBottom: '10px' }}>System Capabilities</h3>

        <ul style={{ opacity: 0.7 }}>
          <li>40+ SQL-powered analytics queries</li>
          <li>Real-time data visualization</li>
          <li>Portfolio and deal tracking</li>
          <li>Financial performance insights</li>
          <li>Scalable analytics architecture</li>
        </ul>
      </div>

    </div>
  )
}

const cardStyle = {
  padding: '20px',
  borderRadius: '10px',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)'
}

export default Dashboard