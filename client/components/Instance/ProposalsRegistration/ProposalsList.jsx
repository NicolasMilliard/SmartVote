import { useState, useEffect } from "react";

const ProposalsList = ({ getVotingHandler, contractAddress }) => {
  const [proposals, setProposals] = useState([]);

  const getProposalsList = async () => {
    try {
      if (!getVotingHandler) return;

      let allProposals = [];

      const contract = getVotingHandler(contractAddress);
      const tx = await contract.displayProposals();

      // Loop through all proposals
      for (let i = 0; i < tx.length; i++) {
        allProposals.push({
          id: i,
          description: tx[i][0],
        });
      }
      setProposals(allProposals);
    } catch (error) {
      console.log(error);
    }
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
