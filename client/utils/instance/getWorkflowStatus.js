export const getWorkflowStatus = async (getVotingHandler, contractAddress) => {
  const workflowStatus = [
    "Registering Voters",
    "Proposals Registration",
    "Voting Session",
    "Votes Tallied",
  ];

  try {
    if (!getVotingHandler) return;

    const contract = await getVotingHandler(contractAddress);
    const tx = await contract.votingStatus();

    return workflowStatus[tx];
  } catch (error) {
    return error;
  }
};
