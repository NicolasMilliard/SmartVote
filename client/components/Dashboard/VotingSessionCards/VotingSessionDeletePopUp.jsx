import { useState } from "react";

import Button from "../../Buttons/Button";
import ButtonLoader from "../../Buttons/ButtonLoader";

import { useSmartVote } from "../../../context";

const VotingSessionDeletePopUp = ({
  contractAddress,
  instanceName,
  togglePopUp,
  updateInstancesList,
}) => {
  const {
    state: { getVotingHandler },
  } = useSmartVote();
  const [isLoading, setIsLoading] = useState(false);

  // Delete instance
  const deleteInstance = async (contractAddress) => {
    // Pause instance
    try {
      if (!getVotingHandler) return;

      setIsLoading(true);

      const contract = await getVotingHandler(contractAddress);

      const tx = await contract.removeInstance();
      await tx.wait();

      // Toggle pop-up
      togglePopUp();
      setIsLoading(false);

      // Refresh VotingSessionCardsList component
      updateInstancesList();
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  return (
    <div>
      <div
        id="delete-popup"
        className="flex flex-col items-center rounded px-8 py-6"
      >
        <div className="flex items-center gap-8 mb-10">
          <h3 className="text-xl md:text-2xl">
            Are you sure you want to delete{" "}
            {instanceName != ""
              ? instanceName
              : `Voting Session #${contractAddress.slice(2, 6)}`}
            ?
          </h3>
          <button
            className="hidden sm:flex items-center justify-center cross-icon p-4 hover:bg-gray-500 rounded-full"
            onClick={togglePopUp}
          >
            <div></div>
            <div></div>
          </button>
        </div>
        <div className="flex gap-6">
          <button onClick={togglePopUp} className="hover:underline">
            Cancel
          </button>
          {isLoading ? (
            <ButtonLoader theme="red" />
          ) : (
            <Button
              text={
                instanceName != ""
                  ? `Delete ${instanceName}`
                  : `Delete Voting Session #${contractAddress.slice(2, 6)}`
              }
              customFunction={() => deleteInstance(contractAddress)}
              theme="red"
            />
          )}
        </div>
      </div>
      <button id="delete-popup-background" onClick={togglePopUp}></button>
    </div>
  );
};

export default VotingSessionDeletePopUp;
