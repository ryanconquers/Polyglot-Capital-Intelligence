import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line, ResponsiveContainer, AreaChart, Area
} from 'recharts'

/* ── Dummy Data ── */
const SCHEMA_TABLES = [
  { table: 'VentureInvestment',  rows: 18420, size_mb: 142.4, engine: 'InnoDB', indexes: 6 },
  { table: 'VentureDeal',        rows: 7831,  size_mb: 89.1,  engine: 'InnoDB', indexes: 8 },
  { table: 'VentureLP',          rows: 312,   size_mb: 4.2,   engine: 'InnoDB', indexes: 4 },
  { table: 'VenturePartner',     rows: 48,    size_mb: 0.8,   engine: 'InnoDB', indexes: 3 },
  { table: 'VentureCompany',     rows: 924,   size_mb: 21.6,  engine: 'InnoDB', indexes: 5 },
  { table: 'VentureExit',        rows: 203,   size_mb: 6.3,   engine: 'InnoDB', indexes: 4 },
  { table: 'VentureValuation',   rows: 5610,  size_mb: 67.9,  engine: 'InnoDB', indexes: 5 },
  { table: 'VentureBenchmark',   rows: 43800, size_mb: 312.0, engine: 'InnoDB', indexes: 3 },
  { table: 'VentureFX',          rows: 21900, size_mb: 178.5, engine: 'InnoDB', indexes: 3 },
  { table: 'VentureAuditLog',    rows: 88240, size_mb: 540.2, engine: 'InnoDB', indexes: 4 },
  { table: 'VentureCommitment',  rows: 1024,  size_mb: 18.7,  engine: 'InnoDB', indexes: 4 },
  { table: 'VentureRound',       rows: 2341,  size_mb: 33.4,  engine: 'InnoDB', indexes: 5 },
]

const ACTIVE_SESSIONS = [
  { id: 'conn_4821', user: 'app_reader',   host: '10.0.1.12', db: 'pcis_prod', state: 'Sleep',   time_s: 4,    query: '—' },
  { id: 'conn_4822', user: 'dba@wertkern', host: '10.0.1.1',  db: 'pcis_prod', state: 'Query',   time_s: 0,    query: 'SELECT * FROM VentureAuditLog LIMIT 100' },
  { id: 'conn_4817', user: 'app_writer',   host: '10.0.1.14', db: 'pcis_prod', state: 'Sleep',   time_s: 12,   query: '—' },
  { id: 'conn_4799', user: 'analytics_ro', host: '10.0.1.20', db: 'pcis_prod', state: 'Sending', time_s: 2,    query: 'SELECT venture_id, SUM(amount) FROM VentureInvestment GROUP BY venture_id' },
  { id: 'conn_4801', user: 'etl_service',  host: '10.0.1.33', db: 'pcis_prod', state: 'Sleep',   time_s: 847,  query: '—' },
]

const SLOW_QUERIES = [
  { query: 'SELECT v.*, e.exit_value FROM VentureCompany v JOIN VentureExit e ON v.id = e.company_id WHERE e.exit_date > ?', avg_ms: 1240, calls: 38, rows_examined: 92000 },
  { query: 'SELECT lp_id, SUM(called_amount) FROM VentureCommitment GROUP BY lp_id HAVING SUM > ?',                         avg_ms: 874,  calls: 71, rows_examined: 43200 },
  { query: 'SELECT * FROM VentureBenchmark WHERE index_name = ? ORDER BY date DESC LIMIT 365',                               avg_ms: 521,  calls: 204,rows_examined: 43800 },
  { query: 'UPDATE VentureValuation SET nav = ? WHERE company_id = ? AND as_of_date = ?',                                    avg_ms: 318,  calls: 89, rows_examined: 1200  },
]

const QUERY_VOLUME = [
  { hour: '00:00', reads: 120, writes: 18 },
  { hour: '02:00', reads: 80,  writes: 9  },
  { hour: '04:00', reads: 45,  writes: 4  },
  { hour: '06:00', reads: 190, writes: 22 },
  { hour: '08:00', reads: 840, writes: 134},
  { hour: '10:00', reads: 1240,writes: 210},
  { hour: '12:00', reads: 980, writes: 187},
  { hour: '14:00', reads: 1380,writes: 241},
  { hour: '16:00', reads: 1120,writes: 198},
  { hour: '18:00', reads: 620, writes: 89 },
  { hour: '20:00', reads: 340, writes: 44 },
  { hour: '22:00', reads: 210, writes: 27 },
]

