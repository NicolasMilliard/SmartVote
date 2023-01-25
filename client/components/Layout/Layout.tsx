import React, { FC, ReactNode } from "react";
import ConnectWallet from "./Buttons/ConnectWallet";

export interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }: Props) => {
  return (
    <main className="w-full h-screen bg-purple-900">
      {/* <ConnectWallet /> */}
      {children}
    </main>
  );
};

export default Layout;
