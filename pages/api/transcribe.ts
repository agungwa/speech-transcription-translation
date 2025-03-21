// pages/api/transcribe.ts
import { NextApiRequest, NextApiResponse } from 'next';
import speech, { protos } from '@google-cloud/speech';
import { GoogleAuth } from 'google-auth-library';

// Access environment variables with type safety
const serviceAccountJson = process.env.NEXT_PUBLIC_GOOGLE_APPLICATION_CREDENTIALS;

if (!serviceAccountJson) {
  throw new Error('NEXT_PUBLIC_GOOGLE_APPLICATION_CREDENTIALS environment variable is not defined');
}

// Parse the JSON string from the environment variable
const credentials = JSON.parse(serviceAccountJson);

const auth = new GoogleAuth({
  credentials, // Use the parsed credentials
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
});

const client = new speech.SpeechClient({ auth });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
      const { audio, language } = req.body;
  
      // Validate the request body
      if (!audio || typeof audio !== 'string') {
        return res.status(400).json({ error: 'Invalid audio data' });
      }
  
      if (!language || typeof language !== 'string') {
        return res.status(400).json({ error: 'Invalid language code' });
      }
  
      // Ensure the audio data is Base64-encoded
      const isBase64 = (str: string): boolean => {
        try {
          return Buffer.from(str, 'base64').toString('base64') === str;
        } catch (err) {
          return false;
        }
      };
  
      if (!isBase64(audio)) {
        return res.status(400).json({ error: 'Audio data must be Base64-encoded' });
      }
  
      // Construct the request payload
      const request: protos.google.cloud.speech.v1.IRecognizeRequest = {
        audio: { content: audio },
        config: {
          encoding: 'LINEAR16', // Ensure this matches your audio format
          sampleRateHertz: 16000, // Ensure this matches your audio sample rate
          languageCode: language || 'en-US',
        },
      };
  
      try {
        const [response] = await client.recognize(request);
  
        if (!response.results || response.results.length === 0) {
          throw new Error('No transcription results found');
        }
  
        const transcription = response.results
          .map((result) => result.alternatives?.[0]?.transcript || '')
          .join('\n');
  
        res.status(200).json({ transcription });
      } catch (error) {
        console.error('Error transcribing audio:', error);
        res.status(500).json({ error: 'Failed to transcribe audio' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
}