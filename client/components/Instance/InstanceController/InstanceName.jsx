import { useEffect, useState, useRef } from "react";

import { getInstanceName } from "../../../utils/instance/getInstanceName";
import { setInstanceName } from "../../../utils/instance/setInstanceName";

const InstanceName = ({ getVotingHandler, contractAddress, userRole }) => {
  const [currentName, setCurrentName] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);
  const buttonRef = useRef(null);

  // Check if instance has a custom name
  const handleInstanceName = async () => {
    const tx = await getInstanceName(getVotingHandler, contractAddress);

    if (tx == undefined || tx.length == 0) {
      setCurrentName(contractAddress);
    } else {
      setCurrentName(await getInstanceName(getVotingHandler, contractAddress));
    }
  };

  useEffect(() => {
    handleInstanceName();
  }, [getVotingHandler, contractAddress, currentName]);

  // Update instance name
  const updateInstanceName = (event) => {
    setInputValue(event.target.value);
  };

  // Handle click outside of the input
  const handleClickOutside = async (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      // If instance name is new
      if (inputValue != "" && inputValue != currentName) {
        setCurrentName(
          await setInstanceName(getVotingHandler, contractAddress, inputValue)
        );
        setInputValue(currentName);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });

  return (
    <div className="flex justify-center">
      {isEditing && userRole == 0 ? (
        <input
          ref={inputRef}
          type="text"
          placeholder={currentName}
          autoFocus
          className="text-2xl font-semibold text-center mb-16 bg-white px-6 py-4 w-full"
          onChange={updateInstanceName}
        />
      ) : (
        <button
          ref={buttonRef}
          className="text-2xl font-semibold text-center mb-16"
          onClick={() => {
            setIsEditing(true);
          }}
        >
          {currentName}
        </button>
      )}
    </div>
  );
};

export default InstanceName;
