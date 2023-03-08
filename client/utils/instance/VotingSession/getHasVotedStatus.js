export const getHasVotedStatus = async (
  getVotingHandler,
  contractAddress,
  userAddress
) => {
  try {
    if (!getVotingHandler) return;

    const contract = await getVotingHandler(contractAddress);
    const eventFilter = contract.filters.Voted(userAddress);
    const event = await contract.queryFilter(eventFilter, 0);

    // If a user has already voted
    if (event.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};
