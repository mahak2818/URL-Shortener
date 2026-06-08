function Toast({ message, type }) {
  return (
    <div className={`toast ${type}`} role="alert">
      <span>{type === 'success' ? '✅' : '❌'}</span>
      <span>{message}</span>
    </div>
  )
}

export default Toast
