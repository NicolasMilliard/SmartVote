import { useState, useEffect } from "react";
import ProposalsListVote from "./ProposalsListVote";
import VotersStatus from "./VotersStatus";
import Button from "../../Buttons/Button";
import ButtonLoader from "../../Buttons/ButtonLoader";

const VotingSession = ({ getVotingHandler, contractAddress }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Tally Votes
  const tallyVotes = async () => {
    try {
      if (!getVotingHandler) return;
      setIsLoading(true);

      const tx = await getVotingHandler(contractAddress).startTallySession();
      await tx;
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <ProposalsListVote
        getVotingHandler={getVotingHandler}
        contractAddress={contractAddress}
      />
      <VotersStatus
        getVotingHandler={getVotingHandler}
        contractAddress={contractAddress}
      />
      <div className="flex flex-col items-center mt-16">
        {isLoading ? (
          <ButtonLoader />
        ) : (
          <Button text="Tally Votes" customFunction={tallyVotes} />
        )}
      </div>
    </div>
  );
};

export default VotingSession;
