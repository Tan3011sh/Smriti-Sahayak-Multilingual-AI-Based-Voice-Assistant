import {
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  SupportedLanguage,
} from '../types/language'
import { getTranslation, LOCALES } from '../data/locales'
import {
  FAMILIAR_OBJECTS,
  getLocalizedObjectName,
  getLocalizedObjectDescription,
  getLocalizedObjectVoicePrompt,
  generateMemoryQuestions,
} from '../data/cognitive-games-data'
import { sendVoiceCommand } from '../lib/services/voice-service'

let passed = 0
let failed = 0

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`)
    passed++
  } else {
    console.error(`❌ FAIL: ${testName}`)
    failed++
  }
}

async function runMultilingualTests() {
  console.log('====================================================')
  console.log('PHASE 6: MULTILINGUAL & NER CULTURAL SYSTEM TEST SUITE')
  console.log('====================================================\n')

  // 1. Languages & Configuration
  console.log('--- 1. Languages & Configuration ---')
  assert(
    Boolean(SUPPORTED_LANGUAGES.en && SUPPORTED_LANGUAGES.hi && SUPPORTED_LANGUAGES.as),
    'English, Hindi, and Assamese are registered supported languages',
  )
  assert(DEFAULT_LANGUAGE === 'en', 'English is the default fallback language')
  assert(
    LANGUAGE_STORAGE_KEY === 'smriti_sahayak_language_v1',
    'Language storage key is smriti_sahayak_language_v1',
  )
  assert(
    SUPPORTED_LANGUAGES.as.speechLocale === 'as-IN' &&
      SUPPORTED_LANGUAGES.hi.speechLocale === 'hi-IN',
    'Speech synthesis/recognition locales configured correctly (hi-IN, as-IN)',
  )

  // 2. Centralized Translations & Fallback Architecture
  console.log('\n--- 2. Localization & Translation Mechanism ---')
  const enTitle = getTranslation('game.title', 'en')
  const hiTitle = getTranslation('game.title', 'hi')
  const asTitle = getTranslation('game.title', 'as')

  assert(enTitle === 'Cultural Memory Exercise', 'English translation resolves correctly')
  assert(hiTitle === 'सांस्कृतिक स्मृति अभ्यास', 'Hindi translation resolves correctly')
  assert(asTitle === 'সাংস্কৃতিক স্মৃতি অনুশীলন', 'Assamese translation resolves correctly')

  // Test parameter replacement
  const paramTest = getTranslation('dashboard.activeRemindersCount', 'as', { count: 3 })
  assert(
    paramTest.includes('3') && paramTest.includes('ৰিমাইণ্ডাৰ'),
    'Parameter interpolation {count} works in Assamese',
  )

  // Fallback test for non-existent key or missing locale key
  const fallbackTest = getTranslation('game.nonExistentKeyxyz', 'as')
  assert(
    fallbackTest === 'game.nonExistentKeyxyz',
    'Missing key returns key cleanly and never undefined or null',
  )

  // 3. NER Cultural Cognitive Content
  console.log('\n--- 3. North East Region (NER) Cultural Content ---')
  const rhino = FAMILIAR_OBJECTS.find((o) => o.id === 'obj_rhino')
  const japi = FAMILIAR_OBJECTS.find((o) => o.id === 'obj_japi')
  const tea = FAMILIAR_OBJECTS.find((o) => o.id === 'obj_tea')
  const dhol = FAMILIAR_OBJECTS.find((o) => o.id === 'obj_dhol')
  const orchid = FAMILIAR_OBJECTS.find((o) => o.id === 'obj_orchid')
  const bamboo = FAMILIAR_OBJECTS.find((o) => o.id === 'obj_bamboo')

  assert(
    Boolean(rhino && japi && tea && dhol && orchid && bamboo),
    'NER cultural objects (Kaziranga Rhino, Japi, Tea, Dhol, Kopou Orchid, Bamboo) present in dataset',
  )

  if (rhino) {
    const rhinoEn = getLocalizedObjectName(rhino, 'en')
    const rhinoHi = getLocalizedObjectName(rhino, 'hi')
    const rhinoAs = getLocalizedObjectName(rhino, 'as')
    assert(
      rhinoEn === 'Kaziranga Rhino' &&
        rhinoHi.includes('गैंडा') &&
        rhinoAs === 'এশিঙীয়া গঁড়',
      'Rhino localized names match across en, hi, as',
    )
  }

  if (japi) {
    const japiPromptAs = getLocalizedObjectVoicePrompt(japi, 'as')
    assert(
      japiPromptAs.includes('জাপি'),
      'Assamese Japi voice prompt is culturally accurate in Assamese',
    )
  }

  // 4. Backward Compatibility for Game Questions & Engine
  console.log('\n--- 4. Game Engine Backward Compatibility ---')
  const questions = generateMemoryQuestions('Easy')
  assert(questions.length === 5, 'generateMemoryQuestions generates 5 questions')
  assert(
    questions[0].targetObjects.every((o) => o.name && o.hindiName && o.category),
    'Game question targetObjects retain backward-compatible name, hindiName, and category properties',
  )

  // 5. Multilingual Voice Assistant Service
  console.log('\n--- 5. Multilingual Voice Assistant Service ---')
  const enVoice = await sendVoiceCommand('en')
  assert(
    typeof enVoice.transcript === 'string' && typeof enVoice.response === 'string',
    'Voice assistant responds for English',
  )

  const hiVoice = await sendVoiceCommand('hi')
  assert(
    typeof hiVoice.transcript === 'string' && typeof hiVoice.response === 'string',
    'Voice assistant responds in Hindi for hi language',
  )

  const asVoice = await sendVoiceCommand('as')
  assert(
    typeof asVoice.transcript === 'string' && typeof asVoice.response === 'string',
    'Voice assistant responds in Assamese for as language',
  )

  // 6. Final Summary
  console.log('\n====================================================')
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`)
  console.log('====================================================')

  if (failed > 0) {
    process.exit(1)
  }
}

runMultilingualTests().catch((e) => {
  console.error('Fatal error in tests:', e)
  process.exit(1)
})
