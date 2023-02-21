export const authorizeVoter = async (
  getVotingHandler,
  contractAddress,
  voterAddress,
  setIsLoading
) => {
  try {
    if (!getVotingHandler) return;

    setIsLoading(true);
    const contract = await getVotingHandler(contractAddress);
    await contract.authorize(voterAddress);
    setIsLoading(false);
  } catch (error) {
    setIsLoading(false);
    return error;
  }
};
