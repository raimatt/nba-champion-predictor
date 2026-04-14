import StatsTable from './StatsTable'

export default function StepCard({ step }) {
  const { requirement, label, remaining, eliminated, stats } = step

  return (
    <div className="animate-fadeUp bg-gray-900 border border-gray-800 rounded-2xl p-5">
      {/* Header row */}
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-orange-500/20">
          {requirement}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-base leading-snug">{label}</h3>

          {/* Surviving vs eliminated pill lists */}
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-green-400 uppercase tracking-wider font-semibold mb-2">
                Remaining ({remaining.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {remaining.map(t => (
                  <span
                    key={t.team_id}
                    className="px-2 py-0.5 bg-green-900/30 border border-green-800 rounded-full text-xs text-green-300"
                  >
                    {t.team_name}
                  </span>
                ))}
                {remaining.length === 0 && (
                  <span className="text-xs text-gray-600 italic">None — loosen a criterion</span>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs text-red-400 uppercase tracking-wider font-semibold mb-2">
                Eliminated ({eliminated.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {eliminated.map(t => (
                  <span
                    key={t.team_id}
                    className="px-2 py-0.5 bg-red-950/40 border border-red-900 rounded-full text-xs text-red-400 line-through opacity-70"
                  >
                    {t.team_name}
                  </span>
                ))}
                {eliminated.length === 0 && (
                  <span className="text-xs text-gray-600 italic">None eliminated</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats table */}
      <StatsTable requirement={requirement} stats={stats} />
    </div>
  )
}
