import { useEffect, useState } from "react";
import ConnectWallet from "../components/Layout/Buttons/ConnectWallet";
import { useAccount } from "wagmi";

function HomePage() {
  const { address } = useAccount();
  const [currentAccount, setCurrentAccount] = useState("");

  // Check if user is connected
  const checkCurrentAccount = () => {
    if (address) {
      setCurrentAccount(address);
    } else {
      console.log(`address: ${address}`);
    }
  };

  useEffect(() => {
    checkCurrentAccount();
    console.log(currentAccount);
  }, [currentAccount]);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <h1 className="text-5xl font-bold text-orange">SmartVote!</h1>
      <p className="text-white mt-8 mb-10">
        Connect your wallet to access your dashboard.
      </p>
      <ConnectWallet />
    </div>
  );
}

export default HomePage;
