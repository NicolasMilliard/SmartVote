import { FC } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const ConnectWallet: FC = () => {
  return (
    <ConnectButton
      showBalance={false}
      chainStatus="none"
      accountStatus="address"
    />
  );
};

export default ConnectWallet;
