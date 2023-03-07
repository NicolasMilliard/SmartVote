const ButtonLoader = ({ theme }) => {
  const themeButton = (theme) => {
    switch (theme) {
      case "mini":
        return (
          <div className="cursor-not-allowed">
            <span
              className="btn-spin-loader btn-spin-black"
              style={{ borderTopColor: "#e1e1e5" }}
            ></span>
          </div>
        );
      default:
        return (
          <div className="bg-gray-900 text-white font-bold py-4 px-6 rounded cursor-not-allowed">
            <span className="flex items-center">
              <span
                className="btn-spin-loader mr-4"
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
