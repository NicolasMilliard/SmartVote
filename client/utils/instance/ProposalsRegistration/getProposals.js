export const getProposals = async (getVotingHandler, contractAddress) => {
  try {
    let allProposals = [];

    const contract = getVotingHandler(contractAddress);
    const tx = await contract.displayProposals();

    // Loop through all proposals
    for (let i = 0; i < tx.length; i++) {
      allProposals.push({
        id: i,
        description: tx[i][0],
        voteCount: tx[i][1].toNumber(),
      });
    }
    return allProposals;
  } catch (error) {
    console.log(error);
  }
};
