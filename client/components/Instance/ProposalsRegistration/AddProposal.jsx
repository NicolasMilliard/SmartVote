import { useState, useEffect, useRef } from "react";

import { registerProposal } from "../../../utils/instance/ProposalsRegistration/registerProposal";

import Button from "../../Buttons/Button";
import ButtonLoader from "../../Buttons/ButtonLoader";
import ButtonDisabled from "../../Buttons/ButtonDisabled";

const AddProposal = ({
  getVotingHandler,
  contractAddress,
  updateProposalsList,
}) => {
  const [proposalLength, setProposalLength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const textareaRef = useRef(null);

  // Proposal length is updated when the textarea change
  const handleTextarea = () => {
    setProposalLength(textareaRef.current.value.length);
  };

  // Call register proposal if length is correct
  const handleRegisterProposal = async () => {
    // Reset error status
    setIsError(false);
    const proposal = textareaRef.current.value;

    // Proposal length must be between 0 and 280 characters
    if (proposalLength > 0 && proposalLength < 280) {
      registerProposal(
        getVotingHandler,
        contractAddress,
        setIsLoading,
        proposal,
        updateProposalsList
      );
    } else {
      setIsError(true);
    }
  };

  // Check if the proposal length is too big when the textarea is updated
  useEffect(() => {
    if (proposalLength > 280) {
      setIsError(true);
    } else {
      setIsError(false);
    }
  }, [proposalLength]);
  return (
    <>
      <div className="flex items-center justify-between w-full max-w-170 mb-4">
        <h3 className="font-semibold text-xl">Register a new proposal</h3>
        <div>
          <span
            className={`text-lg ${
              proposalLength > 280 ? "text-red font-semibold" : ""
            }`}
          >
            {proposalLength}
          </span>
          <span>/280</span>
        </div>
      </div>
      <textarea
        className="bg-white pl-6 py-4 rounded shadow mb-8 w-full max-w-170"
        rows="3"
        ref={textareaRef}
        onChange={handleTextarea}
      ></textarea>
      {isError && (
        <span className="text-red mb-8">
          The maximum size of a proposal is 280 characters.
        </span>
      )}
      {/* Display the right button  */}
      {proposalLength > 280 ? (
        <ButtonDisabled text="Register proposal" />
      ) : (
        <>
          {isLoading ? (
            <ButtonLoader />
          ) : (
            <Button
              text="Register proposal"
              customFunction={handleRegisterProposal}
            />
          )}
        </>
      )}
    </>
  );
};

export default AddProposal;
