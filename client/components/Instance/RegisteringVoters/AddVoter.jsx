import { useState } from "react";
import { toast } from "react-toastify";

import Button from "../../Buttons/Button";
import ButtonLoader from "../../Buttons/ButtonLoader";

import { authorizeVoter } from "../../../utils/instance/RegisteringVoters/authorizeVoter";
import { batchAuthorizeVoters } from "../../../utils/instance/RegisteringVoters/batchAuthorizeVoters";

const AddVoter = ({ getVotingHandler, contractAddress, updateVotersList }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [textareaRows, setTextareaRows] = useState(0);
  const [textareaError, setTextareaError] = useState("");
  const [singleAddress, setSingleAddress] = useState("");
  const [multipleAddresses, setMultipleAddresses] = useState([]);

  // Check if the value is an Ethereum address or multiple Ethereum addresses
  const handleAddVoter = (e) => {
    let textareaValue = e.target.value;

    // Update textarea rows
    let nbRows = Math.round(textareaValue.length / 42) + 1;
    setTextareaRows(nbRows);

    // Test textarea value
    handleTextareaValue(textareaValue);
  };

  // Test address(es) and store them in the appropriate state
  const handleTextareaValue = (textareaValue) => {
    // Remove eventual spaces
    textareaValue = textareaValue.replace(/\s+/g, "");

    // If value is empty
    if (textareaValue.length == 0) {
      // Reset error message and states
      setTextareaError("");
      setSingleAddress("");
      setMultipleAddresses([]);
      // Return is necessary for addVoter function
      return false;
    }
    // If value contains only one address (42 characters)
    else if (textareaValue.length == 42) {
      if (isAddress(textareaValue)) {
        setTextareaError("");
        setSingleAddress(textareaValue);
        setMultipleAddresses([]);
        return true;
      } else {
        return false;
      }
    }
    // If value contains multiple addresses
    else if (textareaValue.length > 42 && textareaValue.length % 42 == 0) {
      let addressesArray = [];
      let index = 0;

      while (index < textareaValue.length) {
        addressesArray.push(textareaValue.substring(index, index + 42));
        index += 42;
      }

      setTextareaError("");
      setSingleAddress("");
      setMultipleAddresses(addressesArray);
      return true;
    } else {
      setSingleAddress("");
      setMultipleAddresses([]);
      setTextareaError("Please add only Ethereum addresses.");
      return false;
    }
  };

  // Detect if the value is an Ethereum address
  const isAddress = (address) => {
    if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return true;
    } else {
      return false;
    }
  };

  const addVoter = () => {
    setTextareaError("");
    if (singleAddress.length == 42) {
      authorizeVoter(
        getVotingHandler,
        contractAddress,
        singleAddress,
        setIsLoading,
        updateVotersList
      );
    } else if (multipleAddresses.length > 0) {
      setIsLoading(true);
      batchAuthorizeVoters(
        getVotingHandler,
        contractAddress,
        multipleAddresses,
        setIsLoading,
        updateVotersList
      );
    } else {
      toast.error("Please enter at least one address.", {
        position: "top-right",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
      });
    }
  };

  return (
    <>
      {/* Textarea Add voter */}
      <textarea
        placeholder="0x..."
        className="bg-white pl-6 py-4 rounded shadow w-full max-w-md mb-4"
        rows={textareaRows}
        onChange={handleAddVoter}
      ></textarea>
      {/* Textarea messages */}
      <div>
        <p className="text-red text-center mb-4">
          {textareaError != "" && textareaError}
        </p>
        <p className="mb-8">
          Add up to 10 voters at once. Please, add only one address per line.
        </p>
      </div>
      {isLoading ? (
        <ButtonLoader />
      ) : (
        <Button text="Add voter" customFunction={addVoter} />
      )}
    </>
  );
};

export default AddVoter;
