// hooks/usePageTranslation.ts
import { useEffect, useRef } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';

/**
 * Hook to automatically translate all text content on a page
 * This uses a MutationObserver to watch for text changes and translate them
 */
export const usePageTranslation = () => {
  const { translate, language, isTranslating } = useTranslation();
  const observerRef = useRef<MutationObserver | null>(null);
  const translatedElements = useRef<Set<Element>>(new Set());

  useEffect(() => {
    if (language === 'en') {
      // Don't translate if English
      return;
    }

    const translateElement = async (element: Element) => {
      // Skip if already translated
      if (translatedElements.current.has(element)) {
        return;
      }

      // Only translate text nodes and elements with text content
      if (element.nodeType === Node.TEXT_NODE) {
        const textNode = element as Text;
        const text = textNode.textContent?.trim();
        
        if (text && text.length > 0 && !text.match(/^\d+$/) && !text.match(/^[^\w\s]+$/)) {
          try {
            const translated = await translate(text);
            if (translated !== text) {
              textNode.textContent = translated;
              translatedElements.current.add(element);
            }
          } catch (error) {
            console.error('Error translating text node:', error);
          }
        }
      } else if (element.nodeType === Node.ELEMENT_NODE) {
        const el = element as HTMLElement;
        
        // Skip certain elements that shouldn't be translated
        if (
          el.tagName === 'SCRIPT' ||
          el.tagName === 'STYLE' ||
          el.tagName === 'NOSCRIPT' ||
          el.hasAttribute('data-no-translate') ||
          el.closest('[data-no-translate]')
        ) {
          return;
        }

        // Translate text content of elements
        const text = el.textContent?.trim();
        if (text && text.length > 0 && el.children.length === 0) {
          try {
            const translated = await translate(text);
            if (translated !== text) {
              el.textContent = translated;
              translatedElements.current.add(element);
            }
          } catch (error) {
            console.error('Error translating element:', error);
          }
        }
      }
    };

    const translatePage = async () => {
      // Clear previous translations
      translatedElements.current.clear();

      // Get all text nodes and elements
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
        {
          acceptNode: (node) => {
            // Skip script, style, and other non-translatable elements
            if (node.nodeType === Node.ELEMENT_NODE) {
              const el = node as HTMLElement;
              if (
                el.tagName === 'SCRIPT' ||
                el.tagName === 'STYLE' ||
                el.tagName === 'NOSCRIPT' ||
                el.hasAttribute('data-no-translate')
              ) {
                return NodeFilter.FILTER_REJECT;
              }
            }
            return NodeFilter.FILTER_ACCEPT;
          },
        }
      );

      const elementsToTranslate: Element[] = [];
      let node;
      while ((node = walker.nextNode())) {
        if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE) {
          elementsToTranslate.push(node as Element);
        }
      }

      // Translate in batches to avoid overwhelming the API
      const batchSize = 10;
      for (let i = 0; i < elementsToTranslate.length; i += batchSize) {
        const batch = elementsToTranslate.slice(i, i + batchSize);
        await Promise.all(batch.map(translateElement));
      }
    };

    // Initial translation
    translatePage();

    // Watch for DOM changes
    observerRef.current = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE) {
            translateElement(node as Element);
          }
        });
      });
    });

    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      translatedElements.current.clear();
    };
  }, [language, translate]);

  return { isTranslating };
};

