import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSmartVote } from "../../context";
import { useAccount } from "wagmi";

import { getInstanceStatus } from "../../utils/instance/getInstanceStatus";
import { getWorkflowStatus } from "../../utils/instance/getWorkflowStatus";
import { getRole } from "../../utils/instance/getRole";
import { getInstanceName } from "../../utils/instance/getInstanceName";

import InstanceController from "../../components/Instance/InstanceController/InstanceController";

const Instance = () => {
  const router = useRouter();
  const { instanceId } = router.query;
  const [instanceStatus, setInstanceStatus] = useState(false);
  const [workflowStatus, setWorkflowStatus] = useState(0);
  const [userRole, setUserRole] = useState(2);
  const [instanceName, setInstanceName] = useState("");
  const {
    state: { getVotingHandler },
  } = useSmartVote();
  const { address } = useAccount();

  // Init instance
  const initInstance = async () => {
    setInstanceStatus(await getInstanceStatus(getVotingHandler, instanceId));
    setWorkflowStatus(await getWorkflowStatus(getVotingHandler, instanceId));
    setUserRole(await getRole(getVotingHandler, instanceId, address));
    setInstanceName(await getInstanceName(getVotingHandler, instanceId));
  };

  useEffect(() => {
    initInstance();
  }, [getVotingHandler, instanceId, address]);

  return (
    <InstanceController
      getVotingHandler={getVotingHandler}
      contractAddress={instanceId}
      userAddress={address}
      instanceStatus={instanceStatus}
      workflowStatus={workflowStatus}
      userRole={userRole}
      instanceName={instanceName}
    />
  );
};

export default Instance;
