// utils/grammarCorrection.ts
import { correctGrammarWithGemini } from './grammarCorrectionGemini';
import { correctGrammarWithLanguageTool } from './grammarCorrectionLanguageTool'; // Assuming you already have this

export async function correctGrammar(text: string, language: string, useAI: boolean): Promise<string> {
  if (useAI) {
    return await correctGrammarWithGemini(text, language); // Use Gemini AI
  } else {
    return await correctGrammarWithLanguageTool(text, language); // Use LanguageTool
  }
}