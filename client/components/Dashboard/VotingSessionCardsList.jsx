import { useState, useEffect } from "react";
import { useSmartVote } from "../../context";
import { useAccount } from "wagmi";

const VotingSessionCardsList = () => {
  const { address } = useAccount();
  const {
    state: { votingFactoryContract },
  } = useSmartVote();
  const [instances, setInstances] = useState([]);

  const getInstances = async () => {
    try {
      if (!votingFactoryContract) console.log("No SC");

      // Instances list address
      const eventFilter = votingFactoryContract.filters.NewInstance(
        address,
        null
      );
      const events = await votingFactoryContract.queryFilter(eventFilter, 0);

      let allEvents = [];

      for (let i = 0; i < events.length; i++) {
        let sender = events[i].args[0];
        let contract = events[i].args[1];

        allEvents.push({ sender: sender, contract: contract });
      }

      setInstances(allEvents);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getInstances();
  }, [votingFactoryContract]);

  return (
    <div className="flex gap-10">
      {instances.map((instance) => (
        <div key={instance.contract} className="px-8 py-6 rounded shadow">
          <h3 className="text-black font-bold text-4xl">
            Vote for your future
          </h3>
          <div className="text-gray-900">
            Current status:{" "}
            <span className="font-bold">Registering Proposals</span>
          </div>
          <div className="text-black">
            <span className="font-bold">18 Voters</span> are in this voting
            session.
          </div>
          <div className="text-black">
            <span className="font-bold">16 Proposals</span> have been added so
            far.
          </div>
          <div>
            <button>Delete session</button>
            <button>Manage &gt;</button>
          </div>
          {instance.contract}
        </div>
      ))}
    </div>
  );
};

export default VotingSessionCardsList;
