import { useState, useEffect } from "react";
import { useSmartVote } from "../../../context";
import { useAccount } from "wagmi";

import VotingSessionCard from "./VotingSessionCard";

const VotingSessionCardsList = ({ role, reloadList }) => {
  const { address } = useAccount();
  const {
    state: { votingFactoryContract, getVotingHandler },
  } = useSmartVote();
  const [instances, setInstances] = useState([]);
  const [checkInstances, setCheckInstances] = useState(false);

  // Refresh instances
  const updateInstancesList = () => {
    setCheckInstances(!checkInstances);
  };

  // Get all instances of the connected address
  const getInstances = async () => {
    try {
      if (!votingFactoryContract) return;

      // Get all instances created
      const eventFilter = votingFactoryContract.filters.NewInstance(
        address,
        null
      );
      const events = await votingFactoryContract.queryFilter(eventFilter, 0);

      let allEvents = [];

      for (let i = 0; i < events.length; i++) {
        let sender = events[i].args[0];
        let contract = events[i].args[1];

        // Get instance name
        const votingHandlerContract = await getVotingHandler(contract);
        const name = await votingHandlerContract.votingSessionName();

        // Check if this instance was paused
        const isPaused = await votingHandlerContract.paused();

        if (!isPaused) {
          allEvents.push({
            sender: sender,
            contract: contract,
            contractName: name,
          });
        }
      }

      setInstances(allEvents);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getInstances();
  }, [votingFactoryContract, checkInstances, reloadList]);

  return (
    <>
      <div className="flex flex-wrap gap-10 mt-20">
        {instances.map((instance) => (
          <VotingSessionCard
            key={instance.contract}
            contractAddress={instance.contract}
            instanceName={instance.contractName}
            updateInstancesList={updateInstancesList}
          />
        ))}
      </div>
    </>
  );
};

export default VotingSessionCardsList;
