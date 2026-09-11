'use client';

import React, { ReactNode } from 'react';
import { LanguageProvider } from '@/context/language-context';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  );
}
