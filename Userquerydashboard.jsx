import { useState } from 'react'

/* Maps every sidebar endpoint to its input parameters.
   Only real endpoints that exist in your MySQL backend. */
const QUERY_META = {
  'total-investment':    { label: 'Total Investment',    inputs: [{ key: 'venture_id', placeholder: 'Venture ID (optional)', type: 'number' }] },
  'investment-count':    { label: 'Investment Count',    inputs: [{ key: 'venture_id', placeholder: 'Venture ID (optional)', type: 'number' }] },
  'avg-investment':      { label: 'Average Investment',  inputs: [{ key: 'sector', placeholder: 'Sector (optional)', type: 'text' }] },
  'nav':                 { label: 'NAV',                 inputs: [{ key: 'as_of_date', placeholder: 'Date YYYY-MM-DD (optional)', type: 'text' }] },
  'proceeds':            { label: 'Proceeds',            inputs: [{ key: 'venture_id', placeholder: 'Venture ID (optional)', type: 'number' }] },
  'net-position':        { label: 'Net Position',        inputs: [{ key: 'venture_id', placeholder: 'Venture ID (optional)', type: 'number' }] },
  'lp-commitment':       { label: 'LP Commitment',       inputs: [{ key: 'lp_id', placeholder: 'LP ID (optional)', type: 'number' }] },
  'lp-called':           { label: 'LP Called',           inputs: [{ key: 'lp_id', placeholder: 'LP ID (optional)', type: 'number' }] },
  'lp-venture':          { label: 'LP Venture',          inputs: [{ key: 'lp_id', placeholder: 'LP ID (optional)', type: 'number' }] },
  'venture-commitment':  { label: 'Venture Commitment',  inputs: [{ key: 'venture_id', placeholder: 'Venture ID (optional)', type: 'number' }] },
  'lp-returns':          { label: 'LP Returns',          inputs: [{ key: 'lp_id', placeholder: 'LP ID (optional)', type: 'number' }] },
  'deal-stage':          { label: 'Deal Stage',          inputs: [{ key: 'stage', placeholder: 'e.g. seed / series-a (optional)', type: 'text' }] },
  'deal-outcome':        { label: 'Deal Outcome',        inputs: [{ key: 'outcome', placeholder: 'e.g. exit / active (optional)', type: 'text' }] },
  'deal-score':          { label: 'Deal Score',          inputs: [{ key: 'min_score', placeholder: 'Min score 0-100 (optional)', type: 'number' }] },
  'deal-source':         { label: 'Deal Source',         inputs: [{ key: 'source', placeholder: 'Source type (optional)', type: 'text' }] },
  'company-stage':       { label: 'Company Stage',       inputs: [{ key: 'stage', placeholder: 'Stage (optional)', type: 'text' }] },
  'partner-deals':       { label: 'Partner Deals',       inputs: [{ key: 'partner_id', placeholder: 'Partner ID (optional)', type: 'number' }] },
  'partner-investments': { label: 'Partner Investments', inputs: [{ key: 'partner_id', placeholder: 'Partner ID (optional)', type: 'number' }] },
  'partner-score':       { label: 'Partner Score',       inputs: [{ key: 'min_score', placeholder: 'Min score (optional)', type: 'number' }] },
  'partner-title':       { label: 'Partner Title',       inputs: [{ key: 'title', placeholder: 'Title e.g. VP (optional)', type: 'text' }] },
  'partner-capital':     { label: 'Partner Capital',     inputs: [{ key: 'partner_id', placeholder: 'Partner ID (optional)', type: 'number' }] },
  'company-investment':  { label: 'Company Investment',  inputs: [{ key: 'company_id', placeholder: 'Company ID (optional)', type: 'number' }] },
  'ownership':           { label: 'Ownership',           inputs: [{ key: 'company_id', placeholder: 'Company ID (optional)', type: 'number' }] },
  'rounds':              { label: 'Rounds',              inputs: [{ key: 'company_id', placeholder: 'Company ID (optional)', type: 'number' }] },
  'venture-company':     { label: 'Venture Company',     inputs: [{ key: 'venture_id', placeholder: 'Venture ID (optional)', type: 'number' }] },
  'avg-ownership':       { label: 'Avg Ownership',       inputs: [{ key: 'sector', placeholder: 'Sector (optional)', type: 'text' }] },
  'exit-distribution':   { label: 'Exit Distribution',   inputs: [{ key: 'exit_type', placeholder: 'Exit type e.g. IPO (optional)', type: 'text' }] },
  'exit-company':        { label: 'Exit Company',        inputs: [{ key: 'company_id', placeholder: 'Company ID (optional)', type: 'number' }] },
  'total-exit':          { label: 'Total Exit',          inputs: [{ key: 'venture_id', placeholder: 'Venture ID (optional)', type: 'number' }] },
  'exit-timeline':       { label: 'Exit Timeline',       inputs: [{ key: 'year_from', placeholder: 'From year e.g. 2018', type: 'number' }, { key: 'year_to', placeholder: 'To year e.g. 2024', type: 'number' }] },
  'valuation-single':    { label: 'Valuation Single',    inputs: [{ key: 'company_id', placeholder: 'Company ID (optional)', type: 'number' }] },
  'valuation-max':       { label: 'Valuation Max',       inputs: [{ key: 'sector', placeholder: 'Sector (optional)', type: 'text' }] },
  'valuation-avg':       { label: 'Valuation Avg',       inputs: [{ key: 'sector', placeholder: 'Sector (optional)', type: 'text' }] },
  'valuation-lag':       { label: 'Valuation Lag',       inputs: [{ key: 'company_id', placeholder: 'Company ID (optional)', type: 'number' }] },
  'benchmark':           { label: 'Benchmark',           inputs: [{ key: 'index', placeholder: 'Index e.g. NIFTY50 (optional)', type: 'text' }] },
  'benchmark-range':     { label: 'Benchmark Range',     inputs: [{ key: 'index', placeholder: 'Index name (optional)', type: 'text' }, { key: 'days', placeholder: 'Days lookback (optional)', type: 'number' }] },
  'benchmark-change':    { label: 'Benchmark Change',    inputs: [{ key: 'index', placeholder: 'Index name (optional)', type: 'text' }] },
  'fx-rate':             { label: 'FX Rate',             inputs: [{ key: 'pair', placeholder: 'Pair e.g. USD/INR (optional)', type: 'text' }] },
  'fx-avg':              { label: 'FX Avg',              inputs: [{ key: 'pair', placeholder: 'Pair e.g. USD/INR (optional)', type: 'text' }, { key: 'days', placeholder: 'Days lookback (optional)', type: 'number' }] },
  'audit':               { label: 'Audit Log',           inputs: [{ key: 'user_id', placeholder: 'User ID (optional)', type: 'number' }, { key: 'action', placeholder: 'Action type (optional)', type: 'text' }] },
}

