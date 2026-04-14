import TeamCard from './TeamCard'

export default function TeamGrid({ teams, eliminatedIds, champion, loading }) {
  // Show 20 skeleton cards while loading
  const cards = loading
    ? Array.from({ length: 20 }, (_, i) => ({ team_id: i, team_name: '' }))
    : teams

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs uppercase tracking-widest text-gray-500 font-semibold">
          Playoff &amp; Play-In Teams
        </h3>
        {!loading && (
          <span className="text-xs text-gray-600">{teams.length} teams</span>
        )}
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
        {cards.map((team, i) => {
          const status = champion?.team_id === team.team_id
            ? 'champion'
            : eliminatedIds.has(team.team_id)
            ? 'eliminated'
            : 'active'

          return (
            <TeamCard
              key={loading ? i : team.team_id}
              team={loading ? null : team}
              status={status}
              loading={loading}
            />
          )
        })}
      </div>

      {!loading && teams.length > 0 && (
        <div className="flex gap-4 mt-3 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-gray-700 inline-block" /> West: {teams.filter(t => t.conference === 'West').length} teams
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-gray-700 inline-block" /> East: {teams.filter(t => t.conference === 'East').length} teams
          </span>
        </div>
      )}
    </section>
  )
}
