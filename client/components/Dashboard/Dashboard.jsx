import CreateClone from "./CreateClone";

const Dashboard = ({ currentAccount }) => {
  return (
    <>
      <p className="text-white">{currentAccount}</p>
      <CreateClone />
    </>
  );
};

export default Dashboard;
