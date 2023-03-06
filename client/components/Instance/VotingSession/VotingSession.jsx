import { useState } from "react";

import ProposalsListVote from "./ProposalsListVote";
import VotersStatus from "./VotersStatus";
import Button from "../../Buttons/Button";
import ButtonLoader from "../../Buttons/ButtonLoader";

const VotingSession = ({
  getVotingHandler,
  contractAddress,
  userRole,
  updateWorkflowStatus,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Tally Votes
  const tallyVotes = async () => {
    try {
      if (!getVotingHandler) return;
      setIsLoading(true);

      const contract = await getVotingHandler(contractAddress);
      const tx = await contract.startTallySession();

      // Wait for the transaction to be mined
      const provider = contract.provider;
      await provider.waitForTransaction(tx.hash);

      // Update workflow status
      updateWorkflowStatus();

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Display proposals list and vote button for the voters */}
      {userRole == 1 && (
        <ProposalsListVote
          getVotingHandler={getVotingHandler}
          contractAddress={contractAddress}
        />
      )}
      {/* Display the voters' list for the admin */}
      {userRole == 0 && (
        <>
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
        </>
      )}
      {/* Non voter get a feedback message */}
      {userRole == 2 && (
        <>
          <p>
            Unfortunately, you are not a voter. However, you can still follow
            the progress of the voting session.
          </p>
          <p className="mt-16">
            Voters are voting. The winning proposal will be available here when
            the voting session will be ended.
          </p>
        </>
      )}
    </div>
  );
};

export default VotingSession;
