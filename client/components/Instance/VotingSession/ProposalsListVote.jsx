import { useState, useEffect } from "react";
import Button from "../../Buttons/Button";
import ButtonLoader from "../../Buttons/ButtonLoader";

import { vote } from "../../../utils/instance/VotingSession/Vote";

const ProposalsListVote = ({ getVotingHandler, contractAddress }) => {
  const [proposals, setProposals] = useState([]);
  const [checkedProposal, setCheckedProposal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get the list of all proposals
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

  // Store the id of the selected proposal
  const handleCheckedProposal = (event) => {
    setCheckedProposal(event.target.id);
  };

  // Vote for the selected proposal
  const handleVote = async () => {
    vote(getVotingHandler, contractAddress, checkedProposal, setIsLoading);
  };

  return (
    <div className="mt-10 w-full max-w-170">
      <form>
        <div className="bg-white px-8 py-6 shadow rounded">
          <h3 className="font-semibold text-xl mb-6">Proposals list:</h3>
          <div className="flex flex-col gap-4 text-gray-900">
            {proposals.map((proposal) => (
              <li key={proposal.id} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="proposal"
                  id={proposal.id}
                  onChange={handleCheckedProposal}
                />
                <label htmlFor={proposal.id}>{proposal.description}</label>
              </li>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center mt-8">
          {isLoading ? (
            <ButtonLoader />
          ) : (
            <Button text="Vote" customFunction={handleVote} />
          )}
        </div>
      </form>
    </div>
  );
};

export default ProposalsListVote;
