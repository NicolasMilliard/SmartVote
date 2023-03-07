require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-chai-matchers");
require("@openzeppelin/hardhat-upgrades");
require("solidity-coverage");
require("hardhat-gas-reporter");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./contracts",
    artifacts: "../client/artifacts",
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
      accounts: {
        mnemonic: process.env.WALLET_DEV_MNEMONIC,
        accountsBalance: "1000000000000000000000",
        count: 10,
      },
    },
    localhost: {
      chainId: 1337,
      url: "http://localhost:8545",
    },
    mumbai: {
      url: process.env.MUMBAI_ENDPOINT,
      accounts: {
        mnemonic: process.env.WALLET_DEV_MNEMONIC,
        accountsBalance: "1000000000000000000000",
        count: 10,
      },
      gas: 2100000,
      gasPrice: 8000000000,
    },
    fuji: {
      url: process.env.FUJI_ENDPOINT,
      accounts: {
        mnemonic: process.env.WALLET_DEV_MNEMONIC,
        accountsBalance: "1000000000000000000000",
        count: 10,
      },
      gas: 2100000,
      gasPrice: 225000000000,
    },
  },
};
