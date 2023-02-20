const ButtonLoader = ({ theme }) => {
  const themeButton = (theme) => {
    switch (theme) {
      case "red":
        return (
          <div className="bg-red text-white font-bold py-4 px-6 rounded cursor-not-allowed">
            <span className="flex items-center">
              <span
                className="btn-spin-loader"
                style={{ borderTopColor: "#e84949" }}
              ></span>
              Loading...
            </span>
          </div>
        );
      case "half":
        return (
          <div className="bg-gray-900 text-white font-bold py-4 px-6 rounded-tr rounded-br cursor-not-allowed">
            <span className="flex items-center">
              <span
                className="btn-spin-loader"
                style={{ borderTopColor: "#5c5b63" }}
              ></span>
              Loading...
            </span>
          </div>
        );
      default:
        return (
          <div className="bg-gray-900 text-white font-bold py-4 px-6 rounded cursor-not-allowed">
            <span className="flex items-center">
              <span
                className="btn-spin-loader"
                style={{ borderTopColor: "#5c5b63" }}
              ></span>
              Loading...
            </span>
          </div>
        );
    }
  };

  return <>{themeButton(theme)}</>;
};

export default ButtonLoader;
