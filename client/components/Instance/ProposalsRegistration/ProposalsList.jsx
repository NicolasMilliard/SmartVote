import { useState, useEffect } from "react";

import { getProposals } from "../../../utils/instance/ProposalsRegistration/getProposals";

const ProposalsList = ({ getVotingHandler, contractAddress }) => {
  const [proposals, setProposals] = useState([]);

  const getProposalsList = async () => {
    setProposals(await getProposals(getVotingHandler, contractAddress));
  };

  useEffect(() => {
    getProposalsList();
  }, [getVotingHandler, contractAddress]);

  return (
    <div className="bg-white mt-10 px-8 py-6 w-full max-w-170 shadow rounded">
      <h3 className="font-semibold text-xl mb-6">Proposals list:</h3>
      <ul className="flex flex-col gap-4 text-gray-900">
        {proposals.map((proposal) => (
          <li key={proposal.id} className="flex items-center gap-2">
            <span>{proposal.id + 1}.</span>
            <span>{proposal.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProposalsList;
