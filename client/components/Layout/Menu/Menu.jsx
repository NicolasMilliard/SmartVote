import Logo from "../Logo";
import ConnectWallet from "../../Buttons/ConnectWallet";

const Menu = () => {
  return (
    <menu
      className="py-6 md:py-9 w-full"
      style={{ boxShadow: "inset 0px 0px 16px rgba(5, 5, 7, 0.1)" }}
    >
      <div className="flex flex-col justify-center items-center md:flex-row md:justify-between mx-8 md:mx-20 xl:mx-40">
        <div className="mb-4 md:mb-0">
          <Logo />
        </div>
        <ConnectWallet />
      </div>
    </menu>
  );
};

export default Menu;
