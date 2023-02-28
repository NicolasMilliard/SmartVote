export const vote = async (
  getVotingHandler,
  contractAddress,
  proposalId,
  setIsLoading
) => {
  try {
    if (!getVotingHandler) return;

    setIsLoading(true);
    const contract = await getVotingHandler(contractAddress);
    await contract.vote(proposalId);
    setIsLoading(false);
  } catch (error) {
    setIsLoading(false);
    console.log(error);
  }
};