const CATEGORIES = {
  'Venture Analytics':    ['total-investment','investment-count','avg-investment','nav','proceeds','net-position'],
  'LP Analytics':         ['lp-commitment','lp-called','lp-venture','venture-commitment','lp-returns'],
  'Deal Analytics':       ['deal-stage','deal-outcome','deal-score','deal-source','company-stage'],
  'Partner Analytics':    ['partner-deals','partner-investments','partner-score','partner-title','partner-capital'],
  'Investment Analytics': ['company-investment','ownership','rounds','venture-company','avg-ownership'],
  'Exit Analytics':       ['exit-distribution','exit-company','total-exit','exit-timeline'],
  'Valuation Analytics':  ['valuation-single','valuation-max','valuation-avg','valuation-lag'],
  'Market Analytics':     ['benchmark','benchmark-range','benchmark-change','fx-rate','fx-avg'],
  'System':               ['audit'],
}

const V = {
  bg: '#04080f', surface: '#080f1c', panel: '#0a1220',
  border: 'rgba(34,197,94,0.15)', border2: 'rgba(255,255,255,0.06)',
  green: '#22c55e', greenDim: 'rgba(34,197,94,0.12)',
  text: '#e2e8f0', muted: '#64748b',
  mono: "'IBM Plex Mono', monospace", sans: "'Space Grotesk', sans-serif",
}

