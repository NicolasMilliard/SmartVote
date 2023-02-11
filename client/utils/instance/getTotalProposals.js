export const getTotalProposals = async (getVotingHandler, contractAddress) => {
  try {
    if (!getVotingHandler) return;

    const contract = await getVotingHandler(contractAddress);
    // Get all proposals added
    const eventFilter = contract.filters.ProposalRegistered();
    const events = await contract.queryFilter(eventFilter, 0);

    return events.length;
  } catch (error) {
    return error;
  }
};
