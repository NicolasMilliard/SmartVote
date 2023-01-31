import { useState } from "react";
import Button from "../Buttons/Button";
import ButtonLoader from "../Buttons/ButtonLoader";

import { useSmartVote } from "../../context";

const CreateNewVotingSession = () => {
  const {
    state: { votingFactoryContract },
  } = useSmartVote();
  const [isLoading, setIsLoading] = useState(false);

  const createInstance = async () => {
    try {
      if (!votingFactoryContract) return;

      setIsLoading(true);

      const tx = await votingFactoryContract.b_A6Q();
      let wait = await tx.wait();

      // Get clone address
      const votingInstance = wait.events[2].args._contract;

      console.log("votingInstance: " + votingInstance);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <>
        {isLoading ? (
          <ButtonLoader />
        ) : (
          <Button
            text="Create a new Voting Session"
            customFunction={createInstance}
          />
        )}
      </>
    </>
  );
};

export default CreateNewVotingSession;
