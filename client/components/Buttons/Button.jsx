const Button = ({ text, customFunction }) => {
  return (
    <button
      type="button"
      onClick={customFunction}
      className="bg-black text-white font-bold py-4 px-6 rounded hover:bg-white hover:text-black outline hover:outline-black hover:outline-2"
    >
      {text}
    </button>
  );
};

export default Button;
