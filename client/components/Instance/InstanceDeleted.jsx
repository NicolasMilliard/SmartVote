import Link from "next/link";

const InstanceDeleted = ({ contractAddress }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="mb-8">
        The Voting Session
        <span className="font-semibold"> {contractAddress}</span> was deleted.
      </h2>
      <Link
        href="/"
        className="flex items-center bg-black text-white font-bold py-4 px-6 rounded hover:bg-white hover:text-black outline hover:outline-black hover:outline-2 manage-button"
      >
        <span className="mr-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="manage-icon rotate-180"
          >
            <path d="M1.815.317 8.93 7.409a.736.736 0 0 1 .179.274A.928.928 0 0 1 9.16 8a.928.928 0 0 1-.053.317.736.736 0 0 1-.18.274l-7.113 7.114a1.002 1.002 0 0 1-.738.295 1.03 1.03 0 0 1-.76-.317A1.013 1.013 0 0 1 0 14.945c0-.282.106-.528.317-.74L6.522 8 .317 1.794a.99.99 0 0 1-.296-.728c0-.288.106-.538.317-.75a1.018 1.018 0 0 1 1.477.001Z" />
          </svg>
        </span>
        Return to dashboard
      </Link>
    </div>
  );
};

export default InstanceDeleted;
