import { ethers } from "ethers";
import { useCallback, useEffect, useReducer } from "react";
import { useNetwork } from "wagmi";

import votingFactoryContractArtifact from "../artifacts/contracts/VotingFactory.sol/VotingFactory.json";
import votingHandlerContractArtifact from "../artifacts/contracts/VotingHandler.sol/VotingHandler.json";
import instancesListContractArtifact from "../artifacts/contracts/InstancesList.sol/InstancesList.json";

import SmartVoteContext from "./SmartVoteContext";
import { actions, initialState, reducer } from "./state";

const loadContract = (address, abi) => {
  let contract = undefined;
  try {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      contract = new ethers.Contract(address, abi, signer);
    } else {
      console.log("Ethereum object does not exists!");
    }
  } catch (error) {
    console.log("Contract error:" + error);
  }
  return contract;
};

const SmartVoteProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { chain } = useNetwork();

  // Load VotingFactory and InstancesList SC
  const init = useCallback(() => {
    let votingFactoryContract;
    let instancesListContract;

    if (!chain) return;

    if (chain.name === "Localhost") {
      // VotingFactory
      votingFactoryContract = loadContract(
        process.env.VOTING_FACTORY_LOCALHOST,
        votingFactoryContractArtifact.abi
      );
      // InstancesList
      instancesListContract = loadContract(
        process.env.INSTANCES_LIST_LOCALHOST,
        instancesListContractArtifact.abi
      );
    } else {
      // VotingFactory
      votingFactoryContract = loadContract(
        process.env.VOTING_FACTORY_MUMBAI,
        votingFactoryContractArtifact.abi
      );
      // InstancesList
      instancesListContract = loadContract(
        process.env.INSTANCES_LIST_MUMBAI,
        instancesListContractArtifact.abi
      );
    }

    try {
      // Voting handler
      const getVotingHandler = (address) => {
        return loadContract(address, votingHandlerContractArtifact.abi);
      };

      dispatch({
        type: actions.INIT,
        data: {
          votingFactoryContract: votingFactoryContract,
          instancesListContract: instancesListContract,
          getVotingHandler: getVotingHandler,
        },
      });
    } catch (error) {
      console.log("Could not load the SC.");
    }
  }, []);

  /*  Call the init callback
      Reload SC if chain has changed
  */
  useEffect(() => {
    const tryInit = async () => {
      try {
        init();
      } catch (error) {
        console.log(error);
      }
    };

    tryInit();
  }, [init, chain]);

  return (
    <SmartVoteContext.Provider value={{ state, dispatch }}>
      {props.children}
    </SmartVoteContext.Provider>
  );
};

export default SmartVoteProvider;
