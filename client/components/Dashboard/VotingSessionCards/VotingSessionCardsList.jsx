import { useState, useEffect } from "react";
import { useSmartVote } from "../../../context";
import { useAccount } from "wagmi";

import VotingSessionCard from "./VotingSessionCard";

const VotingSessionCardsList = ({ role, reloadList }) => {
  const { address } = useAccount();
  const {
    state: { votingFactoryContract, getVotingHandler, instancesListContract },
  } = useSmartVote();
  const [instances, setInstances] = useState([]);
  const [checkInstances, setCheckInstances] = useState(false);
  const zeroAddress = "0x0000000000000000000000000000000000000000";

  // Refresh instances
  const updateInstancesList = () => {
    setCheckInstances(!checkInstances);
  };

  // Get administrator instances
  const getInstancesAsAdministrator = async () => {
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
        let contract = events[i].args[1];

        // Get instance name
        const votingHandlerContract = await getVotingHandler(contract);
        const name = await votingHandlerContract.votingSessionName();

        // Check if this instance was paused
        const isPaused = await votingHandlerContract.paused();

        if (!isPaused) {
          allEvents.push({
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

  // Get voter instances
  const getInstancesAsVoter = async () => {
    try {
      if (!votingFactoryContract) return;

      // Get all instances created
      const instancesEventFilter = votingFactoryContract.filters.NewInstance();
      const instancesEvents = await votingFactoryContract.queryFilter(
        instancesEventFilter,
        0
      );

      let instancesEventsArr = [];

      for (let i = 0; i < instancesEvents.length; i++) {
        let contract = instancesEvents[i].args[1];

        // Check if address is a voter
        const votingHandlerContract = await getVotingHandler(contract);
        const votersEventFilter =
          votingHandlerContract.filters.VoterRegistered(address);
        const votersEvents = await votingHandlerContract.queryFilter(
          votersEventFilter,
          0
        );

        for (let j = 0; j < votersEvents.length; j++) {
          // Get instance name
          const name = await votingHandlerContract.votingSessionName();

          // Check if this instance was paused
          const isPaused = await votingHandlerContract.paused();

          if (!isPaused) {
            instancesEventsArr.push({
              contract: contract,
              contractName: name,
            });
          }
        }
      }
      setInstances(instancesEventsArr);
    } catch (error) {
      console.log(error);
    }
  };

  // Get non voter instances
  const getInstancesAsNonVoter = async () => {
    try {
      if (!instancesListContract) return;

      // Get all instances stored by the user
      const tx = await instancesListContract.getInstancesList();

      let allInstances = [];

      for (let i = 0; i < tx.length; i++) {
        let contract = tx[i];

        if (contract == zeroAddress) {
          i++;
        } else {
          // Get instance name
          const votingHandlerContract = await getVotingHandler(contract);
          const name = await votingHandlerContract.votingSessionName();

          // Check if this instance was paused
          const isPaused = await votingHandlerContract.paused();

          if (!isPaused) {
            allInstances.push({
              contract: contract,
              contractName: name,
            });
          }
        }
      }
      setInstances(allInstances);
    } catch (error) {
      console.log(error);
    }
  };

  // Get all instances of the connected address
  const getInstances = async () => {
    // If "Non Voter" is selected
    if (role == 2) {
      if (!instancesListContract) return;
      getInstancesAsNonVoter();
      return;
    } else {
      if (!votingFactoryContract) return;

      // If "Administrator" is selected
      if (role == 0) {
        getInstancesAsAdministrator();
        return;
      }

      // If "Voter" is selected
      if (role == 1) {
        getInstancesAsVoter();
        return;
      }
    }
  };

  useEffect(() => {
    getInstances();
  }, [role, votingFactoryContract, checkInstances, reloadList]);

  return (
    <>
      <div className="flex flex-wrap gap-10 mt-20">
        {instances.map((instance) => (
          <VotingSessionCard
            key={instance.contract}
            role={role}
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
