import { AuthProvider } from '@/Contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import Head from 'next/head';
import '@/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        {/* Basic favicon - PNG works but ICO is better for compatibility */}
        <link rel="icon" href="/Gatherly.png" type="image/png" />
        
        {/* Alternative: If you have an ICO file, use this instead */}
        {/* <link rel="icon" href="/favicon.ico" /> */}
        
        {/* For better mobile support, add these if you have the files */}
        <link rel="apple-touch-icon" href="/Gatherly.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Default page title */}
        <title>Gatherly - Professional Video Conferencing</title>
        <meta
          name="description"
          content="Enterprise-grade video conferencing with military-level security"
        />
        <meta name="theme-color" content="#1e293b" />
      </Head>

      <Component {...pageProps} />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
    </AuthProvider>
  );
}

export default MyApp;