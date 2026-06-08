import { useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'

function ResultCard({ result, onCopy }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    onCopy(result.data.shortLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Never'
    try {
      return new Date(dateStr).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateStr
    }
  }

  const truncate = (str, max = 55) => {
    if (!str) return ''
    return str.length > max ? str.slice(0, max) + '…' : str
  }

  if (result.type === 'error') {
    return (
      <div className="result-card error" id="result-error" role="alert">
        <div className="result-header">
          <div className="result-icon">❌</div>
          <div>
            <div className="result-title">Something went wrong</div>
            <div className="result-subtitle">Could not shorten the URL</div>
          </div>
        </div>
        <p className="error-message">{result.message}</p>
      </div>
    )
  }

  const { data } = result
  const shortUrl = `${API_BASE}/${data.shortLink}`

  return (
    <div className="result-card success" id="result-success" role="status">
      <div className="result-header">
        <div className="result-icon">✅</div>
        <div>
          <div className="result-title">URL Shortened Successfully!</div>
          <div className="result-subtitle">Your link is ready to share</div>
        </div>
      </div>

      {/* Short link display */}
      <div className="url-display">
        <div className="url-display-label">Your short link</div>
        <div className="url-display-value">
          <span className="short-link-value">{shortUrl}</span>
          <button
            className={`btn-copy ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
            id="copy-short-link-btn"
            title="Copy to clipboard"
          >
            {copied ? '✓ Copied!' : '📋 Copy'}
          </button>
        </div>
      </div>

      {/* Original URL */}
      <div className="url-display" style={{ marginBottom: '16px' }}>
        <div className="url-display-label">Original URL</div>
        <div className="url-display-value">
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)' }}>
            {truncate(data.originalUrl)}
          </span>
        </div>
      </div>

      {/* Meta info */}
      <div className="result-meta">
        <div className="meta-item">
          <span className="meta-icon">🔑</span>
          <span>Code: <strong style={{ color: 'var(--text-primary)' }}>{data.shortLink}</strong></span>
        </div>
        {data.expirationDate && (
          <div className="meta-item">
            <span className="meta-icon">⏳</span>
            <span>Expires: <strong style={{ color: 'var(--text-primary)' }}>{formatDate(data.expirationDate)}</strong></span>
          </div>
        )}
        <div className="meta-item">
          <span className="meta-icon">🌐</span>
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--accent-secondary)', textDecoration: 'none', fontWeight: 500 }}
          >
            Open link ↗
          </a>
        </div>
      </div>
    </div>
  )
}

export default ResultCard
