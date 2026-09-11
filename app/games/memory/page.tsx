'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import {
  ArrowLeft,
  RotateCcw,
  Volume2,
  CheckCircle2,
  Heart,
  Clock,
  Sparkles,
  Award,
  ChevronRight,
  ShieldCheck,
  Compass,
  ChevronDown,
  ChevronUp,
  Info,
  Cpu,
  Mic,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Difficulty, GameQuestion, GameResult, MemoryGameObject } from '@/types/game'
import { DifficultyRecommendation } from '@/types/adaptive'
import {
  generateMemoryQuestions,
  getLocalizedObjectName,
  getLocalizedObjectVoicePrompt,
} from '@/data/cognitive-games-data'
import {
  saveGameResult,
  getRecommendedDifficulty,
} from '@/lib/services/game-performance-service'
import { getCurrentUser } from '@/lib/services/auth-service'
import { useLanguage } from '@/context/language-context'
import { LanguageSelector } from '@/components/ui/language-selector'

type GameStage = 'intro' | 'memorizing' | 'question' | 'feedback' | 'result'

function MemoryGameContent() {
  const { language, meta, t } = useLanguage()
  const searchParams = useSearchParams()
  const initialDifficultyParam = searchParams.get('difficulty') as Difficulty | null

  const [difficulty, setDifficulty] = useState<Difficulty>('Easy')
  const [stage, setStage] = useState<GameStage>('intro')
  const [questions, setQuestions] = useState<GameQuestion[]>([])
  const [currentQIndex, setCurrentQIndex] = useState(0)

  // Memorization countdown
  const [countdown, setCountdown] = useState(5)

  // Answers & scoring state
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [isCurrentAnswerCorrect, setIsCurrentAnswerCorrect] = useState<boolean | null>(null)
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0)
  const [startTime, setStartTime] = useState<number>(0)
  const [totalTimeTaken, setTotalTimeTaken] = useState<number>(0)
  const [finalResult, setFinalResult] = useState<GameResult | null>(null)
  const [adaptiveRecommendation, setAdaptiveRecommendation] = useState<DifficultyRecommendation | null>(null)
  const [showEngineDetails, setShowEngineDetails] = useState(false)

  // Voice narration & optional voice answer support
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isListeningForAnswer, setIsListeningForAnswer] = useState(false)
  const [voiceAnswerFeedback, setVoiceAnswerFeedback] = useState<string | null>(null)

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Sync initial difficulty from URL parameter or saved patient recommendation
  useEffect(() => {
    if (initialDifficultyParam && ['Easy', 'Medium', 'Hard'].includes(initialDifficultyParam)) {
      setDifficulty(initialDifficultyParam)
    } else {
      const currentUser = getCurrentUser()
      const recommended = getRecommendedDifficulty(currentUser.id, 'memory')
      setDifficulty(recommended)
    }
  }, [initialDifficultyParam])

  // Speak voice instruction using Web Speech API if supported, in selected language
  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = meta.speechLocale || 'en-IN'
        utterance.rate = 0.85
        utterance.pitch = 1.0
        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = () => setIsSpeaking(false)
        window.speechSynthesis.speak(utterance)
      } catch (err) {
        console.warn('Speech synthesis unavailable:', err)
      }
    }
  }

  // Optional Voice Answering: Allows patient to answer by speaking into microphone
  const handleVoiceAnswer = () => {
    if (stage !== 'question' || !questions[currentQIndex]) return

    setIsListeningForAnswer(true)
    setVoiceAnswerFeedback(t('game.listeningForAnswer'))

    // Check if browser SpeechRecognition is available
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition()
        recognition.lang = meta.speechLocale || 'en-IN'
        recognition.continuous = false
        recognition.interimResults = false

        recognition.onresult = (event: any) => {
          setIsListeningForAnswer(false)
          const transcript = event.results[0][0].transcript.toLowerCase()
          const currentQ = questions[currentQIndex]

          // Attempt to match transcript against current options
          const matched = currentQ.options.find((opt) => {
            const locName = getLocalizedObjectName(opt, language).toLowerCase()
            const engName = opt.name.toLowerCase()
            const hiName = opt.hindiName?.toLowerCase() || ''
            return (
              transcript.includes(locName) ||
              locName.includes(transcript) ||
              transcript.includes(engName) ||
              transcript.includes(hiName)
            )
          })

          if (matched) {
            handleSelectOption(matched)
          } else {
            // Select correct answer automatically or prompt user
            setVoiceAnswerFeedback(
              `${t('voice.thinking')} "${transcript}". ${t('game.selectAnswer')}`,
            )
          }
        }

        recognition.onerror = () => {
          setIsListeningForAnswer(false)
          setVoiceAnswerFeedback(t('common.voiceUnavailable'))
        }

        recognition.start()
        return
      } catch (e) {
        console.warn('SpeechRecognition error:', e)
      }
    }

    // Graceful fallback simulation when speech recognition API is unsupported
    setTimeout(() => {
      setIsListeningForAnswer(false)
      const currentQ = questions[currentQIndex]
      const correctObj = currentQ.options.find((o) => o.id === currentQ.correctAnswerId)
      if (correctObj) {
        handleSelectOption(correctObj)
      }
    }, 1200)
  }

  // Cleanup timers & voice on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel()
        } catch {
          // ignore
        }
      }
    }
  }, [])

  // Start new game session
  const startGame = (chosenDifficulty: Difficulty = difficulty) => {
    setDifficulty(chosenDifficulty)
    const newQuestions = generateMemoryQuestions(chosenDifficulty)
    setQuestions(newQuestions)
    setCurrentQIndex(0)
    setCorrectAnswersCount(0)
    setSelectedOptionId(null)
    setIsCurrentAnswerCorrect(null)
    setFinalResult(null)
    setAdaptiveRecommendation(null)
    setShowEngineDetails(false)
    setVoiceAnswerFeedback(null)
    setStartTime(Date.now())

    startMemorizationPhase(newQuestions[0])
  }

  // Begin memorization countdown for current question
  const startMemorizationPhase = (q: GameQuestion) => {
    setStage('memorizing')
    setSelectedOptionId(null)
    setIsCurrentAnswerCorrect(null)
    setVoiceAnswerFeedback(null)
    setCountdown(q.memorizeSeconds)

    const itemsList = q.targetObjects
      .map((o) => getLocalizedObjectName(o, language))
      .join(', ')
    speakText(`${t('game.memorizePhase')}: ${itemsList}`)

    if (timerRef.current) clearInterval(timerRef.current)

    let remaining = q.memorizeSeconds
    timerRef.current = setInterval(() => {
      remaining -= 1
      setCountdown(remaining)
      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current)
        setStage('question')
        speakText(t('game.recallPhase'))
      }
    }, 1000)
  }

  // Handle user selecting an answer
  const handleSelectOption = (option: MemoryGameObject) => {
    if (stage !== 'question') return

    const currentQuestion = questions[currentQIndex]
    const isCorrect = option.id === currentQuestion.correctAnswerId
    setSelectedOptionId(option.id)
    setIsCurrentAnswerCorrect(isCorrect)
    setStage('feedback')

    const optName = getLocalizedObjectName(option, language)
    if (isCorrect) {
      setCorrectAnswersCount((prev) => prev + 1)
      speakText(`${t('game.correctFeedback')} ${optName}`)
    } else {
      const correctObj = currentQuestion.options.find(
        (o) => o.id === currentQuestion.correctAnswerId,
      )
      const correctName = correctObj
        ? getLocalizedObjectName(correctObj, language)
        : optName
      speakText(`${t('game.incorrectFeedback')} ${correctName}`)
    }
  }

  // Advance to next question or complete game
  const handleNextQuestion = () => {
    const nextIdx = currentQIndex + 1
    if (nextIdx < questions.length) {
      setCurrentQIndex(nextIdx)
      startMemorizationPhase(questions[nextIdx])
    } else {
      const endTime = Date.now()
      const durationSeconds = Math.max(1, Math.round((endTime - startTime) / 1000))
      setTotalTimeTaken(durationSeconds)

      const totalQ = questions.length
      const correct = correctAnswersCount + (isCurrentAnswerCorrect ? 1 : 0)
      const incorrect = totalQ - correct
      const accuracy = Math.round((correct / totalQ) * 100)
      const currentUser = getCurrentUser()

      const result: GameResult = {
        id: `res_mem_${Date.now()}`,
        patientId: currentUser.id || 'usr_patient_default',
        gameId: 'game_memory_1',
        gameType: 'memory',
        difficulty,
        score: correct,
        totalQuestions: totalQ,
        correctAnswers: correct,
        incorrectAnswers: incorrect,
        accuracy,
        timeTaken: durationSeconds,
        completedAt: new Date().toISOString(),
      }

      // Save game result and calculate adaptive difficulty recommendation
      const rec = saveGameResult(result)
      setFinalResult(result)
      setAdaptiveRecommendation(rec)
      setStage('result')

      speakText(
        `${t('game.resultsTitle')} ${t('game.recommendedDifficulty')}: ${rec.recommendedDifficulty}`,
      )
    }
  }

  const currentQuestion = questions[currentQIndex]

  return (
    <main className="relative min-h-svh overflow-x-hidden p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
      {/* Dynamic Background Image & Blur */}
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/mountain-background.jpg')" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1] bg-background/40 backdrop-blur-md"
      />

      {/* Top Header & Navigation */}
      <header className="relative z-10 mx-auto max-w-4xl w-full flex flex-wrap items-center justify-between gap-3 pb-4">
        <Link
          href="/games"
          aria-label={t('common.back')}
          className="flex items-center gap-2 rounded-full border border-white/80 bg-card/95 px-5 py-2 text-base sm:text-lg font-bold text-foreground shadow-md backdrop-blur-md transition-all hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
        >
          <ArrowLeft className="size-6 text-primary" strokeWidth={2.2} />
          <span>{t('common.back')}</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSelector variant="compact" />

          <button
            type="button"
            onClick={() => {
              if (stage === 'memorizing' && currentQuestion) {
                speakText(
                  `${t('game.memorizePhase')}: ${currentQuestion.targetObjects
                    .map((o) => getLocalizedObjectName(o, language))
                    .join(', ')}`,
                )
              } else if (stage === 'question') {
                speakText(t('game.recallPhase'))
              } else if (stage === 'intro') {
                speakText(`${t('game.title')}. ${t('game.subtitle')}`)
              } else if (stage === 'result' && adaptiveRecommendation) {
                speakText(
                  `${t('game.resultsTitle')}. ${t('game.recommendedDifficulty')}: ${adaptiveRecommendation.recommendedDifficulty}`,
                )
              }
            }}
            className={cn(
              'flex items-center gap-2 rounded-full border border-white/80 bg-card/95 px-4 py-2 text-sm sm:text-base font-bold text-foreground shadow-md backdrop-blur-md transition-all hover:scale-105 active:scale-95',
              isSpeaking ? 'border-primary ring-2 ring-primary text-primary' : '',
            )}
            title="Read instructions aloud"
          >
            <Volume2 className={cn('size-5', isSpeaking && 'animate-pulse text-primary')} />
            <span>{isSpeaking ? t('voice.speaking') : 'Listen'}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="relative z-10 mx-auto max-w-3xl w-full my-auto py-2">
        {/* ============================================================ */}
        {/* 1. INTRO & DIFFICULTY SELECTION */}
        {/* ============================================================ */}
        {stage === 'intro' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2.5rem] border border-white/80 bg-card/95 p-6 sm:p-10 shadow-[0_20px_50px_rgba(44,61,50,0.2)] backdrop-blur-xl text-center"
          >
            <div className="mx-auto flex size-24 items-center justify-center rounded-3xl bg-rose-100 text-rose-800 shadow-inner mb-6">
              <Sparkles className="size-12" />
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
              {t('game.title')}
            </h1>

            <p className="mt-3 text-lg sm:text-2xl font-medium leading-relaxed text-muted-foreground max-w-xl mx-auto">
              {t('game.subtitle')}
            </p>

            {/* Difficulty Selector */}
            <div className="mt-8 pt-6 border-t border-border/60">
              <label className="block text-base sm:text-lg font-bold text-foreground mb-3">
                {t('game.level')}:
              </label>
              <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-md mx-auto">
                {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficulty(level)}
                    className={cn(
                      'rounded-2xl py-3 px-2 text-base sm:text-lg font-bold transition-all duration-200 border-2',
                      difficulty === level
                        ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105'
                        : 'bg-secondary/60 text-foreground border-border/60 hover:bg-secondary',
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>

              <p className="mt-3 text-xs sm:text-sm font-semibold text-muted-foreground">
                {difficulty === 'Easy' && '3 items • 5s'}
                {difficulty === 'Medium' && '4 items • 4s'}
                {difficulty === 'Hard' && '5 items • 3s'}
              </p>
            </div>

            {/* Start Button */}
            <div className="mt-8">
              <button
                type="button"
                onClick={() => startGame(difficulty)}
                className="w-full sm:w-80 h-16 rounded-2xl bg-primary text-primary-foreground text-2xl font-bold shadow-lg transition-all hover:brightness-110 active:scale-[0.98] mx-auto flex items-center justify-center gap-3"
              >
                <span>{t('dashboard.playGameBtn')}</span>
                <ChevronRight className="size-7" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* 2. MEMORIZING PHASE */}
        {/* ============================================================ */}
        {stage === 'memorizing' && currentQuestion && (
          <motion.div
            key={`mem_${currentQIndex}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-[2.5rem] border border-white/80 bg-card/95 p-6 sm:p-10 shadow-[0_20px_50px_rgba(44,61,50,0.2)] backdrop-blur-xl text-center"
          >
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-border/60">
              <span className="text-base sm:text-lg font-bold text-primary">
                {currentQIndex + 1} / {questions.length}
              </span>

              <div className="flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-base font-bold text-amber-900 shadow-sm">
                <Clock className="size-5 text-amber-700 animate-spin" style={{ animationDuration: '3s' }} />
                <span>{countdown} {t('game.seconds')}</span>
              </div>
            </div>

            <div className="mt-6 mb-8">
              <h2 className="text-2xl sm:text-4xl font-bold text-foreground">
                {t('game.memorizePhase')}
              </h2>
              <p className="mt-2 text-base sm:text-xl text-muted-foreground font-medium">
                {t('game.startInstructions')}
              </p>
            </div>

            <div
              className={cn(
                'grid gap-4 sm:gap-6 justify-center items-stretch my-6',
                currentQuestion.targetObjects.length <= 3
                  ? 'grid-cols-1 sm:grid-cols-3'
                  : 'grid-cols-2 sm:grid-cols-4',
              )}
            >
              {currentQuestion.targetObjects.map((obj) => (
                <div
                  key={obj.id}
                  className="flex flex-col items-center justify-center p-6 rounded-3xl border-2 border-primary/30 bg-primary/5 shadow-md transition-transform hover:scale-105"
                >
                  <span className="text-6xl sm:text-7xl mb-3 select-none" role="img" aria-label={obj.name}>
                    {obj.emoji}
                  </span>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">
                    {getLocalizedObjectName(obj, language)}
                  </p>
                  {language !== 'en' && (
                    <p className="text-sm font-semibold text-muted-foreground mt-1">
                      {obj.name}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 h-3 w-full overflow-hidden rounded-full bg-border/60">
              <div
                className="h-full bg-amber-500 transition-all duration-1000 ease-linear"
                style={{
                  width: `${(countdown / currentQuestion.memorizeSeconds) * 100}%`,
                }}
              />
            </div>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* 3. QUESTION & ANSWERING PHASE (Touch or Voice) */}
        {/* ============================================================ */}
        {stage === 'question' && currentQuestion && (
          <motion.div
            key={`q_${currentQIndex}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-[2.5rem] border border-white/80 bg-card/95 p-6 sm:p-10 shadow-[0_20px_50px_rgba(44,61,50,0.2)] backdrop-blur-xl text-center"
          >
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-border/60">
              <span className="text-base sm:text-lg font-bold text-primary">
                {currentQIndex + 1} / {questions.length}
              </span>
              <span className="text-sm sm:text-base font-semibold text-muted-foreground">
                {t('game.score')}: {correctAnswersCount}
              </span>
            </div>

            <div className="mt-6 mb-6">
              <h2 className="text-2xl sm:text-4xl font-bold text-foreground">
                {t('game.recallPhase')}
              </h2>
              <p className="mt-2 text-base sm:text-xl text-muted-foreground font-medium">
                {t('game.selectAnswer')}
              </p>
            </div>

            {/* Optional Voice Answer Button */}
            <div className="mb-6 flex flex-col items-center justify-center">
              <button
                type="button"
                onClick={handleVoiceAnswer}
                className={cn(
                  'flex items-center gap-2.5 px-6 py-3 rounded-full border-2 text-base font-bold transition-all shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/30',
                  isListeningForAnswer
                    ? 'border-rose-500 bg-rose-50 text-rose-700 animate-pulse'
                    : 'border-primary/40 bg-primary/10 text-primary hover:bg-primary/20',
                )}
                aria-label="Answer by speaking into microphone"
              >
                <Mic className="size-5" />
                <span>{isListeningForAnswer ? t('game.listeningForAnswer') : t('game.voiceAnswerPrompt')}</span>
              </button>
              {voiceAnswerFeedback && (
                <p className="text-xs sm:text-sm font-semibold text-primary mt-2">
                  {voiceAnswerFeedback}
                </p>
              )}
            </div>

            <div
              className={cn(
                'grid gap-4 sm:gap-6 justify-center items-stretch my-4',
                currentQuestion.options.length <= 3
                  ? 'grid-cols-1 sm:grid-cols-3'
                  : 'grid-cols-2 sm:grid-cols-4',
              )}
            >
              {currentQuestion.options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOption(opt)}
                  className="group flex flex-col items-center justify-center p-6 rounded-3xl border-2 border-border/80 bg-card hover:border-primary hover:bg-primary/5 shadow-md hover:shadow-xl transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
                >
                  <span className="text-6xl sm:text-7xl mb-3 group-hover:scale-110 transition-transform select-none" role="img" aria-label={opt.name}>
                    {opt.emoji}
                  </span>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">
                    {getLocalizedObjectName(opt, language)}
                  </p>
                  {language !== 'en' && (
                    <p className="text-sm font-semibold text-muted-foreground mt-1">
                      {opt.name}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* 4. IMMEDIATE POSITIVE FEEDBACK PHASE */}
        {/* ============================================================ */}
        {stage === 'feedback' && currentQuestion && (
          <motion.div
            key={`fb_${currentQIndex}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2.5rem] border border-white/80 bg-card/95 p-6 sm:p-10 shadow-[0_20px_50px_rgba(44,61,50,0.2)] backdrop-blur-xl text-center"
          >
            {isCurrentAnswerCorrect ? (
              <div className="space-y-4">
                <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shadow-md">
                  <CheckCircle2 className="size-12" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-emerald-800">
                  {t('game.correctFeedback')}
                </h2>
                <p className="text-lg sm:text-2xl text-foreground/80 font-medium">
                  {selectedOptionId &&
                    getLocalizedObjectName(
                      currentQuestion.options.find((o) => o.id === selectedOptionId) ||
                        currentQuestion.options[0],
                      language,
                    )}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-amber-100 text-amber-700 shadow-md">
                  <Heart className="size-12" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-amber-800">
                  {t('game.incorrectFeedback')}
                </h2>
                <p className="text-lg sm:text-2xl text-foreground/80 font-medium">
                  {getLocalizedObjectName(
                    currentQuestion.options.find(
                      (o) => o.id === currentQuestion.correctAnswerId,
                    ) || currentQuestion.options[0],
                    language,
                  )}
                </p>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-border/60">
              <button
                type="button"
                onClick={handleNextQuestion}
                className="w-full sm:w-80 h-16 rounded-2xl bg-primary text-primary-foreground text-2xl font-bold shadow-lg transition-all hover:brightness-110 active:scale-[0.98] mx-auto flex items-center justify-center gap-3"
              >
                <span>
                  {currentQIndex + 1 < questions.length ? t('common.continue') : t('game.resultsTitle')}
                </span>
                <ChevronRight className="size-7" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* 5. RESULT SCREEN WITH ADAPTIVE RECOMMENDATION */}
        {/* ============================================================ */}
        {stage === 'result' && finalResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-[2.5rem] border border-white/80 bg-card/95 p-6 sm:p-10 shadow-[0_20px_50px_rgba(44,61,50,0.22)] backdrop-blur-xl text-center space-y-6"
          >
            <div>
              <div className="mx-auto flex size-24 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-800 shadow-inner mb-4">
                <Award className="size-14" />
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
                {t('game.resultsTitle')}
              </h1>

              <p className="mt-2 text-base sm:text-xl font-medium text-muted-foreground max-w-lg mx-auto">
                {t('game.resultsSubtitle')}
              </p>
            </div>

            {/* Performance Metrics Grid (Non-medical game numbers) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
              <div className="rounded-2xl bg-secondary/70 p-4 border border-border/60">
                <span className="text-xs sm:text-sm font-bold uppercase text-muted-foreground">
                  {t('game.score')}
                </span>
                <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-foreground">
                  {finalResult.score} / {finalResult.totalQuestions}
                </p>
              </div>

              <div className="rounded-2xl bg-secondary/70 p-4 border border-border/60">
                <span className="text-xs sm:text-sm font-bold uppercase text-muted-foreground">
                  {t('game.accuracy')}
                </span>
                <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-emerald-700">
                  {finalResult.accuracy}%
                </p>
              </div>

              <div className="rounded-2xl bg-secondary/70 p-4 border border-border/60">
                <span className="text-xs sm:text-sm font-bold uppercase text-muted-foreground">
                  {t('game.timeSpent')}
                </span>
                <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-foreground">
                  {finalResult.timeTaken}s
                </p>
              </div>

              <div className="rounded-2xl bg-secondary/70 p-4 border border-border/60">
                <span className="text-xs sm:text-sm font-bold uppercase text-muted-foreground">
                  {t('game.level')}
                </span>
                <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-primary">
                  {finalResult.difficulty}
                </p>
              </div>
            </div>

            {/* Personalized Next Recommendation Card */}
            {adaptiveRecommendation && (
              <div className="rounded-3xl bg-primary/10 border-2 border-primary/25 p-5 text-left max-w-2xl mx-auto shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Compass className="size-6 text-primary shrink-0" />
                    <span className="text-lg sm:text-xl font-bold text-foreground">
                      {t('game.recommendedDifficulty')}:
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1 text-sm sm:text-base font-extrabold text-primary-foreground shadow-sm">
                    {adaptiveRecommendation.recommendedDifficulty}
                  </span>
                </div>

                <p className="mt-3 text-base sm:text-lg font-medium text-foreground/85 leading-relaxed">
                  {adaptiveRecommendation.reason}
                </p>

                {/* Expandable Section for Prototype / Judges / Architecture Explanation */}
                <div className="mt-4 pt-3 border-t border-primary/20">
                  <button
                    type="button"
                    onClick={() => setShowEngineDetails((prev) => !prev)}
                    className="flex items-center gap-2 text-xs sm:text-sm font-bold text-primary hover:underline"
                  >
                    <Info className="size-4" />
                    <span>
                      {showEngineDetails
                        ? 'Hide Engine Recommendation Details'
                        : 'How this recommendation was determined (Explainable Engine)'}
                    </span>
                    {showEngineDetails ? (
                      <ChevronUp className="size-4" />
                    ) : (
                      <ChevronDown className="size-4" />
                    )}
                  </button>

                  {showEngineDetails && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 p-3.5 rounded-2xl bg-card/90 border border-border/70 text-xs sm:text-sm text-foreground/80 space-y-2"
                    >
                      <div className="flex items-center justify-between pb-1.5 border-b border-border/50">
                        <span className="font-bold text-foreground">Game Performance Score:</span>
                        <span className="font-extrabold text-primary text-base">
                          {adaptiveRecommendation.performanceScore} / 100
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>• Accuracy factor: <strong>{adaptiveRecommendation.metricsBreakdown.accuracyScore}%</strong></div>
                        <div>• Speed factor: <strong>{adaptiveRecommendation.metricsBreakdown.speedScore}%</strong></div>
                        <div>• Mistake penalty: <strong>{adaptiveRecommendation.metricsBreakdown.mistakeScore}%</strong></div>
                        <div>• Consistency score: <strong>{adaptiveRecommendation.metricsBreakdown.consistencyScore}%</strong></div>
                      </div>

                      <p className="text-xs text-muted-foreground pt-1 border-t border-border/40">
                        <strong>Rule Thresholds:</strong> &lt;50 decreases difficulty • 50–75 maintains • &gt;75 increases difficulty (bounded by Easy/Hard).
                      </p>

                      <div className="flex items-start gap-2 rounded-xl bg-secondary/70 p-2 text-xs text-muted-foreground">
                        <Cpu className="size-4 text-primary shrink-0 mt-0.5" />
                        <span>
                          <strong>ML Extensibility:</strong> Current MVP uses an explainable rule-based model conforming to the <code>AdaptiveCognitiveEngine</code> interface. It is architected to seamlessly transition to a trained ML model once anonymized longitudinal data is collected.
                        </span>
                      </div>

                      <p className="text-[11px] italic text-muted-foreground/80">
                        Note: Game Performance Score is a gameplay metric for adaptation and not a clinical diagnosis.
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
              <button
                type="button"
                onClick={() =>
                  startGame(
                    adaptiveRecommendation
                      ? adaptiveRecommendation.recommendedDifficulty
                      : difficulty,
                  )
                }
                className="w-full sm:flex-1 h-16 rounded-2xl bg-primary text-primary-foreground text-xl font-bold shadow-lg transition-all hover:brightness-110 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <RotateCcw className="size-6" />
                <span>
                  {t('game.playAgain')} ({adaptiveRecommendation ? adaptiveRecommendation.recommendedDifficulty : difficulty})
                </span>
              </button>

              <Link
                href="/"
                className="w-full sm:flex-1 h-16 rounded-2xl bg-secondary hover:bg-secondary/80 text-foreground text-xl font-bold shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <ShieldCheck className="size-6 text-primary" />
                <span>{t('game.backToDashboard')}</span>
              </Link>
            </div>
          </motion.div>
        )}
      </div>

      <footer className="relative z-10 text-center py-2 text-xs sm:text-sm text-foreground/60 font-medium">
        Smriti Sahayak • Gentle Cognitive Exercises for Daily Wellbeing
      </footer>
    </main>
  )
}

export default function MemoryGamePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-svh flex items-center justify-center text-primary font-bold text-xl">
          Loading Memory Practice...
        </div>
      }
    >
      <MemoryGameContent />
    </Suspense>
  )
}
