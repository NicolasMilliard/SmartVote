export const getBookmark = async (instancesListContract, contractAddress) => {
  try {
    if (!instancesListContract) return;

    const tx = await instancesListContract.getInstancesList();

    if (tx.includes(contractAddress)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};
