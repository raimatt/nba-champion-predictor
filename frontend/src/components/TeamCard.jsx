export default function TeamCard({ team, status, loading = false }) {
  // status: 'active' | 'eliminated' | 'champion'
  const logoUrl = team
    ? `https://cdn.nba.com/logos/nba/${team.team_id}/primary/L/logo.svg`
    : null

  if (loading || !team) {
    return (
      <div className="flex flex-col items-center p-2 rounded-xl border border-gray-800 bg-gray-900 animate-pulse">
        <div className="w-12 h-12 rounded-full bg-gray-800 mb-2" />
        <div className="h-2 w-14 bg-gray-800 rounded" />
      </div>
    )
  }

  return (
    <div
      className={[
        'relative flex flex-col items-center p-2 rounded-xl border transition-all duration-700',
        status === 'champion'
          ? 'border-yellow-400 bg-yellow-950/30 animate-championGlow scale-105'
          : status === 'eliminated'
          ? 'border-red-900/40 bg-gray-900/30 opacity-30 grayscale'
          : 'border-gray-800 bg-gray-900 hover:border-gray-700',
      ].join(' ')}
    >
      {status === 'eliminated' && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <span className="text-red-500 text-2xl font-black opacity-80">✕</span>
        </div>
      )}

      <img
        src={logoUrl}
        alt={team.team_name}
        className="w-12 h-12 object-contain"
        onError={e => { e.currentTarget.style.opacity = '0.2' }}
      />
      <p className="text-center text-gray-300 text-xs mt-1 leading-tight line-clamp-2 w-full px-1">
        {team.team_name}
      </p>
      {status === 'champion' && (
        <span className="text-yellow-400 text-xs font-bold mt-0.5">Champion</span>
      )}
    </div>
  )
}
