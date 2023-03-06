import { useState, useEffect } from "react";

import { getVoters } from "../../../utils/instance/RegisteringVoters/getVoters";

const VotersList = ({
  getVotingHandler,
  contractAddress,
  userAddress,
  updateVotersList,
}) => {
  const [voters, setVoters] = useState([]);

  const getVotersList = async () => {
    setVoters(await getVoters(getVotingHandler, contractAddress));
  };

  useEffect(() => {
    getVotersList();
  }, [getVotingHandler, contractAddress, updateVotersList]);
  return (
    <div className="bg-white mt-10 px-8 py-6 w-full max-w-170 shadow rounded">
      <h3 className="font-semibold text-xl mb-6">Voters addresses:</h3>
      <ul className="flex flex-col gap-4 text-gray-900">
        {voters.map((voter) => (
          <li
            key={voter.address}
            className={`${userAddress == voter.address && "font-semibold"}`}
          >
            {voter.id}&nbsp;: {voter.address}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VotersList;
