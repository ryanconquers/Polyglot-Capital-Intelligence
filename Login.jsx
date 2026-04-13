import { useState } from 'react'

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = () => {
    if (username === 'analyst' && password === 'pcis123') {
      setError('')
      onLogin()
    } else {
      setError('Authentication Failed')
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: '#020617',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      fontFamily: 'Inter, Arial'
    }}>

      {/* 🔥 GRADIENT GLOW */}
      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(34,197,94,0.15), transparent)',
        filter: 'blur(120px)',
        top: '-100px',
        left: '-100px'
      }} />

      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(59,130,246,0.15), transparent)',
        filter: 'blur(120px)',
        bottom: '-100px',
        right: '-100px'
      }} />

      {/* 🔥 GRID BACKGROUND */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        opacity: 0.3
      }} />

      {/* 🔥 MAIN CARD */}
      <div style={{
        width: '420px',
        padding: '40px',
        borderRadius: '16px',
        background: 'rgba(15,23,42,0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 30px 100px rgba(0,0,0,0.9)',
        color: 'white',
        position: 'relative',
        zIndex: 1
      }}>

        {/* 🔥 BRAND */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{
            fontSize: '18px',
            letterSpacing: '2px',
            color: '#22c55e'
          }}>
            PCIS TERMINAL
          </h1>

          <h2 style={{
            fontSize: '14px',
            opacity: 0.7,
            marginTop: '5px'
          }}>
            Polyglot Capital Intelligence System
          </h2>
        </div>

        {/* 🔥 INPUTS */}
        <input
          type="text"
          placeholder="Analyst ID"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{
            width: '100%',
            padding: '14px',
            marginBottom: '14px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: '#020617',
            color: 'white',
            outline: 'none'
          }}
        />

        <input
          type="password"
          placeholder="Secure Key"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '14px',
            marginBottom: '20px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: '#020617',
            color: 'white',
            outline: 'none'
          }}
        />

        {/* 🔥 BUTTON */}
        <button
          onClick={handleLogin}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '8px',
            border: 'none',
            background: '#22c55e',
            color: '#020617',
            fontWeight: 'bold',
            letterSpacing: '1px',
            cursor: 'pointer',
            boxShadow: '0 0 15px rgba(34,197,94,0.5)'
          }}
        >
          INITIALIZE SESSION
        </button>

        {/* 🔥 ERROR */}
        {error && (
          <p style={{
            color: '#ef4444',
            marginTop: '15px',
            fontSize: '13px'
          }}>
            {error}
          </p>
        )}

        {/* 🔥 FOOTER */}
        <div style={{
          marginTop: '25px',
          fontSize: '11px',
          opacity: 0.4
        }}>
          Secure Access • Investment Intelligence Terminal
        </div>

      </div>
    </div>
  )
}

export default Login