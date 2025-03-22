import { Client } from '@notionhq/client';
import { NextApiRequest, NextApiResponse } from 'next';

const notion = new Client({ auth: process.env.NEXT_PUBLIC_NOTION_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // language,
  // targetLang,
  // punctuatedTranscript,
  // correctedText,
  // translatedText
  try {
    const { language, targetLang, punctuatedTranscript, correctedText, translatedText } = req.body;
    await notion.pages.create({
      parent: { database_id: process.env.NEXT_PUBLIC_NOTION_DATABASE_ID! },
      properties: {
        'SelectLanguage': { title: [{ text: { content: language } }] },
        'TranslateTo': { rich_text: [{ text: { content: targetLang } }] },
        'Original': { rich_text: [{ text: { content: punctuatedTranscript } }] },
        'Corrected': { rich_text: [{ text: { content: correctedText } }] },
        'Translated': { rich_text: [{ text: { content: translatedText } }]},
      },
    });
    res.status(200).json({ message: 'Log saved to Notion successfully!' });
  } catch (error) {
    console.log( error )
    console.error('Failed to save log to Notion:', error);
    res.status(500).json({ message: 'Failed to save log to Notion' });
  }
}
