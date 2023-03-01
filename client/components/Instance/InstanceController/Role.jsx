const Role = ({ role }) => {
  const rolesArray = ["Administrator", "Voter", "Non Voter"];

  return (
    <span className="font-bold text-black text-xl sm:text-2xl role-active">
      {rolesArray[role]}
    </span>
  );
};

export default Role;
