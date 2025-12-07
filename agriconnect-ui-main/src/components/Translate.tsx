// components/Translate.tsx
import { ReactNode } from 'react';
import { useTranslate } from '@/hooks/useTranslate';

interface TranslateProps {
  children: string;
  dependencies?: any[];
}

/**
 * Component to automatically translate text content
 */
export const Translate = ({ children, dependencies = [] }: TranslateProps) => {
  const translatedText = useTranslate(children, dependencies);
  return <>{translatedText}</>;
};

/**
 * Higher-order component to translate text
 */
export const withTranslation = <P extends object>(
  Component: React.ComponentType<P>,
  textProps: string[] = []
) => {
  return (props: P) => {
    // This is a simplified version - in practice, you'd translate the text props
    return <Component {...props} />;
  };
};

