import { useEffect, useState } from 'react'

function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [text, setText] = useState('Initializing PCIS...')

  useEffect(() => {
    const steps = [
      "Initializing PCIS...",
      "Connecting to capital database...",
      "Loading venture intelligence...",
      "Analyzing deal pipelines...",
      "Securing session...",
      "Launching terminal..."
    ]

    let i = 0

    const interval = setInterval(() => {
      setProgress(prev => {
        const next = Math.min(prev + 8, 100)   // 🔥 FIX 1: ensure it reaches 100

        if (next === 100) {
          clearInterval(interval)
          setTimeout(() => onComplete(), 500)  // 🔥 FIX 2: guaranteed exit
        }

        return next
      })

      if (i < steps.length) {
        setText(steps[i])
        i++
      }

    }, 250)

    return () => clearInterval(interval)
  }, [])

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

      {/* GRID */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        opacity: 0.3
      }} />

      {/* GLOW */}
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(34,197,94,0.2), transparent)',
        filter: 'blur(100px)'
      }} />

      {/* CONTENT */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',        // 🔥 FIX 3: true centering
        justifyContent: 'center',
        zIndex: 1,
        color: 'white',
        width: '100%'
      }}>

        <h1 style={{
          letterSpacing: '2px',
          color: '#22c55e',
          marginBottom: '20px'
        }}>
          PCIS TERMINAL
        </h1>

        <p style={{ opacity: 0.7, marginBottom: '30px' }}>
          {text}
        </p>

        {/* PROGRESS BAR WRAPPER */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',   // 🔥 FIX 4: horizontal center
          width: '100%'
        }}>
          <div style={{
            width: '300px',
            height: '6px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: '#22c55e',
              transition: 'width 0.25s ease'
            }} />
          </div>
        </div>

        {/* DOT LOADER */}
        <div style={{ marginTop: '20px' }}>
          <span className="dot">•</span>
          <span className="dot">•</span>
          <span className="dot">•</span>
        </div>

      </div>

      {/* DOT ANIMATION */}
      <style>{`
        .dot {
          font-size: 24px;
          margin: 0 5px;
          animation: blink 1.4s infinite;
        }

        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes blink {
          0%, 80%, 100% { opacity: 0.2; }
          40% { opacity: 1; }
        }
      `}</style>

    </div>
  )
}

export default LoadingScreen