function QueryCard({ endpoint, meta, onRun }) {
  const [params, setParams] = useState({})
  const [open, setOpen] = useState(false)
  const set = (key, val) => setParams(p => ({ ...p, [key]: val }))

  return (
    <div
      style={{
        background: V.panel, border: `1px solid ${V.border2}`,
        borderRadius: '6px', overflow: 'hidden', transition: 'border-color 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(34,197,94,0.3)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = V.border2}
    >
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          padding: '11px 14px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontFamily: V.mono, fontSize: '11px', color: V.text }}>{meta.label}</span>
          <span style={{ fontFamily: V.mono, fontSize: '9px', color: V.muted }}>
            {meta.inputs.length} param{meta.inputs.length !== 1 ? 's' : ''}
          </span>
        </div>
        <span style={{
          fontFamily: V.mono, fontSize: '10px', color: V.muted,
          display: 'inline-block', transition: 'transform 0.15s',
          transform: open ? 'rotate(180deg)' : 'none',
        }}>▾</span>
      </div>

      {open && (
        <div style={{ padding: '0 14px 14px', borderTop: `1px solid ${V.border2}` }}>
          <div style={{ fontFamily: V.mono, fontSize: '9px', letterSpacing: '0.1em', color: V.muted, margin: '10px 0 8px' }}>
            QUERY PARAMETERS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '12px' }}>
            {meta.inputs.map((inp, i) => (
              <div key={i}>
                <label style={{ display: 'block', fontFamily: V.mono, fontSize: '8px', letterSpacing: '0.1em', color: V.muted, marginBottom: '3px', textTransform: 'uppercase' }}>
                  {inp.key}
                </label>
                <input
                  type={inp.type}
                  placeholder={inp.placeholder}
                  value={params[inp.key] || ''}
                  onChange={e => set(inp.key, e.target.value)}
                  style={{
                    width: '100%', background: V.surface,
                    border: `1px solid ${V.border}`, borderRadius: '3px',
                    padding: '7px 11px', fontFamily: V.mono,
                    fontSize: '11px', color: V.text, outline: 'none',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(34,197,94,0.45)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(34,197,94,0.15)'}
                />
              </div>
            ))}
          </div>
          <button
            onClick={() => onRun(endpoint, params)}
            style={{
              padding: '7px 16px', background: V.green, border: 'none',
              borderRadius: '3px', fontFamily: V.mono, fontSize: '10px',
              fontWeight: 600, letterSpacing: '0.1em', color: '#04080f', cursor: 'pointer',
            }}
          >
            RUN QUERY →
          </button>
        </div>
      )}
    </div>
  )
}

export default function UserQueryDashboard({ onRunQuery }) {
  const [search, setSearch] = useState('')

  const handleRun = (endpoint, params) => {
    const meta = QUERY_META[endpoint]
    if (!meta) return
    onRunQuery({ name: meta.label, endpoint, chart: null }, params)
  }

  const filterEndpoints = (endpoints) =>
    endpoints.filter(ep => {
      const m = QUERY_META[ep]
      if (!m) return false
      if (!search) return true
      return m.label.toLowerCase().includes(search.toLowerCase()) || ep.includes(search.toLowerCase())
    })

  return (
    <div style={{ animation: 'fadeUp 0.3s ease' }}>

      {/* header */}
      <div style={{
        marginBottom: '24px', paddingBottom: '16px',
        borderBottom: `1px solid ${V.border2}`,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
      }}>
        <div>
          <div style={{ fontFamily: V.mono, fontSize: '10px', color: V.muted, letterSpacing: '0.12em', marginBottom: '4px' }}>
            USER WORKSPACE / QUERY BUILDER
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 600, color: V.text, letterSpacing: '-0.02em', fontFamily: V.sans }}>
            Select &amp; Configure a Query
          </h1>
        </div>
        <input
          type="text" placeholder="Search queries…" value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            background: V.panel, border: `1px solid ${V.border}`, borderRadius: '4px',
            padding: '8px 14px', fontFamily: V.mono, fontSize: '11px', color: V.text, width: '220px', outline: 'none',
          }}
          onFocus={e => e.target.style.borderColor = 'rgba(34,197,94,0.45)'}
          onBlur={e => e.target.style.borderColor = 'rgba(34,197,94,0.15)'}
        />
      </div>

      <div style={{ fontFamily: V.mono, fontSize: '9px', color: V.muted, marginBottom: '20px', letterSpacing: '0.06em' }}>
        Click any card to expand its parameters, then hit RUN QUERY to execute.
      </div>

      {/* category sections */}
      {Object.entries(CATEGORIES).map(([cat, endpoints], ci) => {
        const visible = filterEndpoints(endpoints)
        if (visible.length === 0) return null
        return (
          <div key={ci} style={{ marginBottom: '26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontFamily: V.mono, fontSize: '9px', fontWeight: 600, letterSpacing: '0.16em', color: V.muted, textTransform: 'uppercase' }}>
                {cat}
              </span>
              <div style={{ flex: 1, height: '1px', background: V.border2 }} />
              <span style={{ fontFamily: V.mono, fontSize: '9px', color: V.muted }}>{visible.length}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '7px' }}>
              {visible.map(ep => (
                <QueryCard key={ep} endpoint={ep} meta={QUERY_META[ep]} onRun={handleRun} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}