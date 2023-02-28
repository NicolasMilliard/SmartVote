import { useState, useEffect } from "react";
import Link from "next/link";

import { getProposals } from "../../../utils/instance/ProposalsRegistration/getProposals";
import { getVoters } from "../../../utils/instance/RegisteringVoters/getVoters";

const VotesTallied = ({ getVotingHandler, contractAddress }) => {
  const [totalProposals, setTotalProposals] = useState(0);
  const [totalVoters, setTotalVoters] = useState(0);
  const [totalHasVoted, setTotalHasVoted] = useState(0);
  const [ratioVoters, setRatioVoters] = useState(0);
  const [winningProposal, setWinningProposal] = useState("");
  const [winnerRatio, setWinnerRatio] = useState(0);

  // Get total proposals
  const getTotalProposals = async () => {
    setTotalProposals(
      (await getProposals(getVotingHandler, contractAddress)).length
    );
  };

  // Get total voters
  const getTotalVoters = async () => {
    setTotalVoters((await getVoters(getVotingHandler, contractAddress)).length);
  };

  // Get total voters who has voted
  const getTotalHasVoted = async () => {
    const allProposals = await getProposals(getVotingHandler, contractAddress);
    let counter = 0;

    for (let i = 0; i < allProposals.length; i++) {
      counter += allProposals[i].voteCount;
    }
    setTotalHasVoted(counter);
  };

  // Get winning proposal
  const getWinningProposal = async () => {
    try {
      if (!getVotingHandler) return;

      const contract = getVotingHandler(contractAddress);
      const tx = await contract.getWinner();
      setWinningProposal(tx);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTotalProposals();
    getTotalVoters();
    getTotalHasVoted();
    getWinningProposal();
  }, [getVotingHandler, contractAddress]);

  // Get winning proposal ratio
  const getWinningProposalRatio = async () => {
    const allProposals = await getProposals(getVotingHandler, contractAddress);
    let voteCount = 0;

    // Loop through all proposals to get highest voteCount
    for (let i = 0; i < allProposals.length; i++) {
      if (allProposals[i].voteCount > voteCount) {
        voteCount = allProposals[i].voteCount;
      }
    }
    setWinnerRatio(((voteCount / totalHasVoted) * 100).toFixed(2));
  };

  useEffect(() => {
    getWinningProposalRatio();
  }, [getVotingHandler, contractAddress, totalHasVoted]);

  // Get voters ratio
  const getVotersRatio = async () => {
    if (totalVoters > 0) {
      setRatioVoters(((totalHasVoted / totalVoters) * 100).toFixed(2));
    }
  };

  useEffect(() => {
    getVotersRatio();
  }, [totalHasVoted, totalVoters]);

  return (
    <div className="flex flex-col items-center">
      <h3 className="font-semibold text-xl mb-6">Vote is complete</h3>
      <div className="bg-white px-8 py-6 w-full max-w-170 shadow rounded">
        <p className="mb-6 text-gray-900">
          Total voters:{" "}
          <span className="font-semibold text-xl">{totalHasVoted}</span>/
          {totalVoters} ({ratioVoters}%)
        </p>
        <p className="mb-6 text-gray-900">
          Total proposals:{" "}
          <span className="font-semibold">{totalProposals}</span>
        </p>
        <div>
          <p className="mb-2 text-gray-900">
            Winning proposal ({winnerRatio}%):
          </p>
          <p>{winningProposal}</p>
        </div>
      </div>
      <Link
        href="/"
        className="mt-16 bg-black text-white font-bold py-4 px-6 rounded hover:bg-white hover:text-black outline hover:outline-black hover:outline-2"
      >
        Return to dashboard
      </Link>
    </div>
  );
};

export default VotesTallied;