const AUDIT_RECENT = [
  { ts: '2026-04-08 22:31:04', user: 'app_writer',   action: 'INSERT', table: 'VentureDeal',      rows: 1  },
  { ts: '2026-04-08 22:28:51', user: 'etl_service',  action: 'UPDATE', table: 'VentureValuation', rows: 14 },
  { ts: '2026-04-08 22:21:17', user: 'app_writer',   action: 'INSERT', table: 'VentureAuditLog',  rows: 1  },
  { ts: '2026-04-08 22:14:03', user: 'analytics_ro', action: 'SELECT', table: 'VentureBenchmark', rows: 365},
  { ts: '2026-04-08 22:09:44', user: 'etl_service',  action: 'INSERT', table: 'VentureFX',        rows: 60 },
  { ts: '2026-04-08 21:58:22', user: 'app_writer',   action: 'UPDATE', table: 'VentureLP',        rows: 2  },
  { ts: '2026-04-08 21:44:11', user: 'dba@wertkern', action: 'SELECT', table: 'VentureAuditLog',  rows: 100},
]

const DB_STATS = [
  { label: 'TOTAL TABLES',    value: '18',      sub: 'across pcis_prod' },
  { label: 'TOTAL SIZE',      value: '1.41 GB', sub: 'data + indexes'   },
  { label: 'ACTIVE CONNS',    value: '5',       sub: 'max_connections 100' },
  { label: 'SLOW QUERIES/HR', value: '12',      sub: 'threshold > 300ms'  },
  { label: 'UPTIME',          value: '18d 4h',  sub: 'since last restart'  },
  { label: 'BUFFER POOL HIT', value: '98.4%',   sub: 'InnoDB cache efficiency' },
]

/* ── Helpers ── */
const V = {
  panel: '#0a1220', border2: 'rgba(255,255,255,0.06)',
  green: '#22c55e', amber: '#f59e0b', red: '#ef4444',
  text: '#e2e8f0', muted: '#64748b',
  mono: "'IBM Plex Mono', monospace", sans: "'Space Grotesk', sans-serif",
}

function SectionLabel({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '28px 0 12px' }}>
      <span style={{ fontFamily: V.mono, fontSize: '9px', fontWeight: 600, letterSpacing: '0.16em', color: V.muted, textTransform: 'uppercase' }}>
        {children}
      </span>
      <div style={{ flex: 1, height: '1px', background: V.border2 }} />
    </div>
  )
}

function Panel({ children, style = {} }) {
  return (
    <div style={{
      background: V.panel, border: `1px solid ${V.border2}`,
      borderRadius: '6px', overflow: 'hidden', ...style,
    }}>
      {children}
    </div>
  )
}

function StatCard({ label, value, sub, i }) {
  return (
    <div style={{
      background: V.panel, border: `1px solid ${V.border2}`,
      borderRadius: '6px', padding: '16px 18px',
      animation: `fadeUp ${0.08 + i * 0.06}s ease`,
    }}>
      <div style={{ fontFamily: V.mono, fontSize: '9px', letterSpacing: '0.12em', color: V.muted, marginBottom: '8px', textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ fontSize: '22px', fontWeight: 600, color: V.green, fontFamily: V.mono, letterSpacing: '-0.02em', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontFamily: V.mono, fontSize: '9px', color: V.muted, marginTop: '6px' }}>{sub}</div>
    </div>
  )
}

function ActionBadge({ action }) {
  const colors = {
    INSERT: { color: V.green,  bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.25)' },
    UPDATE: { color: V.amber,  bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)' },
    SELECT: { color: '#60a5fa',bg: 'rgba(96,165,250,0.1)',  border: 'rgba(96,165,250,0.25)' },
    DELETE: { color: V.red,    bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.25)' },
  }
  const c = colors[action] || { color: V.muted, bg: 'transparent', border: V.border2 }
  return (
    <span style={{
      padding: '2px 8px', borderRadius: '3px', fontSize: '9px',
      fontFamily: V.mono, fontWeight: 600, letterSpacing: '0.08em',
      color: c.color, background: c.bg, border: `1px solid ${c.border}`,
    }}>{action}</span>
  )
}

function StateBadge({ state }) {
  const color = state === 'Query' || state === 'Sending' ? V.amber : V.muted
  return (
    <span style={{ fontFamily: V.mono, fontSize: '10px', color }}>{state}</span>
  )
}

/* ── Custom Tooltip ── */
function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: V.panel, border: `1px solid rgba(34,197,94,0.2)`, padding: '10px 14px', fontFamily: V.mono, fontSize: '11px', borderRadius: '4px' }}>
      <div style={{ color: V.muted, marginBottom: '4px' }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || V.green }}>{p.name}: <strong>{p.value.toLocaleString()}</strong></div>
      ))}
    </div>
  )
}

