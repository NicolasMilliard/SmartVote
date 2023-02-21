const Button = ({ text, customFunction, theme }) => {
  const themeButton = (theme) => {
    switch (theme) {
      case "red":
        return (
          <button
            type="button"
            onClick={customFunction}
            className="bg-red text-white font-bold py-4 px-6 rounded hover:bg-white hover:text-red outline hover:outline-red hover:outline-2"
          >
            {text}
          </button>
        );
      default:
        return (
          <button
            type="button"
            onClick={customFunction}
            className="bg-black text-white font-bold py-4 px-6 rounded hover:bg-white hover:text-black outline hover:outline-black hover:outline-2"
          >
            {text}
          </button>
        );
    }
  };

  return <>{themeButton(theme)}</>;
};

export default Button;
