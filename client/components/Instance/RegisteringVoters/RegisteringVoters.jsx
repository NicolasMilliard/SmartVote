import { useState, useEffect } from "react";
import Button from "../../../components/Buttons/Button";
import ButtonLoader from "../../../components/Buttons/ButtonLoader";
import AddVoter from "./AddVoter";
import VoterCanAddProposals from "./VoterCanAddProposals";
import VotersList from "./VotersList";

const RegisteringVoters = ({
  getVotingHandler,
  contractAddress,
  userRole,
  userAddress,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Start Proposal Registering
  const startProposalsRegistration = async () => {
    try {
      if (!getVotingHandler) return;
      setIsLoading(true);

      const tx = await getVotingHandler(
        contractAddress
      ).startProposalsRegistration();
      await tx;
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col items-center">
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
      <VotersList
        getVotingHandler={getVotingHandler}
        contractAddress={contractAddress}
        userAddress={userAddress}
      />
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
    </div>
  );
};

export default RegisteringVoters;
