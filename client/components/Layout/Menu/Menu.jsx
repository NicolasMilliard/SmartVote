import Link from "next/link";
import Logo from "../Logo";
import ConnectWallet from "../../Buttons/ConnectWallet";

const Menu = ({ isInstance }) => {
  return (
    <nav
      className="py-6 md:py-9 w-full"
      style={{ boxShadow: "inset 0px 0px 16px rgba(5, 5, 7, 0.1)" }}
    >
      <div className="flex flex-col justify-center items-center md:flex-row md:justify-between mx-8 md:mx-20 xl:mx-40">
        <div className="mb-4 md:mb-0">
          {isInstance ? (
            <Link href="/" className="flex items-center hover:font-semibold">
              <span className="mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="dashboard-icon"
                >
                  <path d="M1.815.317 8.93 7.409a.736.736 0 0 1 .179.274A.928.928 0 0 1 9.16 8a.928.928 0 0 1-.053.317.736.736 0 0 1-.18.274l-7.113 7.114a1.002 1.002 0 0 1-.738.295 1.03 1.03 0 0 1-.76-.317A1.013 1.013 0 0 1 0 14.945c0-.282.106-.528.317-.74L6.522 8 .317 1.794a.99.99 0 0 1-.296-.728c0-.288.106-.538.317-.75a1.018 1.018 0 0 1 1.477.001Z" />
                </svg>
              </span>
              Return to dashboard
            </Link>
          ) : (
            <Logo />
          )}
        </div>
        <ConnectWallet />
      </div>
    </nav>
  );
};

export default Menu;
