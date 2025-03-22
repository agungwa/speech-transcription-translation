// components/SpeechTranscription.tsx
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { correctGrammar } from '../utils/grammarCorrection';
import { translateText } from '../utils/translateText';
import { speakText } from '../utils/textToSpeech'; // Use Web Speech API for TTS
import { addPunctuation } from '../utils/addPunctuation';

// Mapping between transcription language and translation language
const languageMap: { [key: string]: string } = {
  'en-US': 'en', // English
  'id-ID': 'id', // Indonesian
  'zh-CN': 'zh', // Chinese
  'es-ES': 'es', // Spanish
  'fr-FR': 'fr', // French
  'de-DE': 'de', // German
  'ja-JP': 'ja', // Japanese
};

const SpeechTranscription = () => {
  const [fullTranscript, setFullTranscript] = useState<string>('');
  const [lastSegment, setLastSegment] = useState<string>('');
  const [correctedTranscript, setCorrectedTranscript] = useState<string>('');
  const [translatedTranscript, setTranslatedTranscript] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('en-US');
  const [targetLang, setTargetLang] = useState<string>('id');
  const [isAutoSpeak, setIsAutoSpeak] = useState<boolean>(true); // Toggle for automatic TTS
  const [useAIGrammar, setUseAIGrammar] = useState<boolean>(false); // Toggle for grammar correction method
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Automatically set sourceLang based on the selected language
  const sourceLang = languageMap[language] || 'en';

  // Detect if the user is on a mobile browser (only in the browser environment)
  const isMobile =
    typeof navigator !== 'undefined' &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const startListening = () => {
    // Stop any ongoing recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    // Clear all text states
    setFullTranscript('');
    setLastSegment('');
    setCorrectedTranscript('');
    setTranslatedTranscript('');

    // Clear any existing inactivity timeout
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }

    // Initialize new recognition
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = language;
    recognition.interimResults = !isMobile; // Disable interim results on mobile
    recognition.maxAlternatives = 1;
    recognition.continuous = !isMobile; // Disable continuous listening on mobile

    recognition.start();

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const results = event.results;
      const latestResult = results[results.length - 1];
      const latestTranscript = latestResult[0].transcript;

      if (!recognition.interimResults || latestResult.isFinal) {
        // Process the transcript only if interim results are not supported or it's the final result
        const punctuatedTranscript = addPunctuation(latestTranscript);
        setFullTranscript(punctuatedTranscript);
        setLastSegment('');

        // Correct the grammar of the updated transcript
        const correctedText = await correctGrammar(punctuatedTranscript, language, useAIGrammar);
        setCorrectedTranscript(correctedText);

        // Automatically translate the corrected transcript
        setIsTranslating(true);
        try {
          const translatedText = await translateText(correctedText, sourceLang, targetLang);
          setTranslatedTranscript(translatedText);

          // Automatically speak the translated text if auto-speak is enabled
          if (isAutoSpeak) {
            speakText(translatedText, targetLang);
          }
        } catch (error) {
          console.error('Translation failed:', error);
          alert('Translation failed. Please try again.');
        } finally {
          setIsTranslating(false);
        }
      } else {
        setLastSegment(latestTranscript);
      }

      // Reset the inactivity timeout
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
      inactivityTimeoutRef.current = setTimeout(() => {
        stopListening();
      }, 2000); // Stop after 2 seconds of inactivity
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onspeechend = () => {
      console.log('Speech ended, processing final transcript...');
      // Add a delay to ensure the final transcript is processed
      setTimeout(() => {
        stopListening();
      }, 1000); // Delay of 1 second before stopping
    };

    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }
  };

  const handleSpeakTranslatedText = () => {
    if (translatedTranscript) {
      speakText(translatedTranscript, targetLang); // Use Web Speech API for TTS
    } else {
      alert('No translated text to speak.');
    }
  };

  const handleClearText = () => {
    setFullTranscript('');
    setLastSegment('');
    setCorrectedTranscript('');
    setTranslatedTranscript('');
  };

  useEffect(() => {
    return () => {
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-900 animate-gradient-x">
      {/* Noise Texture */}
      <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10 pointer-events-none"></div>

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-gray-800/90 backdrop-blur-md border border-gray-700/20 rounded-xl shadow-2xl p-8 mt-20"
      >
        <h1 className="text-4xl font-bold text-center text-white mb-8">
          Speech Transcription & Translation
        </h1>

        {/* Language Selection */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-300">
              Select Language:
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={isListening}
              className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="en-US">English (US)</option>
              <option value="es-ES">Spanish (Spain)</option>
              <option value="fr-FR">French (France)</option>
              <option value="de-DE">German (Germany)</option>
              <option value="ja-JP">Japanese (Japan)</option>
              <option value="zh-CN">Chinese (China)</option>
              <option value="id-ID">Indonesian (Indonesia)</option>
            </select>
          </div>

          <div>
            <label htmlFor="targetLang" className="block text-sm font-medium text-gray-300">
              Translate To:
            </label>
            <select
              id="targetLang"
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              disabled={isTranslating}
              className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="en">English</option>
              <option value="id">Indonesian</option>
              <option value="zh">Chinese</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="ja">Japanese</option>
            </select>
          </div>
        </motion.div>

        {/* Auto-Speak Toggle */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-4 flex items-center"
        >
          <input
            type="checkbox"
            id="autoSpeak"
            checked={isAutoSpeak}
            onChange={(e) => setIsAutoSpeak(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="autoSpeak" className="ml-2 block text-sm text-gray-300">
            Automatically speak translated text
          </label>
        </motion.div>

        {/* Grammar Correction Toggle */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-4 flex items-center"
        >
          <input
            type="checkbox"
            id="useAIGrammar"
            checked={useAIGrammar}
            onChange={(e) => setUseAIGrammar(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="useAIGrammar" className="ml-2 block text-sm text-gray-300">
            Use AI (Gemini) for grammar correction
          </label>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-6 flex flex-wrap gap-4"
        >
          <button
            onClick={startListening}
            disabled={isListening}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-300 transform hover:scale-105"
          >
            {isListening ? 'Listening...' : 'Start Transcription'}
          </button>
          <button
            onClick={stopListening}
            disabled={!isListening}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 disabled:opacity-50 transition-all duration-300 transform hover:scale-105"
          >
            Stop Listening
          </button>
          <button
            onClick={handleSpeakTranslatedText}
            disabled={!translatedTranscript}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 disabled:opacity-50 transition-all duration-300 transform hover:scale-105"
          >
            Speak Translated Text
          </button>
          <button
            onClick={handleClearText}
            disabled={!fullTranscript && !correctedTranscript && !translatedTranscript}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 disabled:opacity-50 transition-all duration-300 transform hover:scale-105"
          >
            Clear Text
          </button>
        </motion.div>

        {/* Transcripts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-8 space-y-6"
        >
          <div>
            <h2 className="text-xl font-semibold text-white">Original:</h2>
            <p className="mt-2 p-4 bg-gray-700 rounded-lg text-gray-200">
              {fullTranscript} {lastSegment}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">Corrected:</h2>
            <p className="mt-2 p-4 bg-gray-700 rounded-lg text-gray-200">
              {correctedTranscript}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">Translated:</h2>
            <p className="mt-2 p-4 bg-gray-700 rounded-lg text-gray-200">
              {isTranslating ? 'Translating...' : translatedTranscript}
            </p>
          </div>
        </motion.div>

        {/* Premium Features Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mt-8 p-6 bg-gray-700/50 rounded-lg"
        >
          <h3 className="text-xl font-semibold text-white">Next Features (Coming Soon)</h3>
          <p className="mt-2 text-gray-300">
            For next feaured will add advanced text-to-speech options like:
          </p>
          <ul className="mt-2 list-disc list-inside text-gray-300">
            <li>AI Speech-to-Text (Natural-text with auto corrected)</li>
            <li>Google Text-to-Speech (Natural-sounding voices)</li>
            <li>OpenAI Text-to-Speech (High-quality AI voices)</li>
          </ul>
          <p className="mt-4 text-gray-300">Stay tuned for updates!</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SpeechTranscription;