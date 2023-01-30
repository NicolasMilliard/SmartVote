const Button = ({ text, customFunction }) => {
  return (
    <button
      type="button"
      onClick={customFunction}
      className="font-bold py-2 px-4 rounded-xl"
    >
      {text}
    </button>
  );
};

export default Button;
