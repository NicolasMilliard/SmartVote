import { useEffect, useState } from "react";

const InstanceName = ({ instanceName, contractAddress }) => {
  const [currentName, setCurrentName] = useState("#");

  useEffect(() => {
    if (instanceName != "") {
      setCurrentName(instanceName);
    } else {
      if (contractAddress != undefined) {
        setCurrentName(`#${contractAddress.slice(2, 6)}`);
      }
    }
  }, [instanceName, contractAddress]);

  return (
    <h1 className="text-2xl font-semibold text-center mb-16">
      {contractAddress}
    </h1>
  );
};

export default InstanceName;
