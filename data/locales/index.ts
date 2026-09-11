import { enTranslations, TranslationDictionary } from './en';
import { hiTranslations } from './hi';
import { asTranslations } from './as';
import { SupportedLanguage, DEFAULT_LANGUAGE } from '@/types/language';

export const LOCALES: Record<SupportedLanguage, TranslationDictionary> = {
  en: enTranslations,
  hi: hiTranslations,
  as: asTranslations,
};

/**
 * Resolves a nested key (e.g. 'dashboard.greetingMorning' or 'game.correctFeedback')
 * from the dictionary with English fallback and parameter substitution.
 * Never returns null or undefined.
 */
export function getTranslation(
  key: string,
  lang: SupportedLanguage = DEFAULT_LANGUAGE,
  params?: Record<string, string | number>
): string {
  const keys = key.split('.');

  // 1. Try selected language
  let currentVal: any = LOCALES[lang];
  for (const k of keys) {
    if (currentVal && typeof currentVal === 'object' && k in currentVal) {
      currentVal = currentVal[k];
    } else {
      currentVal = undefined;
      break;
    }
  }

  // 2. Fallback to English if undefined or empty
  if (currentVal === undefined || currentVal === null || currentVal === '') {
    currentVal = LOCALES[DEFAULT_LANGUAGE];
    for (const k of keys) {
      if (currentVal && typeof currentVal === 'object' && k in currentVal) {
        currentVal = currentVal[k];
      } else {
        currentVal = undefined;
        break;
      }
    }
  }

  // 3. Fallback to key itself if still not found
  if (typeof currentVal !== 'string') {
    return key;
  }

  // 4. Substitute parameters like {count}
  if (params) {
    let result = currentVal;
    for (const [pKey, pVal] of Object.entries(params)) {
      result = result.replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(pVal));
    }
    return result;
  }

  return currentVal;
}
