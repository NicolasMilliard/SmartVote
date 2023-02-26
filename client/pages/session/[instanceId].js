import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSmartVote } from "../../context";
import { useAccount } from "wagmi";

import { getInstanceStatus } from "../../utils/instance/getInstanceStatus";
import { getWorkflowStatus } from "../../utils/instance/getWorkflowStatus";
import { getInstanceName } from "../../utils/instance/getInstanceName";

import Menu from "../../components/Layout/Menu/Menu";
import Role from "../../components/Instance/Role";
import VotingSessionDeletePopUp from "../../components/Dashboard/VotingSessionCards/VotingSessionDeletePopUp";
import Button from "../../components/Buttons/Button";
import ButtonLoader from "../../components/Buttons/ButtonLoader";
import ButtonDelete from "../../components/Buttons/ButtonDelete";
import InstanceDeleted from "../../components/Instance/InstanceDeleted";
import WorkflowStatus from "../../components/Instance/WorkflowStatus";
import InstanceName from "../../components/Instance/InstanceName";
import AddVoter from "../../components/Instance/RegisteringVoters/AddVoter";
import VoterCanAddProposals from "../../components/Instance/RegisteringVoters/VoterCanAddProposals";
import VotersList from "../../components/Instance/RegisteringVoters/VotersList";

const Instance = () => {
  const router = useRouter();
  const { instanceId } = router.query;
  const [instanceStatus, setInstanceStatus] = useState(false);
  const [workflowStatus, setWorkflowStatus] = useState(0);
  const [instanceName, setInstanceName] = useState("");
  const [deleteInstancePopUp, setDeleteInstancePopUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    state: { getVotingHandler },
  } = useSmartVote();
  const { address } = useAccount();

  // Check if instance was delete
  const handleInstanceStatus = async () => {
    setInstanceStatus(await getInstanceStatus(getVotingHandler, instanceId));
  };

  useEffect(() => {
    handleInstanceStatus();
  }, [getVotingHandler, instanceId, instanceStatus]);

  // Check the current workflow of the status
  const handleWorkflowStatus = async () => {
    setWorkflowStatus(await getWorkflowStatus(getVotingHandler, instanceId));
  };

  useEffect(() => {
    handleWorkflowStatus();
  }, [getVotingHandler, instanceId, workflowStatus]);

  // Check the current name of the instance
  const handleInstanceName = async () => {
    setInstanceName(await getInstanceName(getVotingHandler, instanceId));
  };

  useEffect(() => {
    handleInstanceName();
  }, [getVotingHandler, instanceId, instanceName]);

  // Toggle pop-up
  const togglePopUp = () => {
    setDeleteInstancePopUp(!deleteInstancePopUp);
  };

  // Start Proposal Registering
  const startProposalsRegistering = async () => {
    try {
      if (!getVotingHandler) return;
      setIsLoading(true);

      const tx = await getVotingHandler(
        instanceId
      ).startProposalsRegistration();
      await tx;
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <>
      <Menu isInstance={true} />
      <section className="my-8 sm:my-20 mx-8 md:mx-20 xl:mx-40">
        {instanceStatus ? (
          <InstanceDeleted contractAddress={instanceId} />
        ) : (
          <>
            {deleteInstancePopUp && (
              <VotingSessionDeletePopUp
                contractAddress={instanceId}
                instanceName={instanceName}
                togglePopUp={togglePopUp}
              />
            )}

            <div className="flex justify-between mb-10">
              <Role
                getVotingHandler={getVotingHandler}
                userAddress={address}
                contractAddress={instanceId}
              />
              <ButtonDelete
                text="Delete session"
                customFunction={togglePopUp}
              />
            </div>
            <section className="sm:flex gap-16">
              {/* Workflow status */}
              <div>
                <WorkflowStatus active={workflowStatus} />
              </div>
              {/* Form */}
              <div className="flex-col items-center">
                <InstanceName
                  instanceName={instanceName}
                  contractAddress={instanceId}
                />
                <AddVoter
                  getVotingHandler={getVotingHandler}
                  contractAddress={instanceId}
                />
                <VoterCanAddProposals
                  getVotingHandler={getVotingHandler}
                  contractAddress={instanceId}
                />
                <VotersList
                  getVotingHandler={getVotingHandler}
                  contractAddress={instanceId}
                />
                <div className="flex flex-col items-center mt-16">
                  {isLoading ? (
                    <ButtonLoader />
                  ) : (
                    <Button
                      text="Start Proposals Registering"
                      customFunction={startProposalsRegistering}
                    />
                  )}
                </div>
              </div>
            </section>
          </>
        )}
      </section>
    </>
  );
};

export default Instance;
