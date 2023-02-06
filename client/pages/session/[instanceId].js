import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSmartVote } from "../../context";
import Button from "../../components/Buttons/Button";
import ButtonLoader from "../../components/Buttons/ButtonLoader";

const Instance = () => {
  const router = useRouter();
  const { instanceId } = router.query;
  const [instanceName, setInstanceName] = useState("Bonjour");
  const {
    state: { getVotingHandler },
  } = useSmartVote();

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

  return (
    <>
      <Button text="Rename instance" customFunction={renameInstance} />
    </>
  );
};

export default Instance;
