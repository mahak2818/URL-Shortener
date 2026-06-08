import { useState } from 'react'

function UrlForm({ onSubmit, loading }) {
  const [url, setUrl] = useState('')
  const [expirationDate, setExpirationDate] = useState('')
  const [urlError, setUrlError] = useState('')

  const validateUrl = (value) => {
    if (!value.trim()) return 'Please enter a URL'
    try {
      const u = new URL(value.trim().startsWith('http') ? value.trim() : `https://${value.trim()}`)
      if (!u.hostname.includes('.')) return 'Please enter a valid URL'
      return ''
    } catch {
      return 'Please enter a valid URL (e.g. https://example.com)'
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const err = validateUrl(url)
    if (err) {
      setUrlError(err)
      return
    }
    setUrlError('')
    const normalizedUrl = url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`
    onSubmit({ url: normalizedUrl, expirationDate })
  }

  const handleUrlChange = (e) => {
    setUrl(e.target.value)
    if (urlError) setUrlError('')
  }

  // Minimum date: today
  const today = new Date().toISOString().slice(0, 16)

  return (
    <form className="url-form" onSubmit={handleSubmit} id="url-shortener-form">
      {/* URL Input */}
      <div className="input-group">
        <label className="input-label" htmlFor="url-input">Long URL</label>
        <div className="input-wrapper">
          <span className="input-icon">🔗</span>
          <input
            id="url-input"
            type="text"
            className="url-input"
            placeholder="https://your-very-long-url.com/with/many/parts"
            value={url}
            onChange={handleUrlChange}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        {urlError && (
          <span style={{ fontSize: '12px', color: 'var(--error)', marginTop: '-4px' }}>
            ⚠️ {urlError}
          </span>
        )}
      </div>

      {/* Expiration Date */}
      <div className="form-row">
        <div className="input-group">
          <label className="input-label" htmlFor="expiry-input">
            Expiration Date <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(default: 5 min)</span>
          </label>
          <div className="input-wrapper">
            <span className="input-icon">📅</span>
            <input
              id="expiry-input"
              type="datetime-local"
              className="date-input"
              value={expirationDate}
              onChange={e => setExpirationDate(e.target.value)}
              min={today}
            />
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '-4px' }}>
            Leave blank to auto-expire in 5 minutes
          </span>
        </div>

        <div className="input-group" style={{ justifyContent: 'flex-end' }}>
          <label className="input-label">&nbsp;</label>
          <button
            type="submit"
            className="btn-shorten"
            disabled={loading}
            id="shorten-btn"
          >
            {loading ? (
              <>
                <div className="spinner" />
                Shortening...
              </>
            ) : (
              <>
                ⚡ Shorten URL
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}

export default UrlForm
