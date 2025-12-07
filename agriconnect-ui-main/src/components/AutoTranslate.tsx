// components/AutoTranslate.tsx
import { useEffect } from 'react';
import { usePageTranslation } from '@/hooks/usePageTranslation';

/**
 * Component that automatically translates all text content on the page
 * Place this component at the root level or in pages that need automatic translation
 */
export const AutoTranslate = () => {
  usePageTranslation();
  return null;
};

