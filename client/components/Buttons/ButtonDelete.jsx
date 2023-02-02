import Image from "next/image";
import icon from "../../public/images/icons/dashboard/delete-session-icon.svg";

const ButtonDelete = ({ text }) => {
  return (
    <button className="flex items-center text-red font-bold hover:bg-gray-100 py-4 px-6 rounded">
      <span className="mr-2">
        <Image src={icon} />
      </span>
      {text}
    </button>
  );
};

export default ButtonDelete;
