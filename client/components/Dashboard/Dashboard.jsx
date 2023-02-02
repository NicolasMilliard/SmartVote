import { useState } from "react";

import Menu from "../Layout/Menu/Menu";
import VotingSessionCardsList from "./VotingSessionCardsList";
import Button from "../Buttons/Button";
import ButtonLoader from "../Buttons/ButtonLoader";

import { useSmartVote } from "../../context";

const Dashboard = () => {
  const {
    state: { votingFactoryContract },
  } = useSmartVote();

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [currentRole, setCurrentRole] = useState(0);

  const rolesArray = [
    { id: 0, title: "Administrator" },
    { id: 1, title: "Voter" },
    { id: 2, title: "Non Voter" },
  ];

  const handleRole = (id) => {
    setCurrentRole(id);
  };

  const createInstance = async () => {
    try {
      if (!votingFactoryContract) return;

      setIsLoading(true);
      setIsUpdated(false);

      const tx = await votingFactoryContract.b_A6Q();
      await tx.wait();

      setIsLoading(false);
      setIsUpdated(true);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Menu />
      <section className="my-20 mx-8 md:mx-20 xl:mx-40">
        <nav className="flex justify-between">
          <div className="flex gap-20">
            {rolesArray.map((role) => (
              <button
                key={role.id}
                onClick={() => handleRole(role.id)}
                className={
                  role.id === currentRole
                    ? "font-bold text-black text-2xl role-active"
                    : "font-bold text-gray-900 hover:text-black text-2xl"
                }
              >
                {role.title}
              </button>
            ))}
          </div>
          {isLoading ? (
            <ButtonLoader />
          ) : (
            <Button
              text="Create a new Voting Session"
              customFunction={createInstance}
            />
          )}
        </nav>
        <VotingSessionCardsList role={currentRole} reloadList={isUpdated} />
      </section>
    </>
  );
};

export default Dashboard;
