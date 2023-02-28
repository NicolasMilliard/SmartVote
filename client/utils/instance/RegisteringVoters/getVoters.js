export const getVoters = async (getVotingHandler, contractAddress) => {
  try {
    if (!getVotingHandler) return;

    let allEvents = [];

    const eventFilter =
      getVotingHandler(contractAddress).filters.VoterRegistered();
    const events = await getVotingHandler(contractAddress).queryFilter(
      eventFilter,
      0
    );

    // Loop through all addresses
    for (let i = 0; i < events.length; i++) {
      allEvents.push({
        id: `Voter ${i + 1}`,
        address: events[i].args[0],
      });
    }

    return allEvents;
  } catch (error) {
    console.log(error);
  }
};
