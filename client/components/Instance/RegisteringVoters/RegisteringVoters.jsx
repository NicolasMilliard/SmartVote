import { useState } from "react";

import Button from "../../../components/Buttons/Button";
import ButtonLoader from "../../../components/Buttons/ButtonLoader";
import AddVoter from "./AddVoter";
import VoterCanAddProposals from "./VoterCanAddProposals";
import VotersList from "./VotersList";
import InstanceRoleMessage from "../InstanceController/InstanceRoleMessage";

const RegisteringVoters = ({
  getVotingHandler,
  contractAddress,
  userRole,
  userAddress,
  updateWorkflowStatus,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Start Proposal Registering
  const startProposalsRegistration = async () => {
    try {
      if (!getVotingHandler) return;
      setIsLoading(true);

      const contract = await getVotingHandler(contractAddress);
      const tx = await contract.startProposalsRegistration();

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
      {/* User role feedback */}
      {(userRole == 1 || userRole == 2) && (
        <InstanceRoleMessage role={userRole} />
      )}

      {/* If user is an administrator */}
      {userRole == 0 && (
        <>
          <AddVoter
            getVotingHandler={getVotingHandler}
            contractAddress={contractAddress}
          />
          <VoterCanAddProposals
            getVotingHandler={getVotingHandler}
            contractAddress={contractAddress}
          />
        </>
      )}
      {/* Display the voters' list */}
      <VotersList
        getVotingHandler={getVotingHandler}
        contractAddress={contractAddress}
        userAddress={userAddress}
      />
      {/* If the user is an admin, display a button to skip to the next step */}
      {userRole == 0 && (
        <div className="flex flex-col items-center mt-16">
          {isLoading ? (
            <ButtonLoader />
          ) : (
            <Button
              text="Start Proposals Registration"
              customFunction={startProposalsRegistration}
            />
          )}
        </div>
      )}
      {/* Give a feedback for the next step to the users */}
      {(userRole == 1 || userRole == 2) && (
        <p className="mt-16">
          Administrator must update the status of the voting session to
          continue.
        </p>
      )}
    </div>
  );
};

export default RegisteringVoters;
