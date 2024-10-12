import "@/styles/globals.css";
import type { AppProps } from "next/app";
import '@farcaster/auth-kit/styles.css';
import { AuthKitProvider } from '@farcaster/auth-kit';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const config = {
  rpcUrl: 'https://mainnet.optimism.io',
  domain: 'sixpence.xyz',
  siweUri: 'https://sixpence.xyz/login',
};

function App({ Component, pageProps }: AppProps) {
  return (
    <AuthKitProvider config={config}>
      <Component {...pageProps} />
      <ToastContainer position="bottom-center" autoClose={3000} />
    </AuthKitProvider>
  );
}

export default App;
