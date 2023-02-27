export const votersCanAddProposals = async (
  getVotingHandler,
  contractAddress,
  setAllowed,
  allowed
) => {
  try {
    if (!getVotingHandler) return;

    // Update checked status
    setAllowed(!allowed);

    const tx = await getVotingHandler(
      contractAddress
    ).authorizeVotersToAddProposals(!allowed);
    await tx;
  } catch (error) {
    // Reset checked status
    setAllowed(!allowed);
    console.log(error);
  }
};
