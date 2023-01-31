const Button = ({ text, customFunction }) => {
  return (
    <button
      type="button"
      onClick={customFunction}
      className="bg-black text-white font-bold py-4 px-6 rounded"
    >
      {text}
    </button>
  );
};

export default Button;
