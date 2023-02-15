# Results

**Smart Contract VotingFactory**

```sh
VotingFactory
    b_A6Q (create a new clone)
      ✔ should emit an event (49ms)
      ✔ should emit an event with the acount address
```

**Hardhat-gas-reporter**

```sh
·----------------------------|---------------------------|-------------|-----------------------------·
|    Solc version: 0.8.17    ·  Optimizer enabled: true  ·  Runs: 200  ·  Block limit: 30000000 gas  │
·····························|···························|·············|······························
|  Methods                                                                                           │
··················|··········|·············|·············|·············|···············|··············
|  Contract       ·  Method  ·  Min        ·  Max        ·  Avg        ·  # calls      ·  eur (avg)  │
··················|··········|·············|·············|·············|···············|··············
|  VotingFactory  ·  b_A6Q   ·          -  ·          -  ·     114960  ·            4  ·          -  │
··················|··········|·············|·············|·············|···············|··············
|  Deployments               ·                                         ·  % of limit   ·             │
·····························|·············|·············|·············|···············|··············
|  VotingFactory             ·          -  ·          -  ·    1873679  ·        6.2 %  ·          -  │
·----------------------------|-------------|-------------|-------------|---------------|-------------·
```

**Smart Contract VotingHandler**

```sh
VotingHandler
    Test initialize
      ✔ should set owner address during initialize (POV owner)
      ✔ should revert: try to init a second time (POV owner) (43ms)
    Remove instance
      ✔ should pause the instance (POV owner)
      ✔ should revert (POV voter1)
      ✔ should revert: already paused (POV owner)
    Rename instance
      ✔ should rename the instance (POV owner)
      ✔ should emit an event (POV owner)
      ✔ should revert (POV voter1)
      ✔ should revert: instance is paused (POV owner)
      ✔ should revert: new name is the same as the previous one (POV owner)
    Authorize
      ✔ should authorize voter1 as a voter (POV owner)
      ✔ should revert (POV voter1)
      ✔ should revert: instance is paused (POV owner)
      ✔ should revert: votingStatus is not RegisteringVoters (POV owner)
      ✔ should revert: voter1 is already registered (POV owner)
    Batch authorize
      ✔ should authorize voter1 and voter2 as voters (POV owner) (44ms)
      ✔ should revert (POV voter1)
      ✔ should revert: instance is paused (POV owner)
      ✔ should revert: votingStatus is not RegisteringVoters (POV owner)
      ✔ should revert: voter1 is already registered (POV owner)
    Authorize voters to add proposals
      ✔ should authorize all voters to add proposals (POV owner)
      ✔ should revert (POV voter1)
      ✔ should revert: instance is paused (POV owner)
      ✔ should revert: votingStatus is not RegisteringVoters (POV owner)
    Start proposals registration
      ✔ should update workflow to ProposalsRegistrationStarted
      ✔ should revert (POV voter1)
      ✔ should revert: instance is paused (POV owner)
      ✔ should revert: workflow status is already ProposalsRegistrationStarted (POV owner)
    Register a proposal
      ✔ should register a proposal (POV owner)
      ✔ should register a proposal (POV voter1)
      ✔ should revert: caller is not a voter (POV nonVoter)
      ✔ should revert: instance is paused (POV owner)
      ✔ should revert: workflow status is already ProposalsRegistrationStarted (POV owner)
      ✔ should revert: voters can not add proposals (POV voter1)
      ✔ should revert: proposal already submitted (POV owner)
    End proposals registration
      ✔ should update workflow to ProposalsRegistrationEnded
      ✔ should revert (POV voter1)
      ✔ should revert: instance is paused (POV owner)
      ✔ should revert: workflow status is already ProposalsRegistrationEnded (POV owner)
    Display all Proposals
      ✔ should return all proposals details (POV voter1 - Single proposal)
      ✔ should return all proposals details (POV voter1 - Multiple proposals)
      ✔ should revert: caller is not a voter (POV nonVoter)
      ✔ should revert: instance is paused (POV voter1)
    Start voting session
      ✔ should update workflow to VotingSessionStarted
      ✔ should revert (POV voter1)
      ✔ should revert: instance is paused (POV owner)
      ✔ should revert: workflow status is already ProposalsRegistrationEnded (POV owner)
    Vote
      ✔ should vote for a proposal
      ✔ should revert: caller is not a voter (POV nonVoter)
      ✔ should revert: already paused (POV owner)
      ✔ should revert: workflow status is not VotingSessionStarted (POV owner)
      ✔ should revert: voter has already voted once (POV voter1)
    End voting session
      ✔ should update workflow to VotingSessionEnded
      ✔ should revert (POV voter1)
      ✔ should revert: instance is paused (POV owner)
      ✔ should revert: workflow status is already VotingSessionEnded (POV owner)
    Start tally session
      ✔ should update workflow to VotesTallied
      ✔ should revert (POV voter1)
      ✔ should revert: instance is paused (POV owner)
      ✔ should revert: workflow status is already VotingSessionEnded (POV owner)
    Tally votes
      ✔ should get winner (POV owner)
      ✔ should detect an equality and store the proposals concerned (POV owner) (51ms)
      ✔ should start a second tour (POV owner) (42ms)
      ✔ should get winner after a second tour (POV owner) (81ms)
      ✔ should revert (POV voter1)
      ✔ should revert: instance is paused (POV owner)
      ✔ should revert: workflow status is not VotesTallied (POV owner)
    Get a specific vote
      ✔ should get the proposal id voted by voter1
      ✔ should revert: caller is not a voter (POV nonVoter)
      ✔ should revert: instance is paused (POV voter1)
      ✔ should revert: voter2 has not voted (POV voter1)
    Get winner
      ✔ should get winner description (POV owner)
      ✔ should revert: instance is paused (POV owner)
      ✔ should revert: workflow status is not VotesTallied (POV owner)
```

