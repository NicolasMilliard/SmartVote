const ButtonLoader = () => {
  return (
    <div className="font-bold py-2 px-4 rounded-xl cursor-not-allowed">
      <span className="flex items-center">
        <span className="spin-loader"></span>Loading...
      </span>
    </div>
  );
};

export default ButtonLoader;
