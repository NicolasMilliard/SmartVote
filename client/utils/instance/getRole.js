export const getRole = async (
  getVotingHandler,
  contractAddress,
  userAddress
) => {
  try {
    if (!getVotingHandler) return;

    const contract = await getVotingHandler(contractAddress);
    const tx = await contract.owner();

    // Check if the user is the admin
    if (tx == userAddress) {
      return 0;
    } else {
      const votersEventFilter = contract.filters.VoterRegistered(userAddress);
      const votersEvents = await contract.queryFilter(votersEventFilter, 0);

      // Check if the user is a voter or not
      if (votersEvents[0] == undefined) {
        return 2;
      } else if (votersEvents[0].args[0] == userAddress) {
        return 1;
      }
    }
  } catch (error) {
    return error;
  }
};
