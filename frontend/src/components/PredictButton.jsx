const LABELS = {
  idle: 'Generate Prediction',
  loading: 'Fetching NBA Data...',
  animating: 'Running Formula...',
  done: 'Regenerate',
  error: 'Try Again',
}

export default function PredictButton({ status, onClick, disabled }) {
  const label = LABELS[status] ?? 'Generate Prediction'
  const isSpinning = status === 'loading' || status === 'animating'

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        'relative px-10 py-3 rounded-full font-bold text-lg transition-all duration-300 select-none',
        disabled
          ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
          : 'bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-lg shadow-orange-500/30',
        !disabled && 'hover:from-orange-400 hover:to-amber-300 hover:scale-105 hover:shadow-orange-400/40 active:scale-95',
      ].join(' ')}
    >
      {isSpinning && (
        <span className="inline-block mr-2 animate-spin leading-none">⟳</span>
      )}
      {label}
    </button>
  )
}
