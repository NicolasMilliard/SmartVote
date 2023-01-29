import React from "react";
// import ConnectWallet from "./Buttons/ConnectWallet";

const Layout = ({ children }) => {
  return (
    <main className="w-full h-screen bg-purple-900">
      {/* <ConnectWallet /> */}
      {children}
    </main>
  );
};

export default Layout;
