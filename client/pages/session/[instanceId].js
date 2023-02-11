import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSmartVote } from "../../context";
import Button from "../../components/Buttons/Button";
import ButtonLoader from "../../components/Buttons/ButtonLoader";
import { useAccount } from "wagmi";

const Instance = () => {
  const router = useRouter();
  const { instanceId } = router.query;
  const [instanceName, setInstanceName] = useState("Bonjour");
  const {
    state: { getVotingHandler },
  } = useSmartVote();
  const { address } = useAccount();

  // Rename instance
  const renameInstance = async () => {
    try {
      if (!getVotingHandler) return;

      const contract = await getVotingHandler(instanceId);

      const tx = await contract.renameInstance(instanceName);
      await tx.wait();
    } catch (error) {
      console.log(error);
    }
  };

  // Add a voter
  const addVoter = async () => {
    try {
      if (!getVotingHandler) return;

      const contract = await getVotingHandler(instanceId);

      const tx = await contract.authorize(address);
      await tx.wait();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Button text="Rename instance" customFunction={renameInstance} />
      <Button text="Add voter" customFunction={addVoter} />
    </>
  );
};

export default Instance;
