# SmartVote: organize voting sessions on the blockchain

This project is still under development. <br><br>

## Table of Contents

1. [Project Description](#project-description)
2. [Technologies](#technologies)
3. [Installation](#installation)
4. [Smart Contract Description](#smart-contracts)

---

<a name="project-description"></a>

## Project Description

SmartVote is a multi-chains dApp which allows you to create multiple voting instances. Your voting session can be easily customizable: create closed questions, allow voters to add their own proposals, allow voters to vote multiple times...

This project is still in development and a lot of new features will be implemented!

---

<a name="technologies"></a>

## Technologies

Web 3 technologies used through the project:

- Solidity 0.8.17
- Hardhat
- Ethers.js
- Hardhat Gas Reporter
- Solidity Coverage
- OpenZeppelin Contracts
- OpenZeppelin Contracts Upgradeable
- Hardhat Upgrades
- Rainbowkit
- Wagmi

Web 2 technologies used through the project:

- Next.js
- Toastify
- TailwindCSS

---

<a name="installation"></a>

## Installation

_If you want to use public testnet blockchains Polygon Mumbai or Avalanche Fuji, you don't have to run a hardhat node and you can skip the step 3._<br />
Polygon Mumbai Faucet: [https://faucet.polygon.technology/](https://faucet.polygon.technology/)<br />
Avalanche Fuji Faucet: [https://faucet.avax.network/](https://faucet.avax.network/)

**Step 1:**

```sh
# Clone the repo
git clone https://github.com/NicolasMilliard/SmartVote.git

# Install client dependencies
cd client
npm install

# Install hardhat dependencies
cd ../hardhat
npm install
```

**Step 2:**

In `hardhat` folder, create a `.env` file and complete it. Please follow the structure present in `.env.example`.

Then, run the hardhat node:

```sh
cd hardhat
# Run the hardhat node
npx hardhat node
```

**Step 3:**

Run the following command in a new terminal:

```sh
cd hardhat
# Deploy Smart Contracts on your local blockchain
npx hardhat run scripts/deploy.js --network localhost
```

You will get the following message:

```sh
Compiled 9 Solidity files successfully
Deployer original balance: 1000.0
VotingFactory is deployed: 0x...
VotingHandler is deployed: 0x...
InstancesList is deployed: 0x...
Deployer new balance: 999.996907087692106724
```

Copy and paste these addresses in your `client/.env` file at `VOTING_FACTORY_LOCALHOST`, `VOTING_HANDLER_LOCALHOST` and `INSTANCES_LIST_LOCALHOST`.

**Step 3 bis (optionnal):**

If you want to test the dApp on Polygon Mumbai or on Avalanche Fuji, you just have to copy the appropriate Smart Contracts addresses from `client/.env.example` to your `client/.env`.

**Step 4:**

In the same terminal (your hardhat node is still running in another terminal), you can start the dApp:

```sh
cd ../client
# Start the Next.js dApp
npm run dev
```

---

<a name="smart-contracts"></a>

## Smart Contract Description

SmartVote is divided into 3 Smart Contracts:

- VotingFactory.sol: allows to create voting instances respecting the EIP-1167. Although adding an additional cost of 700 gas per transaction, EIP-1167 allows a simplification of the VotingFactory contract and a very large reduction of the deployment costs;
- VotingHandler.sol: serves as a reference to the Clones created by VotingFactory. This Smart Contract contains all the logic of the voting sessions: adding voters, adding proposals, counting votes, second round... This Smart Contract is Upgradeable to allow cloning and registration of a new contract owner. Moreover, VotingHandler is Pausable in order to propose to the users of the dApp a "removing" of a voting instance (classical removing is impossible on the Blockchain);
- InstancesList.sol: this Smart Contract acts as a bookmark and allows "Non Voters" to follow or stop following a voting instance from their dashboard.

![Minimal Proxy Contract](https://nicolasmilliard.fr/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsmart-vote-eip-1167.acade96c.png&w=1080&q=75)
