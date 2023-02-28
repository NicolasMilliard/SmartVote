import { useState, useEffect } from "react";

const VotersList = ({ getVotingHandler, contractAddress }) => {
  const [voters, setVoters] = useState([]);

  const getVotersList = async () => {
    try {
      if (!getVotingHandler) return;

      let allEvents = [];

      const eventFilter =
        getVotingHandler(contractAddress).filters.VoterRegistered();
      const events = await getVotingHandler(contractAddress).queryFilter(
        eventFilter,
        0
      );

      // Loop through all addresses
      for (let i = 0; i < events.length; i++) {
        allEvents.push({
          id: `Voter ${i + 1}`,
          address: events[i].args[0],
        });
      }

      setVoters(allEvents);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getVotersList();
  }, [getVotingHandler, contractAddress]);
  return (
    <div className="bg-white mt-10 px-8 py-6 w-full max-w-170 shadow rounded">
      <h3 className="font-semibold text-xl mb-6">Voters addresses:</h3>
      <ul className="flex flex-col gap-4 text-gray-900">
        {voters.map((voter) => (
          <li key={voter.address}>
            {voter.id}&nbsp;: {voter.address}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VotersList;
