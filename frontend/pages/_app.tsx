import '../styles/globals.css'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { SessionProvider } from 'next-auth/react' // allows useSession()

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  return <SessionProvider session={session}>
  <Component {...pageProps} />
</SessionProvider>;
};

export default dynamic(() => Promise.resolve(App), {
  ssr: false,
});

