import { useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const LOGIN_CSS = `
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse-border { 0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,0.35)} 50%{box-shadow:0 0 16px 2px rgba(34,197,94,0.35)} }
  @keyframes spin { to{transform:rotate(360deg)} }
`

function injectLoginStyles() {
  if (document.getElementById('pcis-login-styles')) return
  const s = document.createElement('style')
  s.id = 'pcis-login-styles'
  s.textContent = LOGIN_CSS
  document.head.appendChild(s)
}

export default function LoginScreen() {
  const { login } = useAuth()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [hint, setHint]         = useState(false)

  useEffect(() => { injectLoginStyles() }, [])

  const handleLogin = () => {
    if (!email || !password) { setError('CREDENTIALS REQUIRED'); return }
    setLoading(true)
    setError('')
    setTimeout(() => {
      const ok = login(email, password)
      setLoading(false)
      if (!ok) setError('ACCESS DENIED — INVALID CREDENTIALS')
    }, 600)
  }

  const onKey = (e) => { if (e.key === 'Enter') handleLogin() }

  const vars = {
    bg:       '#04080f',
    surface:  '#080f1c',
    panel:    '#0a1220',
    border:   'rgba(34,197,94,0.15)',
    border2:  'rgba(255,255,255,0.06)',
    green:    '#22c55e',
    greenDim: 'rgba(34,197,94,0.12)',
    amber:    '#f59e0b',
    red:      '#ef4444',
    text:     '#e2e8f0',
    muted:    '#64748b',
    mono:     "'IBM Plex Mono', monospace",
    sans:     "'Space Grotesk', sans-serif",
  }

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: vars.bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: vars.mono,
      position: 'relative', overflow: 'hidden',
    }}>

      {/* scanlines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.08) 2px,rgba(0,0,0,0.08) 4px)',
      }} />

      {/* top strip */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '28px',
        background: vars.surface, borderBottom: `1px solid ${vars.border}`,
        display: 'flex', alignItems: 'center', padding: '0 20px',
        justifyContent: 'space-between',
        fontSize: '9px', letterSpacing: '0.1em', color: vars.muted, zIndex: 2,
      }}>
        <span style={{ color: vars.green }}>⬤ PCIS SECURE GATEWAY</span>
        <span>AUTHENTICATION REQUIRED</span>
        <span style={{ color: vars.green }}>v2.0</span>
      </div>

      {/* card */}
      <div style={{
        position: 'relative', zIndex: 1,
        width: '420px',
        background: vars.surface,
        border: `1px solid ${vars.border}`,
        borderRadius: '8px', overflow: 'hidden',
        boxShadow: '0 0 60px rgba(34,197,94,0.06), 0 24px 48px rgba(0,0,0,0.5)',
        animation: 'fadeUp 0.4s ease',
      }}>

        {/* card header */}
        <div style={{
          padding: '24px 28px 20px',
          borderBottom: `1px solid ${vars.border}`,
          display: 'flex', alignItems: 'center', gap: '14px',
        }}>
          <div style={{
            width: '36px', height: '36px',
            border: `1.5px solid ${vars.green}`,
            borderRadius: '5px', display: 'grid', placeItems: 'center',
            animation: 'pulse-border 3s infinite', flexShrink: 0,
          }}>
            <span style={{ color: vars.green, fontSize: '16px', fontWeight: 700 }}>W</span>
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.04em', color: vars.text, fontFamily: vars.sans }}>
              PCIS Terminal
            </div>
            <div style={{ fontSize: '9px', color: vars.muted, letterSpacing: '0.1em', marginTop: '2px' }}>
              POLYGLOT CAPITAL INTELLIGENCE SYSTEM
            </div>
          </div>
        </div>

        {/* form */}
        <div style={{ padding: '28px' }}>

          <div style={{ fontSize: '9px', letterSpacing: '0.14em', color: vars.muted, marginBottom: '20px' }}>
            AUTHENTICATE TO CONTINUE
            <span style={{ display: 'inline-block', width: '7px', height: '12px', background: vars.green, marginLeft: '4px', verticalAlign: 'middle', animation: 'blink 1s steps(1) infinite' }} />
          </div>

          {/* email */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '9px', letterSpacing: '0.12em', color: vars.muted, marginBottom: '6px' }}>
              USER IDENTIFIER
            </label>
            <input
              type="text" value={email}
              onChange={e => setEmail(e.target.value)} onKeyDown={onKey}
              placeholder="user@wertkern.com"
              style={{
                width: '100%', background: vars.panel,
                border: `1px solid ${vars.border}`, borderRadius: '4px',
                padding: '10px 14px', fontFamily: vars.mono,
                fontSize: '12px', color: vars.text, outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(34,197,94,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(34,197,94,0.15)'}
            />
          </div>

          {/* password */}
          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'block', fontSize: '9px', letterSpacing: '0.12em', color: vars.muted, marginBottom: '6px' }}>
              ACCESS KEY
            </label>
            <input
              type="password" value={password}
              onChange={e => setPassword(e.target.value)} onKeyDown={onKey}
              placeholder="••••••••"
              style={{
                width: '100%', background: vars.panel,
                border: `1px solid ${vars.border}`, borderRadius: '4px',
                padding: '10px 14px', fontFamily: vars.mono,
                fontSize: '12px', color: vars.text, outline: 'none', letterSpacing: '0.1em',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(34,197,94,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(34,197,94,0.15)'}
            />
          </div>

          {error && (
            <div style={{
              marginBottom: '16px', padding: '9px 14px',
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: '4px', fontSize: '10px', letterSpacing: '0.08em', color: vars.red,
            }}>
              ⚠ {error}
            </div>
          )}

          <button
            onClick={handleLogin} disabled={loading}
            style={{
              width: '100%', padding: '11px',
              background: loading ? vars.greenDim : vars.green,
              border: 'none', borderRadius: '4px',
              fontFamily: vars.mono, fontSize: '11px', fontWeight: 600,
              letterSpacing: '0.12em',
              color: loading ? vars.green : '#04080f',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            {loading
              ? <><span style={{ display:'inline-block', width:'10px', height:'10px', border:`1.5px solid ${vars.green}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />VERIFYING</>
              : 'AUTHENTICATE →'
            }
          </button>

          <div onClick={() => setHint(h => !h)} style={{
            marginTop: '18px', textAlign: 'center',
            fontSize: '9px', letterSpacing: '0.1em', color: vars.muted,
            cursor: 'pointer', userSelect: 'none',
          }}>
            {hint ? '▲ HIDE DEMO CREDENTIALS' : '▼ SHOW DEMO CREDENTIALS'}
          </div>

          {hint && (
            <div style={{
              marginTop: '12px', padding: '12px 14px',
              background: vars.panel, border: `1px solid ${vars.border2}`,
              borderRadius: '4px', fontSize: '10px', lineHeight: '1.8', color: vars.muted,
              animation: 'fadeUp 0.2s ease',
            }}>
              <div><span style={{ color: vars.amber }}>USER</span> → user@wertkern.com / user123</div>
              <div><span style={{ color: vars.green }}>DBA</span>&nbsp; → dba@wertkern.com / dba456</div>
            </div>
          )}
        </div>
      </div>

      {/* bottom strip */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '28px',
        background: vars.surface, borderTop: `1px solid ${vars.border}`,
        display: 'flex', alignItems: 'center', padding: '0 20px',
        justifyContent: 'space-between',
        fontSize: '9px', letterSpacing: '0.1em', color: vars.muted, zIndex: 2,
      }}>
        <span>MySQL · MongoDB · Neo4j · Redis</span>
        <span style={{ color: vars.green }}>WERTKERN CAPITAL</span>
      </div>
    </div>
  )
}