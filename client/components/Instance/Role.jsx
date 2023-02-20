import { useEffect, useState } from "react";
import { getRole } from "../../utils/instance/getRole";

const Role = ({ getVotingHandler, userAddress, contractAddress }) => {
  const [userRole, setUserRole] = useState(3);
  const rolesArray = ["Administrator", "Voter", "Non Voter"];
  // Get user role of this instance
  const handleRole = async () => {
    setUserRole(await getRole(getVotingHandler, userAddress, contractAddress));
  };

  useEffect(() => {
    handleRole();
  }, [getVotingHandler, userAddress, contractAddress]);

  return (
    <span className="font-bold text-black text-xl sm:text-2xl role-active">
      {rolesArray[userRole]}
    </span>
  );
};

export default Role;
