import { toast } from "react-toastify";

export const vote = async (
  getVotingHandler,
  contractAddress,
  proposalId,
  setIsLoading
) => {
  if (proposalId != null) {
    try {
      if (!getVotingHandler) return;

      setIsLoading(true);
      const contract = await getVotingHandler(contractAddress);
      const tx = await contract.vote(proposalId);

      // Wait for the transaction to be mined
      const provider = contract.provider;
      await provider.waitForTransaction(tx.hash);

      toast.success("Your vote has been recorded.", {
        position: "top-right",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
      });

      setIsLoading(false);
    } catch (error) {
      toast.error("Transaction have failed, please try again.", {
        position: "top-right",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
      });
      setIsLoading(false);
    }
  } else {
    toast.error("Please select a proposal.", {
      position: "top-right",
      autoClose: 5000,
      closeOnClick: true,
      pauseOnFocusLoss: true,
      pauseOnHover: true,
    });
  }
};
