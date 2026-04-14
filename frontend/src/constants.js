export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const REQUIREMENTS = [
  {
    description: 'Must have a Top 10 PPG scorer or Top 10 RPG rebounder among all 20 playoff teams',
    wins: 28,
    total: 30,
  },
  {
    description: 'Must have at least one Top 10 MVP candidate on the roster',
    wins: 29,
    total: 30,
  },
  {
    description: 'Must rank in the Top 10 in 3-Point % among remaining teams',
    wins: 11,
    total: 12,
  },
  {
    description: 'Must rank in the Top 5 in Defensive Rating among remaining teams',
    wins: 38,
    total: 40,
  },
  {
    description: 'Must have the best Field Goal % among remaining teams',
    wins: 23,
    total: 25,
  },
]
