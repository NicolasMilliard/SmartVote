import Menu from "../Layout/Menu/Menu";
import Navbar from "../Layout/Navbar/Navbar";
import VotingSessionCardsList from "./VotingSessionCardsList";

const Dashboard = () => {
  return (
    <>
      <Menu />
      <section className="my-20 mx-8 md:mx-20 xl:mx-40">
        <Navbar />
        <VotingSessionCardsList />
      </section>
    </>
  );
};

export default Dashboard;
