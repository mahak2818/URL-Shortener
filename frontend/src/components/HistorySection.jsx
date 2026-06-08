import { useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'

function HistorySection({ history, onCopy, onClear }) {
  const [copiedId, setCopiedId] = useState(null)

  const handleCopy = (item) => {
    onCopy(item.shortLink)
    setCopiedId(item.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const truncate = (str, max = 50) => {
    if (!str) return ''
    return str.length > max ? str.slice(0, max) + '…' : str
  }

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    const hrs = Math.floor(mins / 60)
    const days = Math.floor(hrs / 24)
    if (days > 0) return `${days}d ago`
    if (hrs > 0) return `${hrs}h ago`
    if (mins > 0) return `${mins}m ago`
    return 'just now'
  }

  return (
    <section className="history-section" id="history-section">
      <div className="section-header">
        <h2 className="section-title">
          🕘 Recent Links
          <span className="section-count">{history.length}</span>
        </h2>
        <button
          className="btn-clear"
          onClick={onClear}
          id="clear-history-btn"
        >
          Clear all
        </button>
      </div>

      <div className="history-list">
        {history.map((item) => (
          <div className="history-item" key={item.id} id={`history-item-${item.id}`}>
            <div className="history-urls">
              <div className="history-short">
                {API_BASE}/{item.shortLink}
              </div>
              <div className="history-original" title={item.originalUrl}>
                {truncate(item.originalUrl)} · {timeAgo(item.createdAt)}
              </div>
            </div>
            <div className="history-actions">
              <button
                className="btn-icon"
                onClick={() => handleCopy(item)}
                title="Copy short link"
                id={`copy-history-${item.id}`}
              >
                {copiedId === item.id ? '✓' : '📋'}
              </button>
              <a
                href={`${API_BASE}/${item.shortLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-icon"
                title="Open link"
              >
                ↗
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default HistorySection