**Hardhat-gas-reporter**

```sh
·---------------------------------------------------|---------------------------|-------------|-----------------------------·
|               Solc version: 0.8.17                ·  Optimizer enabled: true  ·  Runs: 200  ·  Block limit: 30000000 gas  │
····················································|···························|·············|······························
|  Methods                                                                                                                  │
··················|·································|·············|·············|·············|···············|··············
|  Contract       ·  Method                         ·  Min        ·  Max        ·  Avg        ·  # calls      ·  eur (avg)  │
··················|·································|·············|·············|·············|···············|··············
|  VotingHandler  ·  authorize                      ·      86244  ·     103344  ·      99717  ·           33  ·          -  │
··················|·································|·············|·············|·············|···············|··············
|  VotingHandler  ·  authorizeVotersToAddProposals  ·          -  ·          -  ·      58515  ·           26  ·          -  │
··················|·································|·············|·············|·············|···············|··············
|  VotingHandler  ·  batchAuthorize                 ·          -  ·          -  ·     151620  ·            9  ·          -  │
··················|·································|·············|·············|·············|···············|··············
|  VotingHandler  ·  endProposalsRegistration       ·          -  ·          -  ·      39801  ·           34  ·          -  │
··················|·································|·············|·············|·············|···············|··············
|  VotingHandler  ·  endVotingSession               ·          -  ·          -  ·      39823  ·           15  ·          -  │
··················|·································|·············|·············|·············|···············|··············
|  VotingHandler  ·  registerProposal               ·      74823  ·      88801  ·      85437  ·           36  ·          -  │
··················|·································|·············|·············|·············|···············|··············
|  VotingHandler  ·  removeInstance                 ·          -  ·          -  ·      55311  ·           18  ·          -  │
··················|·································|·············|·············|·············|···············|··············
|  VotingHandler  ·  renameInstance                 ·          -  ·          -  ·      58127  ·            4  ·          -  │
··················|·································|·············|·············|·············|···············|··············
|  VotingHandler  ·  startProposalsRegistration     ·          -  ·          -  ·      56878  ·           47  ·          -  │
··················|·································|·············|·············|·············|···············|··············
|  VotingHandler  ·  startTallySession              ·          -  ·          -  ·      39735  ·            9  ·          -  │
··················|·································|·············|·············|·············|···············|··············
|  VotingHandler  ·  startVotingSession             ·          -  ·          -  ·      39800  ·           28  ·          -  │
··················|·································|·············|·············|·············|···············|··············
|  VotingHandler  ·  tallyVotes                     ·      92702  ·     159909  ·     131600  ·            7  ·          -  │
··················|·································|·············|·············|·············|···············|··············
|  VotingHandler  ·  vote                           ·      49375  ·      86387  ·      67752  ·           20  ·          -  │
··················|·································|·············|·············|·············|···············|··············
|  Deployments                                      ·                                         ·  % of limit   ·             │
····················································|·············|·············|·············|···············|··············
|  VotingHandler                                    ·          -  ·          -  ·    1739079  ·        5.8 %  ·          -  │
·---------------------------------------------------|-------------|-------------|-------------|---------------|-------------·
```

**Smart Contract InstancesList**

```sh
InstancesList
    b_A6Q (register an instance)
      √ should store an instance
      √ should store multiple instances
      √ should store instance after a removing
      √ should revert: instance is already store
    removeInstance
      √ should remove the first instance
      √ should remove the second instance
      √ should revert: array is empty
```

**Hardhat-gas-reporter**

```sh
·------------------------------------|---------------------------|-------------|-----------------------------·
|        Solc version: 0.8.17        ·  Optimizer enabled: true  ·  Runs: 200  ·  Block limit: 30000000 gas  │
·····································|···························|·············|······························
|  Methods                                                                                                   │
··················|··················|·············|·············|·············|···············|··············
|  Contract       ·  Method          ·  Min        ·  Max        ·  Avg        ·  # calls      ·  eur (avg)  │
··················|··················|·············|·············|·············|···············|··············
|  InstancesList  ·  b_A6Q           ·      51069  ·      67400  ·      61598  ·           10  ·          -  │
··················|··················|·············|·············|·············|···············|··············
|  InstancesList  ·  removeInstance  ·      24839  ·      27307  ·      25662  ·            3  ·          -  │
··················|··················|·············|·············|·············|···············|··············
|  Deployments                       ·                                         ·  % of limit   ·             │
·····································|·············|·············|·············|···············|··············
|  InstancesList                     ·          -  ·          -  ·     323554  ·        1.1 %  ·          -  │
·------------------------------------|-------------|-------------|-------------|---------------|-------------·
```

**Coverage**

```sh
--------------------|----------|----------|----------|----------|----------------|
File                |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
--------------------|----------|----------|----------|----------|----------------|
 contracts\         |      100 |    98.44 |      100 |      100 |                |
  InstancesList.sol |      100 |      100 |      100 |      100 |                |
  VotingFactory.sol |      100 |      100 |      100 |      100 |                |
  VotingHandler.sol |      100 |    98.25 |      100 |      100 |                |
--------------------|----------|----------|----------|----------|----------------|
All files           |      100 |    98.44 |      100 |      100 |                |
--------------------|----------|----------|----------|----------|----------------|
```

Note: VotingHandler is not tested 100% because of the modifier `whenNotPaused` on two privates functions: `checkProposals` and `getHighestVoteCount`. However, these two functions are tested within their "parent" function.
