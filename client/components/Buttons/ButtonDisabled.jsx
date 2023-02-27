const ButtonDisabled = ({ text, theme }) => {
  const themeButton = (theme) => {
    switch (theme) {
      case "red":
        return (
          <div className="bg-red text-white font-bold py-4 px-6 rounded cursor-not-allowed">
            {text}
          </div>
        );
      default:
        return (
          <div className="bg-gray-900 text-white font-bold py-4 px-6 rounded cursor-not-allowed">
            {text}
          </div>
        );
    }
  };

  return <>{themeButton(theme)}</>;
};

export default ButtonDisabled;
