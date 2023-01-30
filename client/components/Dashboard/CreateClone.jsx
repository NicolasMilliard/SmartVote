import { useState } from "react";
import Button from "../Buttons/Button";
import ButtonLoader from "../Buttons/ButtonLoader";

import { useSmartVote } from "../../context";

const CreateClone = () => {
  const {
    state: { votingFactoryContract, votingHandlerContract },
  } = useSmartVote();
  const [isLoading, setIsLoading] = useState(false);

  console.log("votingFactoryContract:" + votingFactoryContract);
  console.log("votingHandlerContract:" + votingHandlerContract);

  const createClone = async () => {
    try {
      if (!votingFactoryContract) console.log("no votingFactoryContract");

      setIsLoading(true);

      const tx = await votingFactoryContract.b_A6Q();
      let wait = await tx.wait();

      const votingInstance = wait.events[2].args._contract;

      console.log("votingInstance: " + votingInstance);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getInstances = async () => {
    try {
      if (!votingFactoryContract) console.log("no votingFactoryContract");
      setIsLoading(true);

      // Instances list details
      const eventFilter = votingFactoryContract.filters.NewInstance(
        "0x76988BCe8bc882efd9A2D0f0E530f1a5861C4256",
        null
      );
      const events = await votingFactoryContract.queryFilter(eventFilter, 0);

      let allEvents = [];

      for (let i = 0; i < events.length; i++) {
        let sender = events[i].args[0];
        let contract = events[i].args[1];

        allEvents.push({ sender: sender, contract: contract });
      }

      console.log(allEvents);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <>
        {isLoading ? (
          <ButtonLoader />
        ) : (
          <Button text="Create a clone" customFunction={createClone} />
        )}
      </>
      <>
        {isLoading ? (
          <ButtonLoader />
        ) : (
          <Button text="Console all instances" customFunction={getInstances} />
        )}
      </>
    </>
  );
};

export default CreateClone;
