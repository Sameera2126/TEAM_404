// contexts/TranslationContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Language } from '@/types';
import { translateTextCached, translateBatch } from '@/services/translationService';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translate: (text: string) => Promise<string>;
  translateBatch: (texts: string[]) => Promise<string[]>;
  isTranslating: boolean;
  clearCache: () => void;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Cache for translated texts
const translationCache = new Map<string, Map<Language, string>>();

export const TranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [isTranslating, setIsTranslating] = useState(false);

  // Clear translation cache
  const clearCache = useCallback(() => {
    translationCache.clear();
  }, []);

  // Set language and clear cache when language changes
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    // Optionally clear cache when language changes
    // clearCache();
  }, []);

  // Translate single text with caching
  const translate = useCallback(async (text: string): Promise<string> => {
    if (!text || text.trim() === '' || language === 'en') {
      return text;
    }

    // Check cache first
    const textCache = translationCache.get(text);
    if (textCache && textCache.has(language)) {
      return textCache.get(language)!;
    }

    try {
      setIsTranslating(true);
      const translated = await translateTextCached(text, language);
      
      // Cache the translation
      if (!textCache) {
        translationCache.set(text, new Map([[language, translated]]));
      } else {
        textCache.set(language, translated);
      }

      return translated;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    } finally {
      setIsTranslating(false);
    }
  }, [language]);

  // Translate multiple texts
  const translateMultiple = useCallback(async (texts: string[]): Promise<string[]> => {
    if (language === 'en') {
      return texts;
    }

    try {
      setIsTranslating(true);
      const translated = await translateBatch(texts, language);
      return translated;
    } catch (error) {
      console.error('Batch translation error:', error);
      return texts;
    } finally {
      setIsTranslating(false);
    }
  }, [language]);

  return (
    <TranslationContext.Provider
      value={{
        language,
        setLanguage,
        translate,
        translateBatch: translateMultiple,
        isTranslating,
        clearCache,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

