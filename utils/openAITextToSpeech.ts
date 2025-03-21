// utils/ttsOpenAI.ts
import axios from 'axios';

const TTS_OPENAI_API_KEY = process.env.NEXT_PUBLIC_TEXT_TO_SPEECH_KEY; // Add your API key to .env.local

export async function speakText(text: string, voiceId: string = 'OA001', speed: number = 1) {
  const url = 'https://api.ttsopenai.com/uapi/v1/text-to-speech';
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': TTS_OPENAI_API_KEY, // Use your API key
  };
  const data = {
    model: 'tts-1',
    voice_id: voiceId, // Default voice ID
    speed: speed, // Default speed
    input: text, // Text to synthesize
  };

  try {
    const response = await axios.post(url, data, { headers });

    if (response.data?.audio_url) {
      // Play the audio
      const audio = new Audio(response.data.audio_url);
      audio.play();
    } else {
      console.error('No audio URL received.');
    }
  } catch (error) {
    console.error('Error synthesizing speech:', error);
  }
}