import { useEffect, useState } from "react";
import Link from "next/link";

import VotingSessionDeletePopUp from "./VotingSessionDeletePopUp";
import ButtonDelete from "../../Buttons/ButtonDelete";

import { useSmartVote } from "../../../context";

const VotingSessionCard = ({
  contractAddress,
  instanceName,
  updateInstancesList,
}) => {
  const {
    state: { getVotingHandler },
  } = useSmartVote();
  const [status, setStatus] = useState("");
  const [deleteInstancePopUp, setDeleteInstancePopUp] = useState(false);

  const workflowStatus = [
    "Registering Voters",
    "Proposals Registration Started",
    "Proposals Registration Ended",
    "Voting Session Started",
    "Voting Session Ended",
    "Votes Tallied",
  ];

  // Get current status of the instance
  const getStatus = async () => {
    try {
      if (!getVotingHandler) return;

      const contract = await getVotingHandler(contractAddress);

      const tx = await contract.votingStatus();
      setStatus(workflowStatus[tx]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStatus();
  }, []);

  // Toggle pop-up
  const togglePopUp = () => {
    setDeleteInstancePopUp(!deleteInstancePopUp);
  };

  return (
    <>
      {deleteInstancePopUp && (
        <VotingSessionDeletePopUp
          contractAddress={contractAddress}
          instanceName={instanceName}
          togglePopUp={togglePopUp}
          updateInstancesList={updateInstancesList}
        />
      )}
      <div className="flex flex-col items-center px-8 py-6 rounded shadow">
        <h3 className="text-black font-bold text-4xl">
          {instanceName != ""
            ? instanceName
            : `Voting Session #${contractAddress.slice(2, 6)}`}
        </h3>
        <div className="text-gray-900 mt-4">
          Current status:
          <span className="font-bold"> {status}</span>
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
            href={`/session/${contractAddress}`}
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
