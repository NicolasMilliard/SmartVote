import React, { FC } from "react";
import type { AppProps } from "next/app";

import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { localhost, polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

import Layout from "../components/Layout/Layout";
import { SmartVoteProvider } from "../context";

import "@rainbow-me/rainbowkit/styles.css";
import "../styles/global.css";

const { chains, provider } = configureChains(
  [localhost, polygonMumbai],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "SmartVote",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        modalSize="compact"
        theme={darkTheme({
          accentColor:
            "linear-gradient(90deg, #FCD100 0%, #FD9A0B 47.4%, #FD3920 100%);",
          accentColorForeground: "white",
        })}
      >
        <SmartVoteProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SmartVoteProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default App;
