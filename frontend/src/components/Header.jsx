import { REQUIREMENTS } from '../constants'

export default function Header() {
  return (
    <header className="text-center mb-10">
      {/* NBA League Logo */}
      <div className="flex justify-center mb-4">
        <img
          src="https://cdn.nba.com/logos/leagues/logo-nba.svg"
          alt="NBA"
          className="h-16 w-auto object-contain"
          onError={e => { e.currentTarget.style.display = 'none' }}
        />
      </div>

      <div className="inline-block mb-2">
        <span className="text-xs uppercase tracking-widest text-orange-400 font-semibold">
          2025–2026 Season
        </span>
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
        <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-400 bg-clip-text text-transparent">
          Raiden's Formula
        </span>
      </h1>
      <h2 className="text-xl text-gray-300 font-medium mb-8">
        for the NBA Champion
      </h2>

      {/* Requirements breakdown */}
      <div className="max-w-2xl mx-auto bg-gray-900 border border-gray-800 rounded-2xl p-6 text-left">
        <p className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
          The Formula — 5 Requirements
        </p>
        <ol className="space-y-4">
          {REQUIREMENTS.map((req, i) => {
            const pct = Math.round((req.wins / req.total) * 100)
            return (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-gray-400 text-sm leading-relaxed">{req.description}</span>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="text-xs font-semibold text-green-400">
                      {req.wins}/{req.total} champions
                    </span>
                    <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden max-w-[120px]">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{pct}%</span>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
        <p className="mt-5 text-xs text-gray-600 border-t border-gray-800 pt-3">
          Each requirement eliminates non-qualifying teams. One team survives all 5 — the predicted champion.
        </p>
      </div>
    </header>
  )
}
