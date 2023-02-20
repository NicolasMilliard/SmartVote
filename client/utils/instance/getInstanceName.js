export const getInstanceName = async (getVotingHandler, contractAddress) => {
  try {
    if (!getVotingHandler) return;

    const contract = await getVotingHandler(contractAddress);
    const instanceName = await contract.votingSessionName();

    return instanceName;
  } catch (error) {
    return error;
  }
};
