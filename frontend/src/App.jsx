import { useState, useCallback } from 'react'
import UrlForm from './components/UrlForm'
import ResultCard from './components/ResultCard'
import Toast from './components/Toast'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'

function App() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  const handleShorten = async ({ url, expirationDate }) => {
    setLoading(true)
    setResult(null)
    try {
      const payload = { url }
      if (expirationDate) payload.expirationDate = expirationDate

      const response = await fetch(`${API_BASE}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.error) {
        setResult({ type: 'error', message: data.error })
      } else {
        setResult({
          type: 'success',
          data: {
            originalUrl: data.originalUrl,
            shortLink: data.shortLink,
            expirationDate: data.expirationDate,
          },
        })
      }
    } catch (err) {
      setResult({
        type: 'error',
        message: 'Could not reach the server. Make sure the backend is running on port 8081.',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = useCallback((text) => {
    navigator.clipboard.writeText(`${API_BASE}/${text}`).then(() => {
      addToast('Copied to clipboard!', 'success')
    }).catch(() => {
      addToast('Failed to copy', 'error')
    })
  }, [addToast])

  return (
    <div className="app">
      {/* Animated background */}
      <div className="bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>
      <div className="bg-grid" />

      {/* Navbar */}
      <nav className="navbar">
        <a href="/" className="nav-logo">
          <div className="logo-icon">⚡</div>
          <span className="logo-text">ClipLink</span>
        </a>
        <span className="nav-badge">Free forever</span>
      </nav>

      {/* Main content */}
      <main className="main">
        {/* Hero */}
        <div className="hero">
          <div className="hero-eyebrow">Powered by Spring Boot</div>
          <h1 className="hero-title">
            Shorten URLs,<br />
            <span className="gradient-text">Share instantly</span>
          </h1>
          <p className="hero-subtitle">
            Transform long, unwieldy links into short, shareable URLs in seconds.
            Fast, reliable, and completely free.
          </p>
        </div>

        {/* Shortener form */}
        <div className="shorten-card" id="shorten-form">
          <div className="card-title">Shorten a URL</div>
          <UrlForm onSubmit={handleShorten} loading={loading} />
        </div>

        {/* Result */}
        {result && (
          <ResultCard result={result} onCopy={handleCopy} />
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>Built with ❤️ using React + Spring Boot &nbsp;·&nbsp; <a href="#shorten-form">Get started</a></p>
      </footer>

      {/* Toast notifications */}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </div>
  )
}

export default App
