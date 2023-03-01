import { useState, useEffect } from "react";
import Button from "../../../components/Buttons/Button";
import ButtonLoader from "../../../components/Buttons/ButtonLoader";
import AddProposal from "./AddProposal";
import ProposalsList from "./ProposalsList";

const ProposalsRegistration = ({
  getVotingHandler,
  contractAddress,
  userRole,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Start Voting Session
  const startVotingSession = async () => {
    try {
      if (!getVotingHandler) return;
      setIsLoading(true);

      const tx = await getVotingHandler(contractAddress).startVotingSession();
      await tx;
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <AddProposal
        getVotingHandler={getVotingHandler}
        contractAddress={contractAddress}
      />
      <ProposalsList
        getVotingHandler={getVotingHandler}
        contractAddress={contractAddress}
      />
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
    </div>
  );
};

export default ProposalsRegistration;
