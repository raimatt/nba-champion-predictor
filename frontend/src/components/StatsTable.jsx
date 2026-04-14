/**
 * Renders the stats table for each requirement step.
 * Each requirement has a different stats shape, handled here.
 */

const fmt = (val) => Number(val).toFixed(1)
const fmtPct = (val) => (Number(val) * 100).toFixed(1) + '%'

export default function StatsTable({ requirement, stats }) {
  if (!stats?.length) return null

  if (requirement === 1) {
    const ppgPlayers = stats.filter(s => s.type === 'PPG')
    const rpgPlayers = stats.filter(s => s.type === 'RPG')
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <StatBlock title="Top 10 PPG Leaders">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[180px]">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-gray-800">
                  <th className="text-left py-1">Player</th>
                  <th className="text-right py-1">PPG</th>
                </tr>
              </thead>
              <tbody>
                {ppgPlayers.map((p, i) => (
                  <tr key={i} className="border-b border-gray-800/50">
                    <td className="py-1 text-gray-300">{p.player_name}</td>
                    <td className="py-1 text-right text-orange-400 font-mono">{fmt(p.ppg)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </StatBlock>
        <StatBlock title="Top 10 RPG Leaders">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[180px]">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-gray-800">
                  <th className="text-left py-1">Player</th>
                  <th className="text-right py-1">RPG</th>
                </tr>
              </thead>
              <tbody>
                {rpgPlayers.map((p, i) => (
                  <tr key={i} className="border-b border-gray-800/50">
                    <td className="py-1 text-gray-300">{p.player_name}</td>
                    <td className="py-1 text-right text-blue-400 font-mono">{fmt(p.rpg)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </StatBlock>
      </div>
    )
  }

  if (requirement === 2) {
    return (
      <StatBlock title="Top 10 MVP Candidates" className="mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[280px]">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-800">
                <th className="text-left py-1">Player</th>
                <th className="text-right py-1">PPG</th>
                <th className="text-right py-1">RPG</th>
                <th className="text-right py-1">APG</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((p, i) => (
                <tr
                  key={i}
                  className={[
                    'border-b border-gray-800/50 transition-opacity',
                    p.on_remaining_team ? '' : 'opacity-30',
                  ].join(' ')}
                >
                  <td className="py-1 text-gray-300">
                    <span>{p.player_name}</span>
                    {!p.on_remaining_team && (
                      <span className="text-red-500 text-xs ml-1.5">(elim.)</span>
                    )}
                  </td>
                  <td className="py-1 text-right text-orange-400 font-mono">{fmt(p.ppg)}</td>
                  <td className="py-1 text-right text-blue-400 font-mono">{fmt(p.rpg)}</td>
                  <td className="py-1 text-right text-green-400 font-mono">{fmt(p.apg)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </StatBlock>
    )
  }

  if (requirement === 3) {
    return (
      <StatBlock title="3-Point % Rankings (among remaining teams)" className="mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[220px]">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-800">
                <th className="text-left py-1">#</th>
                <th className="text-left py-1">Team</th>
                <th className="text-right py-1">3PT%</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((t, i) => (
                <tr
                  key={i}
                  className={[
                    'border-b border-gray-800/50',
                    t.qualifies ? '' : 'opacity-30',
                  ].join(' ')}
                >
                  <td className="py-1 text-gray-600 font-mono text-xs">{t.rank}</td>
                  <td className="py-1 text-gray-300">{t.team_name}</td>
                  <td className="py-1 text-right text-orange-400 font-mono">{fmtPct(t.fg3_pct)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </StatBlock>
    )
  }

  if (requirement === 4) {
    return (
      <StatBlock title="Defensive Rating Rankings (lower = better)" className="mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[220px]">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-800">
                <th className="text-left py-1">#</th>
                <th className="text-left py-1">Team</th>
                <th className="text-right py-1">Def Rtg</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((t, i) => (
                <tr
                  key={i}
                  className={[
                    'border-b border-gray-800/50',
                    t.qualifies ? '' : 'opacity-30',
                  ].join(' ')}
                >
                  <td className="py-1 text-gray-600 font-mono text-xs">{t.rank}</td>
                  <td className="py-1 text-gray-300">{t.team_name}</td>
                  <td className="py-1 text-right text-orange-400 font-mono">{fmt(t.def_rating)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </StatBlock>
    )
  }

  if (requirement === 5) {
    return (
      <StatBlock title="Field Goal % Rankings" className="mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[220px]">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-800">
                <th className="text-left py-1">#</th>
                <th className="text-left py-1">Team</th>
                <th className="text-right py-1">FG%</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((t, i) => (
                <tr
                  key={i}
                  className={[
                    'border-b border-gray-800/50',
                    t.qualifies ? 'text-yellow-400' : 'opacity-30',
                  ].join(' ')}
                >
                  <td className="py-1 font-mono text-xs">{t.rank}</td>
                  <td className="py-1">{t.team_name}</td>
                  <td className="py-1 text-right font-mono">{fmtPct(t.fg_pct)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </StatBlock>
    )
  }

  return null
}

function StatBlock({ title, children, className = '' }) {
  return (
    <div className={`bg-gray-950/60 rounded-xl border border-gray-800 p-4 ${className}`}>
      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">{title}</p>
      {children}
    </div>
  )
}
