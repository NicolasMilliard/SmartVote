export const getRole = async (
  getVotingHandler,
  userAddress,
  contractAddress
) => {
  try {
    if (!getVotingHandler) return;

    const contract = await getVotingHandler(contractAddress);
    const tx = await contract.owner();

    if (tx === userAddress) {
      return 0;
    } else {
      const votersEventFilter =
        votingHandlerContract.filters.VoterRegistered(userAddress);
      const votersEvents = await votingHandlerContract.queryFilter(
        votersEventFilter,
        0
      );

      if (votersEvents === userAddress) {
        return 1;
      } else {
        return 2;
      }
    }
  } catch (error) {
    return error;
  }
};
