const ButtonDelete = ({ text, customFunction }) => {
  return (
    <button
      className="flex items-center text-red font-bold hover:text-black py-1 pr-1 rounded delete-button"
      onClick={customFunction}
    >
      <span className="mr-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16px"
          height="18px"
          className="delete-icon"
        >
          <path d="M3 18c-.55 0-1.02-.196-1.412-.587A1.927 1.927 0 0 1 1 16V3a.97.97 0 0 1-.713-.287A.97.97 0 0 1 0 2a.97.97 0 0 1 .287-.713A.97.97 0 0 1 1 1h4c0-.283.096-.521.288-.713A.967.967 0 0 1 6 0h4a.97.97 0 0 1 .713.287A.97.97 0 0 1 11 1h4a.97.97 0 0 1 .712.287c.192.192.288.43.288.713a.968.968 0 0 1-.288.713A.967.967 0 0 1 15 3v13a1.93 1.93 0 0 1-.587 1.413A1.928 1.928 0 0 1 13 18H3Zm2-5c0 .283.096.52.288.712A.965.965 0 0 0 6 14a.968.968 0 0 0 .713-.288A.967.967 0 0 0 7 13V6a.97.97 0 0 0-.287-.713A.97.97 0 0 0 6 5a.967.967 0 0 0-.712.287A.968.968 0 0 0 5 6v7Zm4 0c0 .283.096.52.288.712A.965.965 0 0 0 10 14a.968.968 0 0 0 .713-.288A.967.967 0 0 0 11 13V6a.97.97 0 0 0-.287-.713A.97.97 0 0 0 10 5a.967.967 0 0 0-.712.287A.968.968 0 0 0 9 6v7Z" />
        </svg>
      </span>
      {text}
    </button>
  );
};

export default ButtonDelete;
