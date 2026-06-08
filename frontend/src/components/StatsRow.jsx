function StatsRow({ history }) {
  const totalLinks = history.length
  const activeLinks = history.filter(item => {
    if (!item.expirationDate) return true
    return new Date(item.expirationDate) > new Date()
  }).length
  const expiredLinks = totalLinks - activeLinks

  return (
    <div className="stats-row" id="stats-row">
      <div className="stat-card">
        <div className="stat-icon">⚡</div>
        <div className="stat-value">{totalLinks}</div>
        <div className="stat-label">Total Links</div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">✅</div>
        <div className="stat-value">{activeLinks}</div>
        <div className="stat-label">Active Links</div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">⏳</div>
        <div className="stat-value">{expiredLinks}</div>
        <div className="stat-label">Expired Links</div>
      </div>
    </div>
  )
}

export default StatsRow
