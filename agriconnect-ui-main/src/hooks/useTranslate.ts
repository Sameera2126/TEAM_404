// hooks/useTranslate.ts
import { useState, useEffect } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';

/**
 * Hook to translate text automatically
 * @param text - The text to translate
 * @param dependencies - Optional dependencies to retranslate when changed
 */
export const useTranslate = (text: string, dependencies: any[] = []) => {
  const { translate, language } = useTranslation();
  const [translatedText, setTranslatedText] = useState<string>(text);

  useEffect(() => {
    const translateText = async () => {
      if (language === 'en') {
        setTranslatedText(text);
        return;
      }
      
      const translated = await translate(text);
      setTranslatedText(translated);
    };

    translateText();
  }, [text, language, translate, ...dependencies]);

  return translatedText;
};

/**
 * Hook to translate multiple texts
 */
export const useTranslateBatch = (texts: string[]) => {
  const { translateBatch, language } = useTranslation();
  const [translatedTexts, setTranslatedTexts] = useState<string[]>(texts);

  useEffect(() => {
    const translateTexts = async () => {
      if (language === 'en') {
        setTranslatedTexts(texts);
        return;
      }
      
      const translated = await translateBatch(texts);
      setTranslatedTexts(translated);
    };

    translateTexts();
  }, [texts, language, translateBatch]);

  return translatedTexts;
};

