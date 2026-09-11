import { SupportedLanguage } from '@/types/language'

export interface VoiceCommandResult {
  transcript: string
  response: string
  action?: 'todo' | 'games' | 'profile' | 'notifications' | 'home'
}

interface LocalizedVoiceSample {
  transcript: string
  response: string
  action?: VoiceCommandResult['action']
}

const LOCALIZED_COMMANDS: Record<SupportedLanguage, LocalizedVoiceSample[]> = {
  en: [
    {
      transcript: 'Start a memory game',
      response: 'Opening the Brain Memory Game for you now.',
      action: 'games',
    },
    {
      transcript: 'Show my reminders',
      response: 'Opening your daily schedule and reminders.',
      action: 'notifications',
    },
    {
      transcript: 'Show my to-do list',
      response: 'Opening your daily task list.',
      action: 'todo',
    },
    {
      transcript: 'Remember my medicines',
      response: 'Please remember to take your prescribed medicines with water.',
      action: 'notifications',
    },
    {
      transcript: 'Hello Smriti Sahayak',
      response: 'Hello! I am Smriti Sahayak. Ready to exercise your memory together today.',
    },
  ],
  hi: [
    {
      transcript: 'स्मृति खेल शुरू करें',
      response: 'आपके लिए स्मृति खेल खोला जा रहा है।',
      action: 'games',
    },
    {
      transcript: 'मेरे रिमाइंडर दिखाएं',
      response: 'आपके आज के रिमाइंडर खोले जा रहे हैं।',
      action: 'notifications',
    },
    {
      transcript: 'मेरी कार्यसूची दिखाएं',
      response: 'आपकी दैनिक कार्यसूची खोली जा रही है।',
      action: 'todo',
    },
    {
      transcript: 'दवाई का समय हो गया',
      response: 'कृपया अपनी दवाएं ताज़े पानी के साथ समय पर लें।',
      action: 'notifications',
    },
    {
      transcript: 'नमस्ते स्मृति सहायक',
      response: 'नमस्ते! मैं आपके साथ हूँ, आज हम क्या अभ्यास करें?',
    },
  ],
  as: [
    {
      transcript: 'মগজুৰ খেল আৰম্ভ কৰক',
      response: 'আপোনাৰ বাবে মগজুৰ স্মৃতি খেল খোলা হৈছে।',
      action: 'games',
    },
    {
      transcript: 'মোৰ ৰিমাইণ্ডাৰ দেখুৱাওক',
      response: 'আপোনাৰ আজিৰ ৰিমাইণ্ডাৰৰ তালিকা খোলা হৈছে।',
      action: 'notifications',
    },
    {
      transcript: 'দৈনিক কামৰ তালিকা খোলক',
      response: 'আপোনাৰ দৈনিক কামৰ কাৰ্যসূচী খোলা হৈছে।',
      action: 'todo',
    },
    {
      transcript: 'ঔষধ খোৱাৰ সময় মনত ৰাখক',
      response: 'অনুগ্ৰহ কৰি আপোনাৰ নিৰ্দিষ্ট ঔষধ সময়মতে খাওক।',
      action: 'notifications',
    },
    {
      transcript: 'নমস্কাৰ স্মৃতি সহায়ক',
      response: 'নমস্কাৰ! আপোনাৰ মন সতেজ ৰাখিবলৈ মই সদায় সাজু আছোঁ।',
    },
  ],
}

/**
 * Simulates or executes sending an audio/text command.
 * Adapts to patient's selected language (en, hi, as).
 */
export async function sendVoiceCommand(lang: SupportedLanguage = 'en'): Promise<VoiceCommandResult> {
  const pool = LOCALIZED_COMMANDS[lang] || LOCALIZED_COMMANDS.en
  const sample = pool[Math.floor(Math.random() * pool.length)]

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        transcript: sample.transcript,
        response: sample.response,
        action: sample.action,
      })
    }, 850)
  })
}
