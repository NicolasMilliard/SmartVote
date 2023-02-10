import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSmartVote } from "../../context";

import Button from "../Buttons/Button";
import ButtonDelete from "../Buttons/ButtonDelete";

const VotingSessionCard = ({ contract, instanceName, updateInstancesList }) => {
  const {
    state: { getVotingHandler },
  } = useSmartVote();
  const [deleteInstancePopUp, setDeleteInstancePopUp] = useState(false);
  const contractRef = useRef("");

  // Toggle pop-up
  const togglePopUp = () => {
    setDeleteInstancePopUp(!deleteInstancePopUp);
  };

  // Delete instance
  const deleteInstance = async (contractAddress) => {
    contractRef.current.value = contractAddress;
    console.log(contractRef.current.value);
    // Pause instance
    try {
      if (!getVotingHandler) return;

      const contract = await getVotingHandler(contractAddress);

      const tx = await contract.removeInstance();
      await tx.wait();

      // Toggle pop-up
      togglePopUp();

      // Refresh VotingSessionCardsList component
      updateInstancesList();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {deleteInstancePopUp && (
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
                  : `Voting Session #${contract.slice(2, 6)}`}
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
              <Button
                text={
                  instanceName != ""
                    ? `Delete ${instanceName}`
                    : `Delete Voting Session #${contract.slice(2, 6)}`
                }
                customFunction={() => deleteInstance(contract)}
                theme="red"
              />
            </div>
          </div>
          <button id="delete-popup-background" onClick={togglePopUp}></button>
        </div>
      )}
      <div
        className="flex flex-col items-center px-8 py-6 rounded shadow"
        ref={contractRef}
      >
        <h3 className="text-black font-bold text-4xl">
          {instanceName != ""
            ? instanceName
            : `Voting Session #${contract.slice(2, 6)}`}
        </h3>
        <div className="text-gray-900 mt-4">
          Current status:
          <span className="font-bold"> Registering Proposals</span>
        </div>
        <div className="text-black mt-8">
          <span className="font-bold">18 Voters</span> are in this voting
          session.
        </div>
        <div className="text-black mt-6">
          <span className="font-bold">16 Proposals</span> have been added so
          far.
        </div>
        <div className="flex gap-10 mt-8">
          <ButtonDelete text="Delete session" customFunction={togglePopUp} />
          <Link
            href={`/session/${contract}`}
            className="flex items-center bg-black text-white font-bold py-4 px-6 rounded hover:bg-white hover:text-black outline hover:outline-black hover:outline-2 manage-button"
          >
            Manage
            <span className="ml-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="manage-icon">
                <path d="M1.815.317 8.93 7.409a.736.736 0 0 1 .179.274A.928.928 0 0 1 9.16 8a.928.928 0 0 1-.053.317.736.736 0 0 1-.18.274l-7.113 7.114a1.002 1.002 0 0 1-.738.295 1.03 1.03 0 0 1-.76-.317A1.013 1.013 0 0 1 0 14.945c0-.282.106-.528.317-.74L6.522 8 .317 1.794a.99.99 0 0 1-.296-.728c0-.288.106-.538.317-.75a1.018 1.018 0 0 1 1.477.001Z" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default VotingSessionCard;
