import { useState, useEffect } from 'react'
import { API_URL } from './constants'
import Header from './components/Header'
import TeamGrid from './components/TeamGrid'
import PredictButton from './components/PredictButton'
import StepCard from './components/StepCard'
import ChampionCard from './components/ChampionCard'

export default function App() {
  const [initialTeams, setInitialTeams] = useState([])
  const [teamsLoading, setTeamsLoading] = useState(true)

  // Prediction state
  const [status, setStatus] = useState('idle') // idle | loading | animating | done | error
  const [steps, setSteps] = useState([])
  const [visibleSteps, setVisibleSteps] = useState([])
  const [eliminatedIds, setEliminatedIds] = useState(new Set())
  const [champion, setChampion] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  // Fetch the 20 teams on page load so they're visible immediately
  useEffect(() => {
    fetch(`${API_URL}/teams`)
      .then(res => res.json())
      .then(data => setInitialTeams(data.teams || []))
      .catch(() => {})
      .finally(() => setTeamsLoading(false))
  }, [])

  const handleGenerate = async () => {
    setStatus('loading')
    setSteps([])
    setVisibleSteps([])
    setEliminatedIds(new Set())
    setChampion(null)
    setErrorMsg('')

    try {
      const res = await fetch(`${API_URL}/predict`)
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `Server error ${res.status}`)
      }
      const data = await res.json()

      // Update team grid with the fetched initial_teams (in case they changed)
      if (data.initial_teams?.length) setInitialTeams(data.initial_teams)

      setSteps(data.steps || [])
      setStatus('animating')
      animateSteps(data.steps || [], data.champion)
    } catch (err) {
      setErrorMsg(err.message || 'Failed to fetch prediction. Please try again.')
      setStatus('error')
    }
  }

  const animateSteps = (allSteps, finalChampion) => {
    allSteps.forEach((step, i) => {
      setTimeout(() => {
        setVisibleSteps(prev => [...prev, step])
        setEliminatedIds(prev => {
          const next = new Set(prev)
          step.eliminated.forEach(t => next.add(t.team_id))
          return next
        })

        if (i === allSteps.length - 1) {
          setTimeout(() => {
            setChampion(finalChampion)
            setStatus('done')
          }, 1200)
        }
      }, i * 2200)
    })
  }

  const isGenerating = status === 'loading' || status === 'animating'

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <Header />

        {/* Team grid */}
        {(initialTeams.length > 0 || teamsLoading) && (
          <TeamGrid
            teams={initialTeams}
            eliminatedIds={eliminatedIds}
            champion={status === 'done' ? champion : null}
            loading={teamsLoading}
          />
        )}

        {/* Generate button */}
        <div className="flex flex-col items-center gap-3 my-8">
          <PredictButton status={status} onClick={handleGenerate} disabled={isGenerating} />
          {status === 'loading' && (
            <p className="text-gray-400 text-sm animate-pulse">
              Fetching live NBA data — this may take up to 30 seconds on first load...
            </p>
          )}
          {status === 'animating' && (
            <p className="text-gray-400 text-sm">Running formula...</p>
          )}
          {errorMsg && (
            <p className="text-red-400 text-sm">{errorMsg}</p>
          )}
        </div>

        {/* Step-by-step requirement results */}
        <div className="space-y-5">
          {visibleSteps.map(step => (
            <StepCard key={step.requirement} step={step} />
          ))}
        </div>

        {/* Champion reveal */}
        {status === 'done' && champion && (
          <ChampionCard team={champion} />
        )}
      </div>
    </div>
  )
}
