import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Dashboard from './Dashboard'
import DBADashboard from './Dbadashboard'
import LoginScreen from './LoginScreen'
import UserQueryDashboard from './UserQueryDashboard'
import { useAuth } from './AuthContext'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line, ResponsiveContainer
} from 'recharts'

/* ─── GLOBAL STYLES ─── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:         #04080f;
    --surface:    #080f1c;
    --panel:      #0a1220;
    --border:     rgba(34,197,94,0.15);
    --border2:    rgba(255,255,255,0.06);
    --green:      #22c55e;
    --green-dim:  rgba(34,197,94,0.12);
    --green-glow: rgba(34,197,94,0.35);
    --amber:      #f59e0b;
    --red:        #ef4444;
    --text:       #e2e8f0;
    --muted:      #64748b;
    --font-mono:  'IBM Plex Mono', monospace;
    --font-sans:  'Space Grotesk', sans-serif;
  }
  body { background: var(--bg); color: var(--text); }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(34,197,94,0.25); border-radius: 2px; }
  @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes fadeUp   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse-border { 0%,100%{box-shadow:0 0 0 0 var(--green-glow)} 50%{box-shadow:0 0 16px 2px var(--green-glow)} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  @keyframes rowIn    { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:translateX(0)} }
`

function injectStyles() {
  if (document.getElementById('pcis-styles')) return
  const s = document.createElement('style')
  s.id = 'pcis-styles'
  s.textContent = GLOBAL_CSS
  document.head.appendChild(s)
}

/* ─── CLOCK ─── */
function Clock() {
  const [t, setT] = useState(new Date())
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id) }, [])
  return (
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--green)', letterSpacing: '0.08em' }}>
      {t.toUTCString().slice(17, 25)} UTC
    </span>
  )
}

/* ─── STATUS BAR ─── */
function StatusBar({ activeQuery, loading, role }) {
  return (
    <div style={{
      height: '28px', background: 'var(--surface)', borderTop: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 20px', fontFamily: 'var(--font-mono)', fontSize: '10px',
      color: 'var(--muted)', flexShrink: 0,
    }}>
      <span style={{ color: 'var(--green)' }}>
        {loading ? '⬤ FETCHING...' : activeQuery ? `⬤ ${activeQuery.endpoint.toUpperCase()}` : '⬤ READY'}
      </span>
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <span>PCIS v2.0</span>
        <span>MySQL · MongoDB · Neo4j · Redis</span>
        {role === 'dba' && (
          <span style={{
            padding: '1px 8px', borderRadius: '3px', fontSize: '8px',
            background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)',
            color: 'var(--amber)', letterSpacing: '0.1em',
          }}>DBA</span>
        )}
        <Clock />
      </div>
    </div>
  )
}

/* ─── CAT LABEL ─── */
function CatLabel({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '18px 0 6px' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600, letterSpacing: '0.16em', color: 'var(--muted)', textTransform: 'uppercase' }}>
        {label}
      </span>
      <div style={{ flex: 1, height: '1px', background: 'var(--border2)' }} />
    </div>
  )
}

/* ─── SIDEBAR ITEM ─── */
function QueryItem({ q, active, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '7px 10px', marginBottom: '2px', borderRadius: '4px', cursor: 'pointer',
        fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.02em',
        transition: 'all 0.15s ease',
        background: active ? 'var(--green-dim)' : hov ? 'rgba(255,255,255,0.04)' : 'transparent',
        color: active ? 'var(--green)' : hov ? 'var(--text)' : 'var(--muted)',
        borderLeft: active ? '2px solid var(--green)' : '2px solid transparent',
      }}
    >
      <span style={{ opacity: 0.5, fontSize: '9px' }}>
        {q.chart === 'bar' ? '▬' : q.chart === 'line' ? '⌇' : '≡'}
      </span>
      {q.name}
    </div>
  )
}

