// utils/googleTextToSpeech.ts
import { TextToSpeechClient, protos } from '@google-cloud/text-to-speech';
import { promises as fs } from 'fs';
import path from 'path';
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

const client = new TextToSpeechClient();

export async function speakText(text: string, languageCode: string) {
  const request: protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
    input: { text },
    voice: { languageCode, ssmlGender: 'NEUTRAL' }, // Customize voice as needed
    audioConfig: { audioEncoding: 'MP3' },
  };

  try {
    // Explicitly type the response
    const [response] = await client.synthesizeSpeech(request)
    const audioContent = response.audioContent;

    if (audioContent) {
      // Save the audio file temporarily
      const filePath = path.join(process.cwd(), 'public', 'output.mp3');
      await fs.writeFile(filePath, audioContent, 'binary');

      // Play the audio
      const audio = new Audio('/output.mp3');
      audio.play();
    } else {
      console.error('No audio content received.');
    }
  } catch (error) {
    console.error('Error synthesizing speech:', error);
  }
}