import {
  getDefaultWallets,
  RainbowKitProvider,
  lightTheme,
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

const App = ({ Component, pageProps }) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        modalSize="compact"
        theme={lightTheme({
          accentColor: "#050507",
          accentColorForeground: "#e1e1e5",
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
