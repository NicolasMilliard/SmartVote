export const batchAuthorizeVoters = async (
  getVotingHandler,
  contractAddress,
  votersAddresses,
  setIsLoading
) => {
  try {
    if (!getVotingHandler) return;

    setIsLoading(true);
    const contract = await getVotingHandler(contractAddress);
    await contract.batchAuthorize(votersAddresses);
    setIsLoading(false);
  } catch (error) {
    setIsLoading(false);
    return error;
  }
};
