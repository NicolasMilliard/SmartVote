import { ConnectButton } from "@rainbow-me/rainbowkit";

const ConnectWallet = () => {
  return (
    <ConnectButton
      showBalance={false}
      chainStatus="none"
      accountStatus="address"
    />
  );
};

export default ConnectWallet;
