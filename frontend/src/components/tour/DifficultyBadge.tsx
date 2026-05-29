import type { Difficulty } from '../../types'
import { difficultyLabel, difficultyRisk } from '../../types'

interface Props {
  difficulty: Difficulty
}

export function DifficultyBadge({ difficulty }: Props) {
  const risk = difficultyRisk(difficulty)
  return (
    <span className={`difficulty-badge difficulty-badge--${risk}`}>
      {difficultyLabel(difficulty)}
    </span>
  )
}
