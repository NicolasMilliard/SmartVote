import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import Button from "../../../components/Buttons/Button";
import ButtonLoader from "../../../components/Buttons/ButtonLoader";
import AddProposal from "./AddProposal";
import ProposalsList from "./ProposalsList";

const ProposalsRegistration = ({
  getVotingHandler,
  contractAddress,
  userRole,
  userAddress,
  updateWorkflowStatus,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userCanAddProposal, setUserCanAddProposal] = useState(false);
  const [refreshProposalsList, setRefreshProposalsList] = useState(false);

  // Check if user can add proposals
  const checkVotersAllowance = async () => {
    try {
      if (!getVotingHandler) return;

      const contract = getVotingHandler(contractAddress);
      const eventFilter = contract.filters.VotersAuthorizedToAddProposals();
      const event = await contract.queryFilter(eventFilter, 0);

      if (event.length > 0) {
        setUserCanAddProposal(event[0].args[0]);
      }
    } catch (error) {
      toast.error("Please refresh the page", {
        position: "top-right",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
      });
    }
  };

  useEffect(() => {
    checkVotersAllowance();
  }, [userAddress, getVotingHandler, contractAddress, userCanAddProposal]);

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

  // Refresh proposals list when a proposal is added
  const updateProposalsList = async () => {
    setRefreshProposalsList(!refreshProposalsList);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Displays only for admin and voters who can add proposals */}
      {userCanAddProposal ||
        (userRole == 0 && (
          <AddProposal
            getVotingHandler={getVotingHandler}
            contractAddress={contractAddress}
            updateProposalsList={updateProposalsList}
          />
        ))}

      {/* Voters and admin can display proposals' list */}
      {(userRole == 0 || userRole == 1) && (
        <ProposalsList
          getVotingHandler={getVotingHandler}
          contractAddress={contractAddress}
          updateProposalsList={updateProposalsList}
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
