import axios from 'axios';

const API_URL = 'http://localhost:5000/api/translate';

// Simple in-memory cache for the service as well, though Context handles it too
const cache = new Map<string, string>();

export const translateText = async (text: string, targetLanguage: string) => {
  try {
    const response = await axios.post(API_URL, {
      text,
      targetLanguage
    });
    return response.data.translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
};

export const translateTextCached = async (text: string, targetLanguage: string) => {
  const key = `${text}-${targetLanguage}`;
  if (cache.has(key)) return cache.get(key)!;

  const translated = await translateText(text, targetLanguage);
  cache.set(key, translated);
  return translated;
};

export const translateBatch = async (texts: string[], targetLanguage: string) => {
  // For now, simple parallel requests. Optimization: Backend batch endpoint.
  // The backend endpoint currently takes single {text, targetLanguage}.
  // We can call it in parallel or sequential. Parallel is faster but might hit rate limits.
  // Let's do parallel.
  try {
    const promises = texts.map(text => translateTextCached(text, targetLanguage));
    return await Promise.all(promises);
  } catch (error) {
    console.error('Batch translation error:', error);
    return texts;
  }
};
