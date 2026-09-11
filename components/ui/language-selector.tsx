'use client';

import React from 'react';
import { useLanguage } from '@/context/language-context';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '@/types/language';
import { Globe, Check } from 'lucide-react';

interface LanguageSelectorProps {
  variant?: 'compact' | 'full' | 'cards';
  className?: string;
}

export function LanguageSelector({ variant = 'compact', className = '' }: LanguageSelectorProps) {
  const { language, setLanguage, t } = useLanguage();

  const languages: SupportedLanguage[] = ['en', 'hi', 'as'];

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1.5 p-1 bg-white/90 dark:bg-zinc-800/90 rounded-full border border-primary/20 shadow-sm ${className}`}>
        <Globe className="w-4 h-4 ml-2 text-primary/70 shrink-0" aria-hidden="true" />
        <div className="flex gap-1">
          {languages.map((code) => {
            const isSelected = language === code;
            const meta = SUPPORTED_LANGUAGES[code];
            return (
              <button
                key={code}
                onClick={() => setLanguage(code)}
                className={`px-3 py-1 text-xs sm:text-sm font-semibold rounded-full transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary ${
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                aria-label={`Switch language to ${meta.name}`}
                aria-pressed={isSelected}
              >
                {meta.nativeName}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 'cards' or 'full' elderly-friendly prominent grid mode
  return (
    <div className={`w-full max-w-lg mx-auto ${className}`}>
      <div className="mb-2 text-center">
        <label className="text-base sm:text-lg font-bold text-foreground flex items-center justify-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          {t('common.selectLanguage')}
        </label>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {languages.map((code) => {
          const isSelected = language === code;
          const meta = SUPPORTED_LANGUAGES[code];
          return (
            <button
              key={code}
              onClick={() => setLanguage(code)}
              className={`p-4 rounded-2xl border-2 text-center transition-all duration-200 flex flex-col items-center justify-center min-h-[72px] focus:outline-none focus:ring-4 focus:ring-primary/30 ${
                isSelected
                  ? 'border-primary bg-primary/10 shadow-md ring-2 ring-primary/20'
                  : 'border-border/60 hover:border-primary/40 bg-card hover:bg-muted/40'
              }`}
              aria-label={`Select ${meta.name} (${meta.nativeName})`}
              aria-pressed={isSelected}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-bold text-foreground">
                  {meta.nativeName}
                </span>
                {isSelected && (
                  <Check className="w-5 h-5 text-primary stroke-[3]" aria-hidden="true" />
                )}
              </div>
              <span className="text-xs text-muted-foreground font-medium mt-0.5">
                {meta.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
