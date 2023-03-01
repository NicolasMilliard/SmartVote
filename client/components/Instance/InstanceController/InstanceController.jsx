import { useState } from "react";
import Menu from "../../Layout/Menu/Menu";
import Role from "./Role";
import InstanceDeleted from "./InstanceDeleted";
import WorkflowStatus from "./WorkflowStatus";
import InstanceName from "./InstanceName";

import ButtonDelete from "../../Buttons/ButtonDelete";
import VotingSessionDeletePopUp from "../../Dashboard/VotingSessionCards/VotingSessionDeletePopUp";

import RegisteringVoters from "../RegisteringVoters/RegisteringVoters";
import ProposalsRegistration from "../ProposalsRegistration/ProposalsRegistration";
import VotingSession from "../VotingSession/VotingSession";
import VotesTallied from "../VotesTallied/VotesTallied";

const InstanceController = ({
  getVotingHandler,
  contractAddress,
  userAddress,
  instanceStatus,
  workflowStatus,
  userRole,
  instanceName,
}) => {
  const [deleteInstancePopUp, setDeleteInstancePopUp] = useState(false);
  // Toggle pop-up
  const togglePopUp = () => {
    setDeleteInstancePopUp(!deleteInstancePopUp);
  };
  return (
    <>
      <Menu isInstance={true} />
      <section className="my-8 sm:my-20 mx-8 md:mx-20 xl:mx-40">
        {instanceStatus ? (
          <InstanceDeleted contractAddress={contractAddress} />
        ) : (
          <>
            {userRole == 0 && deleteInstancePopUp && (
              <VotingSessionDeletePopUp
                contractAddress={contractAddress}
                instanceName={instanceName}
                togglePopUp={togglePopUp}
              />
            )}
            <div className="flex justify-between mb-10">
              <Role role={userRole} />
              {userRole == 0 && (
                <ButtonDelete
                  text="Delete session"
                  customFunction={togglePopUp}
                />
              )}
            </div>
            <section className="sm:flex gap-16">
              {/* Workflow status */}
              <div>
                <WorkflowStatus active={workflowStatus} />
              </div>
              {/* Form */}
              <div className="flex-col items-center w-full">
                <InstanceName
                  instanceName={instanceName}
                  contractAddress={contractAddress}
                />
                {/* Dashboard sections relative to WorkflowStatus */}
                {workflowStatus == "Registering Voters" && (
                  <RegisteringVoters
                    getVotingHandler={getVotingHandler}
                    contractAddress={contractAddress}
                    userRole={userRole}
                    userAddress={userAddress}
                  />
                )}
                {workflowStatus == "Proposals Registration" && (
                  <ProposalsRegistration
                    getVotingHandler={getVotingHandler}
                    contractAddress={contractAddress}
                    userRole={userRole}
                  />
                )}
                {workflowStatus == "Voting Session" && (
                  <VotingSession
                    getVotingHandler={getVotingHandler}
                    contractAddress={contractAddress}
                    userRole={userRole}
                  />
                )}
                {workflowStatus == "Votes Tallied" && (
                  <VotesTallied
                    getVotingHandler={getVotingHandler}
                    contractAddress={contractAddress}
                  />
                )}
              </div>
            </section>
          </>
        )}
      </section>
    </>
  );
};

export default InstanceController;