import { useState, useEffect } from "react";

import Button from "../../components/Buttons/Button";
import ButtonLoader from "../Buttons/ButtonLoader";

const AddVoter = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [inputError, setInputError] = useState("");

  // Check if the value is an Ethereum address or multiple Ethereum addresses
  const handleAddVoter = (e) => {
    let inputValue = e.target.value;

    // If value is not empty
    if (inputValue.length > 0) {
      // Remove eventual spaces
      inputValue = inputValue.replace(/\s+/g, "");

      // Test if multiple addresses are submitted
      if (inputValue.indexOf(",") > -1) {
        let votersAddresses = inputValue.split(",");

        // Check if each address is an Ethereum address
        for (let i = 0; i < votersAddresses.length; i++) {
          if (votersAddresses[i].length > 0) {
            if (!testAddress(votersAddresses[i])) {
              // An address has an error
              setInputError(votersAddresses[i] + " is not valid.");
              break;
            }
          }
        }
      } else {
        if (!testAddress(inputValue)) {
          // The address has an error
          setInputError(inputValue + " is not valid.");
        }
      }
    } else {
      // Reset error message
      setInputError("");
    }
  };

  const testAddress = (address) => {
    if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return true;
    } else {
      return false;
    }
  };

  const addVoter = async (address) => {
    console.log(address);
  };

  return (
    <>
      <div className="flex items-center">
        <input
          placeholder="0x..."
          className="bg-white pl-6 py-4 rounded-tl rounded-bl shadow"
          onChange={handleAddVoter}
        />
        {isLoading ? (
          <ButtonLoader theme="half" />
        ) : (
          <Button
            text="Add voter"
            customFunction={handleAddVoter}
            theme="half"
          />
        )}
      </div>
      <div>
        <p>{inputError != "" && inputError}</p>
      </div>
    </>
  );
};

export default AddVoter;
