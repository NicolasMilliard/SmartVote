import { toast } from "react-toastify";

export const handleBookmark = async (
  instancesListContract,
  contractAddress,
  isBookmarked
) => {
  try {
    if (!instancesListContract) return;

    if (isBookmarked) {
      // Instance is bookmark, user want to remove it
      const tx = await instancesListContract.removeInstance(contractAddress);

      // Wait for the transaction to be mined
      const provider = instancesListContract.provider;
      await provider.waitForTransaction(tx.hash);

      toast.success("Your vote has been recorded.", {
        position: "top-right",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
      });
      return false;
    } else {
      // Instance is not bookmark, user want to add it
      const tx = await instancesListContract.b_A6Q(contractAddress);

      // Wait for the transaction to be mined
      const provider = instancesListContract.provider;
      await provider.waitForTransaction(tx.hash);

      toast.success("Your vote has been recorded.", {
        position: "top-right",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
      });
      return true;
    }
  } catch (error) {
    toast.error("Transaction have failed, please try again.", {
      position: "top-right",
      autoClose: 5000,
      closeOnClick: true,
      pauseOnFocusLoss: true,
      pauseOnHover: true,
    });
    return false;
  }
};
