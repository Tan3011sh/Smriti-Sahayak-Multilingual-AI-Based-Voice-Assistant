import { SarvamAIClient } from 'sarvamai';
import { SupportedLanguage } from '@/types/language';

// Ensure API key is server-side only
const SARVAM_API_KEY = process.env.SARVAM_API_KEY || '';

// Map Smriti Sahayak language codes to Sarvam BCP-47 codes
export const SARVAM_LANGUAGE_MAP: Record<SupportedLanguage, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  as: 'as-IN',
};

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ConversationRequest {
  audioBuffer?: Buffer;
  mimeType?: string;
  text?: string;
  language: SupportedLanguage;
  patientName?: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface ConversationResponse {
  transcript: string;
  response: string;
  audioBase64: string | null;
  language: SupportedLanguage;
  error?: string;
}

/**
 * Creates an authorized Sarvam client instance if the key is available.
 */
function getSarvamClient(): SarvamAIClient | null {
  if (!SARVAM_API_KEY || SARVAM_API_KEY.trim() === '') {
    return null;
  }
  return new SarvamAIClient({ apiSubscriptionKey: SARVAM_API_KEY });
}

/**
 * Elderly-friendly localized fallbacks when Sarvam API is unreachable or key is unset.
 */
function getFallbackResponse(text: string, lang: SupportedLanguage, patientName?: string): string {
  const nameGreeting = patientName ? ` ${patientName}` : '';
  const lower = (text || '').toLowerCase();

  if (lang === 'hi') {
    if (lower.includes('game') || lower.includes('खेल') || lower.includes('मेमोरी')) {
      return `नमस्ते${nameGreeting}! आप नीचे दिए गए 'स्मृति खेल' बटन को दबाकर खेल खेल सकते हैं।`;
    }
    if (lower.includes('reminder') || lower.includes('रिमाइंडर') || lower.includes('दवा')) {
      return `नमस्ते${nameGreeting}! आप नीचे दिए गए रिमाइंडर अनुभाग में अपनी आज की दवाएं और कार्य देख सकते हैं।`;
    }
    if (lower.includes('todo') || lower.includes('काम') || lower.includes('सूची')) {
      return `नमस्ते${nameGreeting}! आपकी दैनिक कार्यसूची नीचे उपलब्ध है। आप उसे कभी भी देख सकते हैं।`;
    }
    return `नमस्ते${nameGreeting}! मैं स्मृति सहायक हूँ। मैं आपकी सहायता के लिए हमेशा यहाँ हूँ।`;
  }

  if (lang === 'as') {
    if (lower.includes('game') || lower.includes('খেল') || lower.includes('স্মৃতি')) {
      return `নমস্কাৰ${nameGreeting}! আপুনি তলৰ 'মগজুৰ খেল' বুটামত টিপি স্মৃতি খেল খেলিব পাৰে।`;
    }
    if (lower.includes('reminder') || lower.includes('ৰিমাইণ্ডাৰ') || lower.includes('ঔষধ')) {
      return `নমস্কাৰ${nameGreeting}! আপুনি তলৰ ৰিমাইণ্ডাৰ শিতানত নিজৰ ঔষধ আৰু কাৰ্যসূচী চাব পাৰে।`;
    }
    if (lower.includes('todo') || lower.includes('কাম') || lower.includes('তালিকা')) {
      return `নমস্কাৰ${nameGreeting}! আপোনাৰ দৈনিক কামৰ তালিকা তলত উপলব্ধ আছে।`;
    }
    return `নমস্কাৰ${nameGreeting}! মই স্মৃতি সহায়ক। আপোনাক সহায় কৰিবলৈ মই সদায় সাজু আছোঁ।`;
  }

  // English default
  if (lower.includes('game') || lower.includes('memory')) {
    return `Namaste${nameGreeting}! You can tap on the 'Play Memory Game' button below to begin.`;
  }
  if (lower.includes('reminder') || lower.includes('medicine') || lower.includes('schedule')) {
    return `Namaste${nameGreeting}! You can view your today's medications and reminders in the section below.`;
  }
  if (lower.includes('task') || lower.includes('todo') || lower.includes('checklist')) {
    return `Namaste${nameGreeting}! You can check your daily routine in the Daily Tasks section below.`;
  }
  return `Namaste${nameGreeting}! I am Smriti Sahayak. I am right here to accompany and support you today.`;
}

/**
 * Builds the strict system prompt for Sarvam 105b conversational model.
 */
function buildSystemPrompt(language: SupportedLanguage, patientName?: string): string {
  const languageNames: Record<SupportedLanguage, string> = {
    en: 'English (Indian English context)',
    hi: 'Hindi (Devanagari)',
    as: 'Assamese',
  };

  const chosenLang = languageNames[language] || 'English';
  const nameStr = patientName ? `The patient's name is ${patientName}.` : '';

  return `You are Smriti Sahayak, a gentle, compassionate, and culturally respectful AI companion for elderly individuals and people with mild cognitive impairment or dementia in India.
${nameStr}
Current Page: Patient Dashboard.
Language to reply in: ${chosenLang}.

CRITICAL GUIDELINES:
1. Warmth & Tone: Always begin with a warm, respectful greeting (e.g. "Namaste!") and speak in short, calming, simple sentences.
2. Brevity: Keep responses concise (1 to 2 short sentences, maximum 40 words) so they are easy to listen to and understand.
3. Strict Conversational Scope: You are ONLY a conversational companion. You CANNOT execute application actions, navigate pages, start games, alter reminders, or modify data.
   - If the patient wants to play a game, say: "You can tap the 'Play Memory Game' button right below on your screen."
   - If the patient asks about reminders or medicines, say: "You can check your reminders right below on the dashboard."
   - If the patient asks about tasks or todo, say: "You can open your Daily Tasks from the section below."
4. No Medical Advice: NEVER diagnose, prescribe, or give medical instructions. Gently suggest consulting their family doctor or caregiver.
5. Language Fidelity: Always reply purely in the requested language (${chosenLang}). Do not mix unrelated scripts.`;
}

/**
 * 1. Speech-to-Text via Sarvam API (saaras:v3)
 */
export async function transcribeAudio(
  audioBuffer: Buffer,
  mimeType: string = 'audio/webm',
  language: SupportedLanguage = 'en',
): Promise<string> {
  const client = getSarvamClient();
  const langCode = SARVAM_LANGUAGE_MAP[language] || 'en-IN';

  if (!client) {
    console.warn('[SarvamService] SARVAM_API_KEY missing. STT not available.');
    return '';
  }

  try {
    // Prefer direct REST with FormData for robust buffer transmission in Node runtime
    const formData = new FormData();
    const blob = new Blob([audioBuffer], { type: mimeType });
    const extension = mimeType.includes('wav') ? 'wav' : mimeType.includes('mp4') ? 'mp4' : 'webm';
    formData.append('file', blob, `audio.${extension}`);
    formData.append('model', 'saaras:v3');
    formData.append('language_code', langCode);

    const res = await fetch('https://api.sarvam.ai/speech-to-text', {
      method: 'POST',
      headers: {
        'api-subscription-key': SARVAM_API_KEY,
      },
      body: formData,
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.warn(`[SarvamService] STT returned status ${res.status}: ${errText}`);
      return '';
    }

    const data = await res.json();
    return (data.transcript || '').trim();
  } catch (error) {
    console.warn('[SarvamService] STT error:', error);
    return '';
  }
}

/**
 * 2. Conversational response via Sarvam Chat Completions (sarvam-105b)
 */
export async function generateChatResponse(
  prompt: string,
  language: SupportedLanguage = 'en',
  patientName?: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }> = [],
): Promise<string> {
  const client = getSarvamClient();

  // If no API key, return elderly-friendly fallback
  if (!client) {
    return getFallbackResponse(prompt, language, patientName);
  }

  try {
    const systemMessage: ChatMessage = {
      role: 'system',
      content: buildSystemPrompt(language, patientName),
    };

    // Keep only last 4 messages in history to respect session scope
    const trimmedHistory: ChatMessage[] = history.slice(-4).map((h) => ({
      role: h.role,
      content: h.content.slice(0, 300), // sanitize length
    }));

    const sanitizedUserPrompt = prompt.slice(0, 300).trim();

    const messages: ChatMessage[] = [
      systemMessage,
      ...trimmedHistory,
      { role: 'user', content: sanitizedUserPrompt },
    ];

    const res = await fetch('https://api.sarvam.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': SARVAM_API_KEY,
      },
      body: JSON.stringify({
        model: 'sarvam-105b',
        messages,
        temperature: 0.4,
        max_tokens: 150,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.warn(`[SarvamService] Chat API returned ${res.status}: ${errText}`);
      return getFallbackResponse(prompt, language, patientName);
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return getFallbackResponse(prompt, language, patientName);
    }

    return reply;
  } catch (error) {
    console.warn('[SarvamService] Chat completion error:', error);
    return getFallbackResponse(prompt, language, patientName);
  }
}

/**
 * 3. Text-to-Speech via Sarvam API (bulbul:v3)
 */
export async function synthesizeSpeech(
  text: string,
  language: SupportedLanguage = 'en',
): Promise<string | null> {
  const client = getSarvamClient();
  const langCode = SARVAM_LANGUAGE_MAP[language] || 'en-IN';

  if (!client || !text || text.trim() === '') {
    return null;
  }

  try {
    const sanitizedText = text.slice(0, 500).trim();

    const res = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': SARVAM_API_KEY,
      },
      body: JSON.stringify({
        text: sanitizedText,
        language_code: langCode,
        model: 'bulbul:v3',
        speaker: 'shubh',
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.warn(`[SarvamService] TTS returned status ${res.status}: ${errText}`);
      return null;
    }

    const data = await res.json();
    if (Array.isArray(data.audios) && data.audios.length > 0 && typeof data.audios[0] === 'string') {
      return data.audios[0];
    }

    return null;
  } catch (error) {
    console.warn('[SarvamService] TTS error:', error);
    return null;
  }
}

/**
 * High-level orchestration for complete voice / text conversation turn.
 */
export async function handleConversationTurn(
  request: ConversationRequest,
): Promise<ConversationResponse> {
  const { audioBuffer, mimeType, text, language, patientName, history = [] } = request;

  let transcript = '';

  // 1. Process STT if audio buffer is provided
  if (audioBuffer && audioBuffer.length > 0) {
    transcript = await transcribeAudio(audioBuffer, mimeType, language);
  } else if (text) {
    transcript = text.trim();
  }

  // Handle empty speech or empty input
  if (!transcript) {
    const emptyReply =
      language === 'hi'
        ? 'मुझे आपकी आवाज़ नहीं सुनाई दी। कृपया माइक्रोफ़ोन दबाकर पुनः बोलें या नीचे लिखें।'
        : language === 'as'
          ? 'মই আপোনাৰ মাত শুনিবলৈ নাপালোঁ। অনুগ্ৰহ কৰি পুনৰ কথা কওক বা তলত লিখক।'
          : "I couldn't hear your voice clearly. Please tap the button to speak again, or type below.";

    const audioBase64 = await synthesizeSpeech(emptyReply, language);

    return {
      transcript: '',
      response: emptyReply,
      audioBase64,
      language,
    };
  }

  // 2. Generate conversational response
  const response = await generateChatResponse(transcript, language, patientName, history);

  // 3. Synthesize speech if possible
  const audioBase64 = await synthesizeSpeech(response, language);

  return {
    transcript,
    response,
    audioBase64,
    language,
  };
}
