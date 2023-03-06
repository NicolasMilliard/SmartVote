import { useState } from "react";

import Button from "../../../components/Buttons/Button";
import ButtonLoader from "../../../components/Buttons/ButtonLoader";
import AddProposal from "./AddProposal";
import ProposalsList from "./ProposalsList";

const ProposalsRegistration = ({
  getVotingHandler,
  contractAddress,
  userRole,
  updateWorkflowStatus,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Start Voting Session
  const startVotingSession = async () => {
    try {
      if (!getVotingHandler) return;
      setIsLoading(true);

      const contract = await getVotingHandler(contractAddress);
      const tx = await contract.startVotingSession();

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
      {/* Display add proposal textarea for voters */}
      {userRole == 1 && (
        <AddProposal
          getVotingHandler={getVotingHandler}
          contractAddress={contractAddress}
        />
      )}

      {/* Voters and admin can display proposals' list */}
      {(userRole == 0 || userRole == 1) && (
        <ProposalsList
          getVotingHandler={getVotingHandler}
          contractAddress={contractAddress}
        />
      )}
      {/* Admin can skip to the next step */}
      {userRole == 0 && (
        <div className="flex flex-col items-center mt-16">
          {isLoading ? (
            <ButtonLoader />
          ) : (
            <Button
              text="Start Voting Session"
              customFunction={startVotingSession}
            />
          )}
        </div>
      )}
      {/* Non voter get a feedback message */}
      {userRole == 2 && (
        <>
          <p>
            Unfortunately, you are not a voter. However, you can still follow
            the progress of the voting session.
          </p>
          <p className="mt-16">
            Voters are registering proposals. The winning proposal will be
            available here when the voting session will be ended.
          </p>
        </>
      )}
    </div>
  );
};

export default ProposalsRegistration;
