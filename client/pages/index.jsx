import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Logo from "../components/Layout/Navbar/Logo";
import ConnectWallet from "../components/Buttons/ConnectWallet";
import Dashboard from "../components/Layout/Dashboard/Dashboard";

const HomePage = () => {
  const { address } = useAccount();
  const [currentAccount, setCurrentAccount] = useState("");

  // Check if user is connected
  const checkCurrentAccount = () => {
    if (address) setCurrentAccount(address);
  };

  useEffect(() => {
    checkCurrentAccount();
  }, [currentAccount]);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      {!currentAccount ? (
        <>
          <Logo />
          <p className="text-black text-lg mt-8 mb-10">
            Connect your wallet to create, manage or join a voting session.
          </p>
          <ConnectWallet />
        </>
      ) : (
        <Dashboard currentAccount={currentAccount} />
      )}
    </div>
  );
};

export default HomePage;
