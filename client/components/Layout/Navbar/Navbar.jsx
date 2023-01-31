import { useState } from "react";
import CreateNewVotingSession from "../../Dashboard/CreateNewVotingSession";

const Navbar = () => {
  const [isActive, setIsActive] = useState(0);

  const rolesArray = [
    { id: 0, title: "Administrator" },
    { id: 1, title: "Voter" },
    { id: 2, title: "Non Voter" },
  ];

  const handleClick = (id) => {
    setIsActive(id);
  };

  return (
    <nav className="flex justify-between">
      <div className="flex gap-20">
        {rolesArray.map((role) => (
          <button
            key={role.id}
            onClick={() => handleClick(role.id)}
            className={
              role.id === isActive
                ? "font-bold text-black text-2xl role-active"
                : "font-bold text-gray-900 hover:text-black text-2xl"
            }
          >
            {role.title}
          </button>
        ))}
      </div>
      <CreateNewVotingSession />
    </nav>
  );
};

export default Navbar;
