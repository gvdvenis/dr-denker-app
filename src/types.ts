export interface PuzzleAnswer {
  answerLength: number
  solutionIndex: number
}

export interface UserSolution {
  imageId: number
  answer: string
  timestamp: number
}
