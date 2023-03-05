const InstanceRoleMessage = ({ role }) => {
  return (
    <>
      {role == 1 && <p>Congrats! You have been added to the voters list!</p>}
      {role == 2 && (
        <p>
          Unfortunately, you are not a voter. However, you can still follow the
          progress of the voting session.
        </p>
      )}
    </>
  );
};

export default InstanceRoleMessage;
