import React, { FC, ReactNode } from "react";
import ConnectWallet from "./Buttons/ConnectWallet";

export interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }: Props) => {
  return (
    <div>
      <main>
        <ConnectWallet />
        {children}
      </main>
    </div>
  );
};

export default Layout;
