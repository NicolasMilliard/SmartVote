import CreateClone from "./CreateClone";

const Dashboard = ({ currentAccount }) => {
  return (
    <>
      <p>{currentAccount}</p>
      <CreateClone />
    </>
  );
};

export default Dashboard;
