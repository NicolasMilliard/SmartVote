import { useContext } from "react";
import SmartVoteContext from "./SmartVoteContext";

const useSmartVote = () => {
  const context = useContext(SmartVoteContext);
  if (context === undefined) {
    throw new Error("useSmartVote must be used within a UserProvider");
  }

  return context;
};

export default useSmartVote;
