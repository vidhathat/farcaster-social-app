import "@/styles/globals.css";
import type { AppProps } from "next/app";
import '@farcaster/auth-kit/styles.css';
import { AuthKitProvider } from '@farcaster/auth-kit';

const config = {
  rpcUrl: 'https://mainnet.optimism.io',
  domain: 'sixpence.xyz',
  siweUri: 'https://sixpence.xyz/login',
};

function App({ Component, pageProps }: AppProps) {
  return (
    <AuthKitProvider config={config}>
      <Component {...pageProps} />
    </AuthKitProvider>
  );
}

export default App;
