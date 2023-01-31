const ButtonLoader = () => {
  return (
    <div className="bg-gray-900 text-white font-bold py-4 px-6 rounded cursor-not-allowed">
      <span className="flex items-center">
        <span className="btn-spin-loader"></span>Loading...
      </span>
    </div>
  );
};

export default ButtonLoader;
