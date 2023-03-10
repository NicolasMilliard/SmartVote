import {
  getDefaultWallets,
  RainbowKitProvider,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { localhost, polygonMumbai, avalancheFuji } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { ToastContainer } from "react-toastify";

import Layout from "../components/Layout/Layout";
import { SmartVoteProvider } from "../context";

import "@rainbow-me/rainbowkit/styles.css";
import "react-toastify/dist/ReactToastify.css";
import "../styles/global.css";

const { chains, provider } = configureChains(
  [localhost, polygonMumbai, avalancheFuji],
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

const customAvatar = ({ ensImage, size }) => {
  return ensImage ? (
    <img
      src={ensImage}
      width={size}
      height={size}
      style={{ borderRadius: 999 }}
    />
  ) : (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#050507",
        color: "#e1e1e5",
        height: size,
        width: size,
      }}
    >
      SV
    </div>
  );
};

const App = ({ Component, pageProps }) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        modalSize="compact"
        avatar={customAvatar}
        theme={lightTheme({
          accentColor: "#050507",
          accentColorForeground: "#e1e1e5",
          borderRadius: "medium",
          fontStack: "system",
        })}
      >
        <SmartVoteProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SmartVoteProvider>
        <ToastContainer />
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default App;
