export const registerProposal = async (
  getVotingHandler,
  contractAddress,
  setIsLoading,
  proposal
) => {
  try {
    if (!getVotingHandler) return;

    setIsLoading(true);
    const contract = await getVotingHandler(contractAddress);
    await contract.registerProposal(proposal);
    setIsLoading(false);
  } catch (error) {
    setIsLoading(false);
    console.log(error);
  }
};
