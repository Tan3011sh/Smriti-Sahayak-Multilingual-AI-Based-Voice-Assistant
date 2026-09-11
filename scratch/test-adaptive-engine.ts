import { RuleBasedAdaptiveEngine, calculateDifficultyRecommendation } from '../lib/services/adaptive-engine-service'
import { GameResult } from '../types/game'

const engine = new RuleBasedAdaptiveEngine()

function createMockResult(partial: Partial<GameResult>): GameResult {
  return {
    id: `test_${Date.now()}_${Math.random()}`,
    patientId: 'patient_test_1',
    gameId: 'game_memory_1',
    gameType: 'memory',
    difficulty: 'Easy',
    score: 5,
    totalQuestions: 5,
    correctAnswers: 5,
    incorrectAnswers: 0,
    accuracy: 100,
    timeTaken: 15,
    completedAt: new Date().toISOString(),
    ...partial,
  }
}

function runTests() {
  console.log('--- RUNNING ADAPTIVE COGNITIVE ENGINE TEST SUITE ---\n')
  let passed = 0
  let failed = 0

  function assert(name: string, condition: boolean, details?: string) {
    if (condition) {
      console.log(`[PASS] ${name}`)
      passed++
    } else {
      console.error(`[FAIL] ${name} -> Details: ${details}`)
      failed++
    }
  }

  // 1. New patient (no history) -> Default Easy
  const t1 = calculateDifficultyRecommendation('Easy', [], 'memory', 'new_pat')
  assert('1. New patient defaults to Easy', t1.recommendedDifficulty === 'Easy' && t1.performanceScore === 70)

  // 2. Strong Easy performance (100% accuracy, fast time) -> Medium
  const strongEasy = createMockResult({ difficulty: 'Easy', accuracy: 100, score: 5, timeTaken: 12 })
  const t2 = calculateDifficultyRecommendation('Easy', [strongEasy])
  assert('2. Strong Easy performance promotes to Medium', t2.recommendedDifficulty === 'Medium' && t2.performanceScore > 75, `Rec: ${t2.recommendedDifficulty}, Score: ${t2.performanceScore}`)

  // 3. Strong Medium performance -> Hard
  const strongMedium = createMockResult({ difficulty: 'Medium', accuracy: 100, score: 5, timeTaken: 12 })
  const t3 = calculateDifficultyRecommendation('Medium', [strongMedium])
  assert('3. Strong Medium performance promotes to Hard', t3.recommendedDifficulty === 'Hard' && t3.performanceScore > 75, `Rec: ${t3.recommendedDifficulty}, Score: ${t3.performanceScore}`)

  // 4. Poor Medium performance (<50 score: 20% accuracy, 4 mistakes, slow time) -> Easy
  const poorMedium = createMockResult({ difficulty: 'Medium', accuracy: 20, score: 1, incorrectAnswers: 4, timeTaken: 45 })
  const t4 = calculateDifficultyRecommendation('Medium', [poorMedium])
  assert('4. Poor Medium performance demotes to Easy', t4.recommendedDifficulty === 'Easy' && t4.performanceScore < 50, `Rec: ${t4.recommendedDifficulty}, Score: ${t4.performanceScore}`)

  // 5. Poor Easy performance (<50 score) -> remains Easy (lower bound)
  const poorEasy = createMockResult({ difficulty: 'Easy', accuracy: 20, score: 1, incorrectAnswers: 4, timeTaken: 50 })
  const t5 = calculateDifficultyRecommendation('Easy', [poorEasy])
  assert('5. Poor Easy performance remains Easy (bounded)', t5.recommendedDifficulty === 'Easy' && t5.performanceScore < 50, `Rec: ${t5.recommendedDifficulty}, Score: ${t5.performanceScore}`)

  // 6. Strong Hard performance -> remains Hard (upper bound)
  const strongHard = createMockResult({ difficulty: 'Hard', accuracy: 100, score: 5, timeTaken: 10 })
  const t6 = calculateDifficultyRecommendation('Hard', [strongHard])
  assert('6. Strong Hard performance remains Hard (bounded)', t6.recommendedDifficulty === 'Hard' && t6.performanceScore > 75, `Rec: ${t6.recommendedDifficulty}, Score: ${t6.performanceScore}`)

  // 7. Stable performance (score 50-75) -> maintains current difficulty
  // e.g. 60% accuracy, 2 mistakes, average time
  const stableMed = createMockResult({ difficulty: 'Medium', accuracy: 60, score: 3, incorrectAnswers: 2, timeTaken: 25 })
  const t7 = calculateDifficultyRecommendation('Medium', [stableMed])
  assert('7. Stable Medium performance maintains Medium', t7.recommendedDifficulty === 'Medium' && t7.performanceScore >= 50 && t7.performanceScore <= 75, `Rec: ${t7.recommendedDifficulty}, Score: ${t7.performanceScore}`)

  // 8. Multiple historical results influence consistency
  const h1 = createMockResult({ difficulty: 'Medium', accuracy: 100 })
  const h2 = createMockResult({ difficulty: 'Medium', accuracy: 100 })
  const h3 = createMockResult({ difficulty: 'Medium', accuracy: 100 })
  const t8 = calculateDifficultyRecommendation('Medium', [h1, h2, h3])
  assert('8. High consistency across historical results produces strong score', t8.metricsBreakdown.consistencyScore >= 95, `Consistency: ${t8.metricsBreakdown.consistencyScore}`)

  // 9. Edge cases: 0 time, missing fields, negative values -> no crash
  const edgeResult = createMockResult({ accuracy: -10, timeTaken: 0, incorrectAnswers: -5 })
  const t9 = calculateDifficultyRecommendation('Easy', [edgeResult])
  assert('9. Edge cases (invalid/zero values) handled safely without crash', t9.recommendedDifficulty !== undefined && !isNaN(t9.performanceScore), `Score: ${t9.performanceScore}`)

  // 10. Check ML Extensibility Architecture
  assert('10. Engine exposes modelType and version for ML compatibility', engine.modelType === 'explainable-rule-based' && engine.version.length > 0)

  console.log(`\nTEST RESULTS: ${passed} passed, ${failed} failed out of ${passed + failed} tests.`)
  if (failed > 0) process.exit(1)
}

runTests()