/* ─── TOOLTIP ─── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--panel)', border: '1px solid var(--border)',
      padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: '11px', borderRadius: '4px',
    }}>
      <div style={{ color: 'var(--muted)', marginBottom: '4px' }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: 'var(--green)' }}>
          {p.name}: <strong>{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</strong>
        </div>
      ))}
    </div>
  )
}

/* ─── MAIN ─── */
export default function QueryConsole() {
  const { session, logout } = useAuth()
  const [data, setData]               = useState([])
  const [activeQuery, setActiveQuery] = useState(null)
  const [view, setView]               = useState('home') // 'home' | 'result'
  const [loading, setLoading]         = useState(false)
  const mainRef = useRef(null)

  useEffect(() => { injectStyles() }, [])

  // Reset to home when session changes
  useEffect(() => {
    if (session) { setView('home'); setActiveQuery(null); setData([]) }
  }, [session?.role])

  // Show login if not authenticated
  if (!session) return <LoginScreen />

  const isDBA = session.role === 'dba'

  /* ── Query definitions (all your real endpoints) ── */
  const queries = {
    "Venture Analytics": [
      { name: 'Total Investment',   endpoint: 'total-investment',   chart: 'bar' },
      { name: 'Investment Count',   endpoint: 'investment-count',   chart: 'bar' },
      { name: 'Average Investment', endpoint: 'avg-investment',     chart: 'bar' },
      { name: 'NAV',                endpoint: 'nav',                chart: 'bar' },
      { name: 'Proceeds',           endpoint: 'proceeds',           chart: 'bar' },
      { name: 'Net Position',       endpoint: 'net-position',       chart: 'bar' },
    ],
    "LP Analytics": [
      { name: 'LP Commitment',      endpoint: 'lp-commitment',      chart: 'bar' },
      { name: 'LP Called',          endpoint: 'lp-called',          chart: 'bar' },
      { name: 'LP Venture',         endpoint: 'lp-venture',         chart: null },
      { name: 'Venture Commitment', endpoint: 'venture-commitment', chart: 'bar' },
      { name: 'LP Returns',         endpoint: 'lp-returns',         chart: 'bar' },
    ],
    "Deal Analytics": [
      { name: 'Deal Stage',         endpoint: 'deal-stage',         chart: 'bar' },
      { name: 'Deal Outcome',       endpoint: 'deal-outcome',       chart: null },
      { name: 'Deal Score',         endpoint: 'deal-score',         chart: 'bar' },
      { name: 'Deal Source',        endpoint: 'deal-source',        chart: 'bar' },
      { name: 'Company Stage',      endpoint: 'company-stage',      chart: null },
    ],
    "Partner Analytics": [
      { name: 'Partner Deals',       endpoint: 'partner-deals',       chart: 'bar' },
      { name: 'Partner Investments', endpoint: 'partner-investments', chart: 'bar' },
      { name: 'Partner Score',       endpoint: 'partner-score',       chart: 'bar' },
      { name: 'Partner Title',       endpoint: 'partner-title',       chart: 'bar' },
      { name: 'Partner Capital',     endpoint: 'partner-capital',     chart: 'bar' },
    ],
    "Investment Analytics": [
      { name: 'Company Investment', endpoint: 'company-investment', chart: 'bar' },
      { name: 'Ownership',          endpoint: 'ownership',          chart: null },
      { name: 'Rounds',             endpoint: 'rounds',             chart: 'bar' },
      { name: 'Venture Company',    endpoint: 'venture-company',    chart: null },
      { name: 'Avg Ownership',      endpoint: 'avg-ownership',      chart: null },
    ],
    "Exit Analytics": [
      { name: 'Exit Distribution',  endpoint: 'exit-distribution',  chart: 'bar' },
      { name: 'Exit Company',       endpoint: 'exit-company',       chart: null },
      { name: 'Total Exit',         endpoint: 'total-exit',         chart: 'bar' },
      { name: 'Exit Timeline',      endpoint: 'exit-timeline',      chart: 'line' },
    ],
    "Valuation Analytics": [
      { name: 'Valuation Single',   endpoint: 'valuation-single',   chart: 'line' },
      { name: 'Valuation Max',      endpoint: 'valuation-max',      chart: 'bar' },
      { name: 'Valuation Avg',      endpoint: 'valuation-avg',      chart: 'line' },
      { name: 'Valuation Lag',      endpoint: 'valuation-lag',      chart: null },
    ],
    "Market Analytics": [
      { name: 'Benchmark',          endpoint: 'benchmark',          chart: 'line' },
      { name: 'Benchmark Range',    endpoint: 'benchmark-range',    chart: null },
      { name: 'Benchmark Change',   endpoint: 'benchmark-change',   chart: 'line' },
      { name: 'FX Rate',            endpoint: 'fx-rate',            chart: 'line' },
      { name: 'FX Avg',             endpoint: 'fx-avg',             chart: null },
    ],
    "System": [
      { name: 'Audit Log',          endpoint: 'audit',              chart: null },
    ],
  }

  const runQuery = (q, extraParams = {}) => {
    setView('result')
    setActiveQuery(q)
    setLoading(true)
    setData([])
    const clean = Object.fromEntries(Object.entries(extraParams).filter(([, v]) => v !== '' && v !== undefined && v !== null))
    const qs = new URLSearchParams(clean).toString()
    const url = `http://localhost:3000/api/analytics/${q.endpoint}${qs ? `?${qs}` : ''}`
    axios.get(url)
      .then(res => { setData(res.data); setLoading(false) })
      .catch(() => { setData([]); setLoading(false) })
  }

  const keys        = data.length > 0 ? Object.keys(data[0]) : []
  const numericKeys = keys.filter(k => typeof data[0]?.[k] === 'number')
  const stats = numericKeys.slice(0, 3).map(k => ({
    label: k,
    value: data.reduce((s, r) => s + Number(r[k]), 0),
    avg:   (data.reduce((s, r) => s + Number(r[k]), 0) / data.length).toFixed(1),
  }))

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      width: '100vw', height: '100vh',
      background: 'var(--bg)', fontFamily: 'var(--font-sans)', overflow: 'hidden',
    }}>

      {/* ── TOP BAR ── */}
      <div style={{
        height: '48px', background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', padding: '0 20px', gap: '16px',
        flexShrink: 0, position: 'relative', zIndex: 10,
      }}>
        {/* logo */}
        <div style={{
          width: '28px', height: '28px', border: '1.5px solid var(--green)',
          borderRadius: '4px', display: 'grid', placeItems: 'center',
          animation: 'pulse-border 3s infinite',
        }}>
          <span style={{ color: 'var(--green)', fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>W</span>
        </div>

        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.04em', color: 'var(--text)' }}>PCIS Terminal</div>
          <div style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.1em', fontFamily: 'var(--font-mono)' }}>
            POLYGLOT CAPITAL INTELLIGENCE SYSTEM
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* DB badges */}
        {['MySQL', 'MongoDB', 'Neo4j', 'Redis'].map((db, i) => (
          <div key={i} style={{
            padding: '3px 10px', borderRadius: '3px', fontSize: '9px',
            fontFamily: 'var(--font-mono)', fontWeight: 500, letterSpacing: '0.08em',
            border: '1px solid var(--border)', color: 'var(--green)', background: 'var(--green-dim)',
          }}>{db}</div>
        ))}

        {/* live dot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '12px' }}>
          <div style={{
            width: '6px', height: '6px', borderRadius: '50%', background: 'var(--green)',
            boxShadow: '0 0 8px var(--green)', animation: 'blink 2s infinite',
          }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)' }}>LIVE</span>
        </div>

        {/* session strip */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          marginLeft: '16px', paddingLeft: '16px', borderLeft: '1px solid var(--border2)',
        }}>
          {isDBA && (
            <div style={{
              padding: '2px 8px', borderRadius: '3px', fontSize: '8px',
              fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: '0.1em',
              background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
              color: 'var(--amber)',
            }}>DBA</div>
          )}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)' }}>
            {session.name}
          </span>
          <button
            onClick={logout}
            style={{
              padding: '3px 10px', borderRadius: '3px', border: '1px solid var(--border)',
              background: 'transparent', fontFamily: 'var(--font-mono)', fontSize: '9px',
              letterSpacing: '0.08em', color: 'var(--muted)', cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.target.style.color = 'var(--red)'; e.target.style.borderColor = 'rgba(239,68,68,0.35)' }}
            onMouseLeave={e => { e.target.style.color = 'var(--muted)'; e.target.style.borderColor = 'rgba(34,197,94,0.15)' }}
          >
            LOGOUT
          </button>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── SIDEBAR ── */}
        <div style={{
          width: '230px', background: 'var(--surface)', borderRight: '1px solid var(--border)',
          overflowY: 'auto', padding: '12px 12px 24px', flexShrink: 0,
        }}>
          {/* Home button */}
          <div
            onClick={() => { setView('home'); setActiveQuery(null) }}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '9px 12px', marginBottom: '6px', borderRadius: '5px', cursor: 'pointer',
              background: view === 'home' ? 'var(--green-dim)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${view === 'home' ? 'var(--border)' : 'transparent'}`,
              color: view === 'home' ? 'var(--green)' : 'var(--muted)',
              fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 500,
              letterSpacing: '0.06em', transition: 'all 0.15s',
            }}
          >
            <span style={{ fontSize: '10px' }}>{isDBA ? '◈' : '⊞'}</span>
            {isDBA ? 'OVERVIEW' : 'QUERY BUILDER'}
          </div>

          {/* Query groups */}
          {Object.entries(queries).map(([cat, items], i) => (
            <div key={i}>
              <CatLabel label={cat} />
              {items.map((q, j) => (
                <QueryItem
                  key={j} q={q}
                  active={activeQuery?.name === q.name}
                  onClick={() => runQuery(q)}
                />
              ))}
            </div>
          ))}
        </div>

        {/* ── MAIN PANEL ── */}
        <div ref={mainRef} style={{ flex: 1, overflowY: 'auto' }}>

          {/* HOME: DBA sees DBADashboard, User sees Query Builder */}
          {view === 'home' && (
            <div style={{ padding: '24px', animation: 'fadeUp 0.3s ease' }}>
              {isDBA ? <DBADashboard /> : <UserQueryDashboard onRunQuery={runQuery} />}
            </div>
          )}

          {/* RESULT VIEW */}
          {view === 'result' && (
            <div style={{ padding: '24px', animation: 'fadeUp 0.25s ease' }}>

              {/* page header */}
              <div style={{
                display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border2)',
              }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.12em', marginBottom: '4px' }}>
                    ANALYTICS / {activeQuery?.endpoint?.toUpperCase()}
                  </div>
                  <h1 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.02em' }}>
                    {activeQuery?.name}
                  </h1>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => { setView('home'); setActiveQuery(null) }}
                    style={{
                      padding: '5px 12px', borderRadius: '3px', border: '1px solid var(--border)',
                      background: 'transparent', fontFamily: 'var(--font-mono)', fontSize: '9px',
                      letterSpacing: '0.08em', color: 'var(--muted)', cursor: 'pointer',
                    }}
                  >← {isDBA ? 'OVERVIEW' : 'QUERY BUILDER'}</button>

                  <div style={{
                    padding: '5px 12px', borderRadius: '3px', border: '1px solid var(--border)',
                    fontFamily: 'var(--font-mono)', fontSize: '10px',
                    color: loading ? 'var(--amber)' : 'var(--green)',
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}>
                    {loading
                      ? <><span style={{ display:'inline-block', width:'8px', height:'8px', border:'1.5px solid var(--amber)', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />FETCHING</>
                      : <>{data.length > 0 ? `${data.length} ROWS` : 'NO DATA'}</>
                    }
                  </div>
                </div>
              </div>

              {/* stat cards */}
              {!loading && data.length > 0 && stats.length > 0 && (
                <div style={{
                  display: 'grid', gridTemplateColumns: `repeat(${Math.min(stats.length, 3)}, 1fr)`,
                  gap: '12px', marginBottom: '24px',
                }}>
                  {stats.map((s, i) => (
                    <div key={i} style={{
                      background: 'var(--panel)', border: '1px solid var(--border2)',
                      borderRadius: '6px', padding: '16px 18px',
                      animation: `fadeUp ${0.1 + i * 0.08}s ease`,
                    }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.12em', color: 'var(--muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                        {s.label} · TOTAL
                      </div>
                      <div style={{ fontSize: '26px', fontWeight: 600, color: 'var(--green)', fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                        {s.value.toLocaleString()}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', marginTop: '6px' }}>
                        avg {Number(s.avg).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* chart */}
              {!loading && data.length > 0 && activeQuery?.chart && (
                <div style={{
                  background: 'var(--panel)', border: '1px solid var(--border2)',
                  borderRadius: '6px', padding: '20px', marginBottom: '24px',
                  animation: 'fadeUp 0.3s ease',
                }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.12em', color: 'var(--muted)', marginBottom: '16px', textTransform: 'uppercase' }}>
                    {activeQuery.chart === 'bar' ? '▬ Bar Chart' : '⌇ Line Chart'} · {keys[1]}
                  </div>
                  <ResponsiveContainer width="100%" height={280}>
                    {activeQuery.chart === 'bar' ? (
                      <BarChart data={data} margin={{ top:0, right:0, left:0, bottom:0 }}>
                        <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey={keys[0]} stroke="var(--muted)" tick={{ fontFamily:'var(--font-mono)', fontSize:9, fill:'#64748b' }} axisLine={false} tickLine={false} />
                        <YAxis stroke="var(--muted)" tick={{ fontFamily:'var(--font-mono)', fontSize:9, fill:'#64748b' }} axisLine={false} tickLine={false} width={56} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill:'rgba(34,197,94,0.05)' }} />
                        <Bar dataKey={keys[1]} fill="#22c55e" radius={[3,3,0,0]} maxBarSize={48} />
                      </BarChart>
                    ) : (
                      <LineChart data={data} margin={{ top:0, right:0, left:0, bottom:0 }}>
                        <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey={keys[0]} stroke="var(--muted)" tick={{ fontFamily:'var(--font-mono)', fontSize:9, fill:'#64748b' }} axisLine={false} tickLine={false} />
                        <YAxis stroke="var(--muted)" tick={{ fontFamily:'var(--font-mono)', fontSize:9, fill:'#64748b' }} axisLine={false} tickLine={false} width={56} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line dataKey={keys[1]} stroke="#22c55e" strokeWidth={2} dot={{ fill:'#22c55e', r:3, strokeWidth:0 }} activeDot={{ r:5, fill:'#22c55e', strokeWidth:0 }} />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </div>
              )}

              {/* data table */}
              {!loading && data.length > 0 && (
                <div style={{
                  background: 'var(--panel)', border: '1px solid var(--border2)',
                  borderRadius: '6px', overflow: 'hidden', animation: 'fadeUp 0.35s ease',
                }}>
                  <div style={{
                    padding: '12px 18px', borderBottom: '1px solid var(--border2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <span style={{ fontFamily:'var(--font-mono)', fontSize:'9px', letterSpacing:'0.12em', color:'var(--muted)', textTransform:'uppercase' }}>≡ Result Set</span>
                    <span style={{ fontFamily:'var(--font-mono)', fontSize:'9px', color:'var(--green)' }}>{data.length} rows · {keys.length} cols</span>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width:'100%', borderCollapse:'collapse', fontFamily:'var(--font-mono)', fontSize:'12px' }}>
                      <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                          {keys.map((k, i) => (
                            <th key={i} style={{
                              padding:'10px 16px', textAlign:'left', fontWeight:500,
                              fontSize:'9px', letterSpacing:'0.1em', textTransform:'uppercase',
                              color:'var(--muted)', borderBottom:'1px solid var(--border2)', whiteSpace:'nowrap',
                            }}>{k}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((row, i) => (
                          <tr
                            key={i}
                            style={{ borderBottom:'1px solid rgba(255,255,255,0.03)', animation:`rowIn ${0.05+i*0.015}s ease`, transition:'background 0.1s' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(34,197,94,0.04)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            {Object.values(row).map((v, j) => (
                              <td key={j} style={{
                                padding:'9px 16px', whiteSpace:'nowrap',
                                color: j === 0 ? 'var(--text)' : typeof v === 'number' ? 'var(--green)' : '#94a3b8',
                              }}>
                                {typeof v === 'number' ? v.toLocaleString() : v}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* empty */}
              {!loading && data.length === 0 && (
                <div style={{
                  display:'flex', flexDirection:'column', alignItems:'center',
                  justifyContent:'center', padding:'80px 0', color:'var(--muted)',
                  animation:'fadeUp 0.3s ease',
                }}>
                  <div style={{ fontFamily:'var(--font-mono)', fontSize:'32px', opacity:0.15, marginBottom:'16px' }}>∅</div>
                  <div style={{ fontFamily:'var(--font-mono)', fontSize:'11px', letterSpacing:'0.08em' }}>NO DATA RETURNED</div>
                </div>
              )}

              {/* loader */}
              {loading && (
                <div style={{
                  display:'flex', flexDirection:'column', alignItems:'center',
                  justifyContent:'center', padding:'80px 0', gap:'16px',
                }}>
                  <div style={{
                    width:'32px', height:'32px', border:'2px solid var(--border)',
                    borderTopColor:'var(--green)', borderRadius:'50%', animation:'spin 0.8s linear infinite',
                  }} />
                  <div style={{ fontFamily:'var(--font-mono)', fontSize:'11px', letterSpacing:'0.08em', color:'var(--muted)' }}>
                    QUERYING DATABASE<span style={{ animation:'blink 1s infinite', display:'inline-block', marginLeft:'2px' }}>_</span>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>

      {/* ── STATUS BAR ── */}
      <StatusBar activeQuery={activeQuery} loading={loading} role={session.role} />
    </div>
  )
}