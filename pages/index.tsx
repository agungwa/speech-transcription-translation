// pages/index.tsx
import Head from 'next/head';
import SpeechTranscription from '../components/SpeechTranscription';

const Home = () => {
  return (
    <div>
      <Head>
        <title>Speech Transcription App</title>
        <meta name="description" content="Speech transcription using Next.js and TypeScript" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <SpeechTranscription />
      </main>
    </div>
  );
};

export default Home;