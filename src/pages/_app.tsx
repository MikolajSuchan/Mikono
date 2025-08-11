// src/pages/_app.tsx
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
// import Navbar from '../components/Navbar'
// If Navbar exists elsewhere, update the path accordingly, e.g.:
import Navbar from '../components/Navbar';
// Or create the Navbar component in src/components/Navbar.tsx if it doesn't exist.

function MyApp({ Component, pageProps }: AppProps) {
  const [qc] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={qc}>
      <Navbar />
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}
export default MyApp;
