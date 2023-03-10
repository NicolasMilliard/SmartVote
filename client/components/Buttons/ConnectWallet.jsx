import { ConnectButton } from "@rainbow-me/rainbowkit";

const ConnectWallet = () => {
  return (
    <ConnectButton
      showBalance={false}
      chainStatus="icon"
      accountStatus="address"
    />
  );
};

export default ConnectWallet;
