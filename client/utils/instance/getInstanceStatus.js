export const getInstanceStatus = async (getVotingHandler, contractAddress) => {
  try {
    if (!getVotingHandler) return;

    const contract = await getVotingHandler(contractAddress);
    const isPaused = await contract.paused();

    return isPaused;
  } catch (error) {
    return error;
  }
};
