import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "@farcaster/auth-kit/styles.css";
import { AuthKitProvider } from "@farcaster/auth-kit";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const config = {
  rpcUrl: "https://mainnet.optimism.io",
  domain: "sixpence.xyz",
  siweUri: "https://sixpence.xyz/login",
};

const rainbowConfig = getDefaultConfig({
  appName: "Sixpence",
  projectId: "c40b9bc5d5ee0f2aaab5927e604b4598",
  chains: [baseSepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={rainbowConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <AuthKitProvider config={config}>
            <Component {...pageProps} />
            <ToastContainer position="bottom-center" autoClose={3000} />
          </AuthKitProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
