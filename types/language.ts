export type SupportedLanguage = 'en' | 'hi' | 'as';

export interface LanguageMeta {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  speechLocale: string; // BCP 47 language tag for SpeechSynthesis / SpeechRecognition
  dir: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, LanguageMeta> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    speechLocale: 'en-IN',
    dir: 'ltr',
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    speechLocale: 'hi-IN',
    dir: 'ltr',
  },
  as: {
    code: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    speechLocale: 'as-IN',
    dir: 'ltr',
  },
};

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

export const LANGUAGE_STORAGE_KEY = 'smriti_sahayak_language_v1';
