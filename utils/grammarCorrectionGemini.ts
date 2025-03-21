// utils/geminiGrammarCorrection.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

// Language code to human-readable name mapping
const languageMap: { [key: string]: string } = {
  'en-US': 'English', // English
  'id-ID': 'Indonesian', // Indonesian
  'zh-CN': 'Chinese', // Chinese
  'es-ES': 'Spanish', // Spanish
  'fr-FR': 'French', // French
  'de-DE': 'German', // German
  'ja-JP': 'Japanese', // Japanese
};

export async function correctGrammarWithGemini(
  text: string,
  language: string
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Map the target language code to a human-readable name
  const targetLanguage = languageMap[language] || 'English'; // Default to English if code is not found
  console.log(targetLanguage)

  const prompt = `
    Correct the grammar, improve the flow, and ensure proper punctuation of the following text.
    The text is written in ${targetLanguage}, but you must return the corrected text in the **${targetLanguage} language**.
    Make the text sound more natural and appropriate for the context.
    Return only the corrected text without additional explanations.

    Text: ${text}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error correcting grammar with Gemini:', error);
    throw new Error('Failed to correct grammar with Gemini');
  }
}