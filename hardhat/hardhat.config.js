require("@nomiclabs/hardhat-ethers");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.17",
  },
  paths: {
    sources: "./contracts",
    artifacts: "../client/artifacts",
  },
};
