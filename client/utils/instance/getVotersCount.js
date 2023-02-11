export const getVotersCount = async (getVotingHandler, contractAddress) => {
  try {
    if (!getVotingHandler) return;

    const contract = await getVotingHandler(contractAddress);
    // Get all voters registered
    const eventFilter = contract.filters.VoterRegistered();
    const events = await contract.queryFilter(eventFilter, 0);

    return events.length;
  } catch (error) {
    return error;
  }
};
