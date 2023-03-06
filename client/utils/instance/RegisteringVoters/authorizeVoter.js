import { toast } from "react-toastify";

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
    const tx = await contract.authorize(voterAddress);

    // Wait for the transaction to be mined
    const provider = contract.provider;
    await provider.waitForTransaction(tx.hash);

    toast.success("Voter has been added.", {
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
    return error;
  }
};
