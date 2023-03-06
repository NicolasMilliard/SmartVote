import { toast } from "react-toastify";

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

    const contract = await getVotingHandler(contractAddress);
    const tx = await contract.authorizeVotersToAddProposals(!allowed);

    // Wait for the transaction to be mined
    const provider = contract.provider;
    await provider.waitForTransaction(tx.hash);

    toast.success("Voters rights have been updated.", {
      position: "top-right",
      autoClose: 5000,
      closeOnClick: true,
      pauseOnFocusLoss: true,
      pauseOnHover: true,
    });
  } catch (error) {
    // Reset checked status
    setAllowed(allowed);
    toast.error("Transaction have failed, please try again.", {
      position: "top-right",
      autoClose: 5000,
      closeOnClick: true,
      pauseOnFocusLoss: true,
      pauseOnHover: true,
    });
    console.log(error);
  }
};
