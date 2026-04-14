export default function ChampionCard({ team }) {
  const logoUrl = `https://cdn.nba.com/logos/nba/${team.team_id}/primary/L/logo.svg`

  return (
    <div className="mt-12 flex justify-center animate-fadeUp">
      <div className="relative text-center bg-gradient-to-b from-yellow-950/50 to-gray-900 border-2 border-yellow-500 rounded-3xl px-6 sm:px-12 py-10 shadow-2xl animate-championGlow max-w-sm w-full">
        {/* Trophy icon */}
        <div className="text-4xl mb-3">🏆</div>

        <p className="text-yellow-400 text-xs uppercase tracking-wider font-bold leading-relaxed mb-5">
          Raiden's Predicted Champion
          <br />
          <span className="tracking-widest">2025–2026</span>
        </p>

        <img
          src={logoUrl}
          alt={team.team_name}
          className="w-36 h-36 mx-auto object-contain drop-shadow-2xl mb-5"
          onError={e => { e.currentTarget.style.opacity = '0.2' }}
        />

        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          {team.team_name}
        </h2>
        <p className="text-yellow-300 text-sm mt-2 font-medium">
          Survived all 5 requirements
        </p>
      </div>
    </div>
  )
}
