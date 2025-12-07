import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

// @desc    Translate text
// @route   POST /api/translate
// @access  Public (or protected if needed later)
export const translateText = async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({ message: 'Please provide text and targetLanguage' });
    }

    const prompt = `Translate the following text to ${targetLanguage}. Return ONLY the translated text, no additional explanation or quotes.\n\nText: "${text}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translatedText = response.text().trim();

    res.json({ translatedText });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ message: 'Translation failed', error: error.message });
  }
};
