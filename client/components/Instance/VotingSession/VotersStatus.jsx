import { useState, useEffect } from "react";

const VotersStatus = ({ getVotingHandler, contractAddress }) => {
  const [voters, setVoters] = useState([]);

  const getVotersList = async () => {
    try {
      if (!getVotingHandler) return;

      let allEvents = [];

      // Get all voters addresses
      const voterRegisteredFilter =
        getVotingHandler(contractAddress).filters.VoterRegistered();
      const eventsVoterRegistered = await getVotingHandler(
        contractAddress
      ).queryFilter(voterRegisteredFilter, 0);

      // Loop through all voters addresses
      for (let i = 0; i < eventsVoterRegistered.length; i++) {
        // Check if this address have voted
        const votedFilter = getVotingHandler(contractAddress).filters.Voted(
          eventsVoterRegistered[i].args[0]
        );
        const eventsVoted = await getVotingHandler(contractAddress).queryFilter(
          votedFilter,
          0
        );

        // Store the details of the voter in the array
        if (eventsVoted.length > 0) {
          allEvents.push({
            address: eventsVoterRegistered[i].args[0],
            hasVoted: true,
          });
        } else {
          allEvents.push({
            address: eventsVoterRegistered[i].args[0],
            hasVoted: false,
          });
        }
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
      <h3 className="font-semibold text-xl mb-6">Voters status:</h3>
      <ul className={`flex flex-col gap-4`}>
        {voters.map((voter) => (
          <li
            key={voter.address}
            className={`${
              voter.hasVoted == true
                ? "text-gray-500"
                : "text-gray-900 font-semibold"
            }`}
          >
            {voter.address}{" "}
            {voter.hasVoted == true ? "has voted" : "has not voted yet"}.
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VotersStatus;
