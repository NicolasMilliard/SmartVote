export const getWorkflowStatus = async (getVotingHandler, contractAddress) => {
  const workflowStatus = [
    "Registering Voters",
    "Proposals Registration Started",
    "Proposals Registration Ended",
    "Voting Session Started",
    "Voting Session Ended",
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
