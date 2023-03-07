import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Logo from "../components/Layout/Logo";
import ConnectWallet from "../components/Buttons/ConnectWallet";
import Dashboard from "../components/Dashboard/Dashboard";

const HomePage = () => {
  const { address } = useAccount();
  // Used to fix hydration error
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  });

  if (!hasMounted) return null;

  return (
    <>
      {!address ? (
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
        </>
      ) : (
        <Dashboard />
      )}
    </>
  );
};

export default HomePage;
