const ProgressBar = ({ progress = 0, className = "" }) => {
  return (
    <div className={`qb-progress-bar-container qb-bg-grey position-relative overflow-hidden qb-br-24 ${className}`}>
      <div className="h-100 position-absolute qb-bg-secondary" style={{ width: `${progress}%` }}></div>
    </div>
  )
}

export { ProgressBar };
