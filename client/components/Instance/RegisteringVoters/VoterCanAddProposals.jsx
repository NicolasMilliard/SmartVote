import { useState, useEffect } from "react";

import { votersCanAddProposals } from "../../../utils/instance/RegisteringVoters/voterCanAddProposals";

import ButtonLoader from "../../Buttons/ButtonLoader";

const VoterCanAddProposals = ({ getVotingHandler, contractAddress }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [allowed, setAllowed] = useState(false);

  // Get VotersAuthorizedToAddProposals event
  const getAllowedStatus = async () => {
    try {
      if (!getVotingHandler) return;

      const eventFilter =
        getVotingHandler(
          contractAddress
        ).filters.VotersAuthorizedToAddProposals();
      const events = await getVotingHandler(contractAddress).queryFilter(
        eventFilter,
        0
      );

      // Get the last value from the events
      if (events.length != 0) {
        const lastAllowedValue = events[events.length - 1].args[0];
        setAllowed(lastAllowedValue);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllowedStatus();
  }, [getVotingHandler, contractAddress]);

  // Call authorizeVotersToAddProposals onClick
  const updateAllowedStatus = async () => {
    votersCanAddProposals(
      getVotingHandler,
      contractAddress,
      setAllowed,
      allowed,
      setIsLoading
    );
  };

  return (
    <div className="flex items-center mt-10">
      {isLoading ? (
        <ButtonLoader theme="mini" />
      ) : (
        <>
          <span className="mr-6">Allow voters to add proposals</span>
          <label className="switch w-20 h-10">
            <input
              type="checkbox"
              checked={allowed}
              onChange={updateAllowedStatus}
            />
            <span className="slider round"></span>
          </label>
        </>
      )}
    </div>
  );
};

export default VoterCanAddProposals;