/* ── Main DBA Dashboard ── */
export default function DBADashboard() {
  const [tick, setTick] = useState(0)
  useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 5000); return () => clearInterval(id) }, [])

  const totalRows = SCHEMA_TABLES.reduce((s, t) => s + t.rows, 0)
  const totalMB   = SCHEMA_TABLES.reduce((s, t) => s + t.size_mb, 0)

  return (
    <div style={{ animation: 'fadeUp 0.3s ease' }}>

      {/* ── Top header ── */}
      <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: `1px solid ${V.border2}` }}>
        <div style={{ fontFamily: V.mono, fontSize: '10px', color: V.muted, letterSpacing: '0.12em', marginBottom: '4px' }}>
          DBA WORKSPACE / SYSTEM OVERVIEW
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 600, color: V.text, letterSpacing: '-0.02em', fontFamily: V.sans }}>
            Database Control Centre
          </h1>
          <span style={{
            padding: '3px 10px', borderRadius: '3px', fontSize: '9px',
            fontFamily: V.mono, fontWeight: 600, letterSpacing: '0.1em',
            background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
            color: V.amber,
          }}>DBA ROOT ACCESS</span>
          <span style={{
            padding: '3px 10px', borderRadius: '3px', fontSize: '9px',
            fontFamily: V.mono, letterSpacing: '0.08em',
            background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
            color: V.green,
          }}>● pcis_prod · MySQL 8.0.36</span>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px', marginBottom: '4px' }}>
        {DB_STATS.map((s, i) => <StatCard key={i} {...s} i={i} />)}
      </div>

      {/* ── Query volume chart ── */}
      <SectionLabel>Query Volume — Last 24h</SectionLabel>
      <Panel>
        <div style={{ padding: '16px 18px 0', fontFamily: V.mono, fontSize: '9px', letterSpacing: '0.1em', color: V.muted }}>
          ⌇ READ vs WRITE OPS / HOUR &nbsp;·&nbsp;
          <span style={{ color: V.green }}>■ reads</span>
          &nbsp;&nbsp;
          <span style={{ color: V.amber }}>■ writes</span>
        </div>
        <div style={{ padding: '12px 8px 16px' }}>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={QUERY_VOLUME} margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gReads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gWrites" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="hour" stroke={V.muted} tick={{ fontFamily: V.mono, fontSize: 9, fill: V.muted }} axisLine={false} tickLine={false} />
              <YAxis stroke={V.muted} tick={{ fontFamily: V.mono, fontSize: 9, fill: V.muted }} axisLine={false} tickLine={false} width={48} />
              <Tooltip content={<ChartTip />} />
              <Area type="monotone" dataKey="reads"  stroke="#22c55e" strokeWidth={2} fill="url(#gReads)"  name="reads"  dot={false} />
              <Area type="monotone" dataKey="writes" stroke="#f59e0b" strokeWidth={2} fill="url(#gWrites)" name="writes" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      {/* ── Schema + Table Sizes side by side ── */}
      <SectionLabel>Schema Inspector — pcis_prod</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

        {/* Schema table */}
        <Panel>
          <div style={{ padding: '11px 16px', borderBottom: `1px solid ${V.border2}`, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: V.mono, fontSize: '9px', letterSpacing: '0.1em', color: V.muted, textTransform: 'uppercase' }}>≡ Tables</span>
            <span style={{ fontFamily: V.mono, fontSize: '9px', color: V.green }}>{SCHEMA_TABLES.length} tables · {totalRows.toLocaleString()} rows · {(totalMB / 1024).toFixed(2)} GB</span>
          </div>
          <div style={{ overflowX: 'auto', maxHeight: '300px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: V.mono, fontSize: '11px' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', position: 'sticky', top: 0 }}>
                  {['Table', 'Rows', 'Size MB', 'Indexes'].map((h, i) => (
                    <th key={i} style={{ padding: '8px 14px', textAlign: 'left', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: V.muted, borderBottom: `1px solid ${V.border2}`, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SCHEMA_TABLES.map((t, i) => (
                  <tr key={i}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(34,197,94,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '8px 14px', color: V.text,  whiteSpace: 'nowrap' }}>{t.table}</td>
                    <td style={{ padding: '8px 14px', color: V.green, whiteSpace: 'nowrap' }}>{t.rows.toLocaleString()}</td>
                    <td style={{ padding: '8px 14px', color: '#94a3b8',whiteSpace: 'nowrap' }}>{t.size_mb}</td>
                    <td style={{ padding: '8px 14px', color: '#94a3b8',whiteSpace: 'nowrap' }}>{t.indexes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* Table size bar chart */}
        <Panel>
          <div style={{ padding: '11px 16px', borderBottom: `1px solid ${V.border2}` }}>
            <span style={{ fontFamily: V.mono, fontSize: '9px', letterSpacing: '0.1em', color: V.muted, textTransform: 'uppercase' }}>▬ Table Sizes (MB)</span>
          </div>
          <div style={{ padding: '16px 8px' }}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={SCHEMA_TABLES.slice().sort((a,b) => b.size_mb - a.size_mb)} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" horizontal={false} />
                <XAxis type="number" stroke={V.muted} tick={{ fontFamily: V.mono, fontSize: 9, fill: V.muted }} axisLine={false} tickLine={false} />
                <YAxis dataKey="table" type="category" stroke={V.muted} tick={{ fontFamily: V.mono, fontSize: 8, fill: V.muted }} axisLine={false} tickLine={false} width={120} />
                <Tooltip content={<ChartTip />} cursor={{ fill: 'rgba(34,197,94,0.04)' }} />
                <Bar dataKey="size_mb" name="size (MB)" fill="#22c55e" radius={[0, 3, 3, 0]} maxBarSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      {/* ── Active Sessions ── */}
      <SectionLabel>Active Sessions ({ACTIVE_SESSIONS.length})</SectionLabel>
      <Panel>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: V.mono, fontSize: '11px' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                {['Connection', 'User', 'Host', 'State', 'Time (s)', 'Current Query'].map((h, i) => (
                  <th key={i} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: V.muted, borderBottom: `1px solid ${V.border2}`, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ACTIVE_SESSIONS.map((s, i) => (
                <tr key={i}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.1s', animation: `rowIn ${0.05 + i * 0.05}s ease` }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(34,197,94,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '9px 14px', color: '#60a5fa', whiteSpace: 'nowrap' }}>{s.id}</td>
                  <td style={{ padding: '9px 14px', color: V.text,    whiteSpace: 'nowrap' }}>{s.user}</td>
                  <td style={{ padding: '9px 14px', color: '#94a3b8', whiteSpace: 'nowrap' }}>{s.host}</td>
                  <td style={{ padding: '9px 14px', whiteSpace: 'nowrap' }}><StateBadge state={s.state} /></td>
                  <td style={{ padding: '9px 14px', color: s.time_s > 300 ? V.red : V.green, whiteSpace: 'nowrap' }}>{s.time_s}</td>
                  <td style={{ padding: '9px 14px', color: '#94a3b8', maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '10px' }}>{s.query}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* ── Slow Queries ── */}
      <SectionLabel>Slow Query Log — Top Offenders</SectionLabel>
      <Panel>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: V.mono, fontSize: '11px' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                {['Query (truncated)', 'Avg (ms)', 'Calls', 'Rows Examined'].map((h, i) => (
                  <th key={i} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: V.muted, borderBottom: `1px solid ${V.border2}`, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SLOW_QUERIES.map((q, i) => (
                <tr key={i}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(34,197,94,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '9px 14px', color: '#94a3b8', maxWidth: '380px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '10px' }}>{q.query}</td>
                  <td style={{ padding: '9px 14px', color: q.avg_ms > 800 ? V.red : V.amber, whiteSpace: 'nowrap', fontWeight: 600 }}>{q.avg_ms.toLocaleString()}</td>
                  <td style={{ padding: '9px 14px', color: V.green,   whiteSpace: 'nowrap' }}>{q.calls}</td>
                  <td style={{ padding: '9px 14px', color: '#94a3b8', whiteSpace: 'nowrap' }}>{q.rows_examined.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* ── Recent Audit Activity ── */}
      <SectionLabel>Recent Audit Activity</SectionLabel>
      <Panel style={{ marginBottom: '8px' }}>
        <div style={{ padding: '11px 16px', borderBottom: `1px solid ${V.border2}`, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: V.mono, fontSize: '9px', letterSpacing: '0.1em', color: V.muted, textTransform: 'uppercase' }}>≡ Latest Events</span>
          <span style={{ fontFamily: V.mono, fontSize: '9px', color: V.green }}>88,240 total entries in VentureAuditLog</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: V.mono, fontSize: '11px' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                {['Timestamp', 'User', 'Action', 'Table', 'Rows Affected'].map((h, i) => (
                  <th key={i} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: V.muted, borderBottom: `1px solid ${V.border2}`, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {AUDIT_RECENT.map((a, i) => (
                <tr key={i}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.1s', animation: `rowIn ${0.04 + i * 0.04}s ease` }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(34,197,94,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '9px 14px', color: '#64748b', whiteSpace: 'nowrap', fontSize: '10px' }}>{a.ts}</td>
                  <td style={{ padding: '9px 14px', color: V.text,    whiteSpace: 'nowrap' }}>{a.user}</td>
                  <td style={{ padding: '9px 14px', whiteSpace: 'nowrap' }}><ActionBadge action={a.action} /></td>
                  <td style={{ padding: '9px 14px', color: '#94a3b8', whiteSpace: 'nowrap' }}>{a.table}</td>
                  <td style={{ padding: '9px 14px', color: V.green,   whiteSpace: 'nowrap' }}>{a.rows}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

    </div>
  )
}