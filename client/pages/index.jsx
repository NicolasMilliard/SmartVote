import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Logo from "../components/Layout/Logo";
import ConnectWallet from "../components/Buttons/ConnectWallet";
import Dashboard from "../components/Dashboard/Dashboard";
import LatestVotingSession from "../components/Dashboard/LatestVotingSession";

const HomePage = () => {
  const { address } = useAccount();
  const [currentAccount, setCurrentAccount] = useState("");

  const latestEvents = [
    {
      id: 0,
      contract: "0x0EBCCF6C7b3A816ef63Ae595f6e05BF97ff4578A",
      from: "0x76988BCe8bc882efd9A2D0f0E530f1a5861C4256",
    },
    {
      id: 1,
      contract: "0x5Cf78F1864D8CcA32E9870C4c3C2aF1CcB2C33E5",
      from: "0xA87EfD15A22cDbA6A3029D9971E8ebbD9F0c6070",
    },
    {
      id: 2,
      contract: "0xE23deE69b4cD76C2E81F1F61d2e6CfD63Afbf560",
      from: "0x5860cCdd33961b6A25A6e9A987f6635bC1E6f452",
    },
    {
      id: 3,
      contract: "0xBFb7fFf26E81398aA3c3CfD2C6737a97E737E076",
      from: "0x56f8b76eC3b4875D4884De6bAaA16f1A43c04bD7",
    },
    {
      id: 4,
      contract: "0xF3611Ae33b7AbC6A1F731Bd6bB16D7CeBc1a7f9E",
      from: "0x1716e8cB739D6a68c7f86dd71f9d19a907e5C569",
    },
    {
      id: 5,
      contract: "0x3c2A8D1f3a84e47aA7E06A4998D76Cfc9A6e09b3",
      from: "0x1aA85078Cd79A7526bF85A23Bd4A4945ddc1Ad26",
    },
    {
      id: 6,
      contract: "0x23b1c46A7a8AeED25EcE2A4A17c4A1Df0BdbF0C7",
      from: "0x8Bc1164b9d2488aF0c0e3A1A3bF1f18C90cE95C0",
    },
    {
      id: 7,
      contract: "0x9D0BbB7B8B440067b7Dd81E55FCb7C6515981Ff9",
      from: "0x7C8e5216a11E2b8085fE39e1aB5FCeC45e97bB9B",
    },
    {
      id: 8,
      contract: "0x1fBd1cE886674cA14bB9564A47a96cFaC24AfCf1",
      from: "0x79bF6f56e29A85A2b2613AEBdd7d1Dc6f44B6BfC",
    },
    {
      id: 9,
      contract: "0x056Bf7C3cC6cF7D5a97cB67A1531e5fEa7Cb2c6e",
      from: "0x5Cf78F1864D8CcA32E9870C4c3C2aF1CcB2C33E5",
    },
  ];

  // Check if user is connected
  const checkCurrentAccount = () => {
    if (address) setCurrentAccount(address);
  };

  useEffect(() => {
    checkCurrentAccount();
  }, [currentAccount]);

  return (
    <>
      {!currentAccount ? (
        <>
          <section className="flex flex-col justify-center items-center mx-8">
            <div className="mt-10 md:mt-40">
              <Logo />
            </div>
            <p className="text-black text-lg mt-8 mb-10">
              Connect your wallet to create, manage or join a voting session.
            </p>
            <div className="mb-16 md:mb-40">
              <ConnectWallet />
            </div>
          </section>
          <LatestVotingSession events={latestEvents} />
        </>
      ) : (
        <Dashboard currentAccount={currentAccount} />
      )}
    </>
  );
};

export default HomePage;
