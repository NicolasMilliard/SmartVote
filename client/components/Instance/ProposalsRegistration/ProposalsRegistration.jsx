import AddProposal from "./AddProposal";

const ProposalsRegistration = ({ getVotingHandler, contractAddress }) => {
  return (
    <>
      <AddProposal
        getVotingHandler={getVotingHandler}
        contractAddress={contractAddress}
      />
    </>
  );
};

export default ProposalsRegistration;
