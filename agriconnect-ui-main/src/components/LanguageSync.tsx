// components/LanguageSync.tsx
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/TranslationContext';

/**
 * Component to sync language between AuthContext and TranslationContext
 * This should be placed inside both providers
 */
export const LanguageSync = () => {
  const { language: authLanguage, setLanguage: setAuthLanguage } = useAuth();
  const { language: translationLanguage, setLanguage: setTranslationLanguage } = useTranslation();

  // Sync from AuthContext to TranslationContext
  useEffect(() => {
    if (authLanguage !== translationLanguage) {
      setTranslationLanguage(authLanguage);
    }
  }, [authLanguage, translationLanguage, setTranslationLanguage]);

  // Sync from TranslationContext to AuthContext
  useEffect(() => {
    if (translationLanguage !== authLanguage) {
      setAuthLanguage(translationLanguage);
    }
  }, [translationLanguage, authLanguage, setAuthLanguage]);

  return null;
};

