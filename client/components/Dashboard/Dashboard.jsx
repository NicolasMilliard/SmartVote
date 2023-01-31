import Menu from "../Layout/Menu/Menu";
import Navbar from "../Layout/Navbar/Navbar";
import CreateClone from "./CreateClone";

const Dashboard = ({ currentAccount }) => {
  return (
    <>
      <Menu />
      <section className="my-20 mx-8 md:mx-20 xl:mx-40">
        <Navbar />
      </section>
    </>
  );
};

export default Dashboard;
