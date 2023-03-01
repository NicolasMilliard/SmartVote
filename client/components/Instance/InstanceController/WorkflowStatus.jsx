const WorkflowStatus = ({ active }) => {
  const workflowStatus = [
    "Registering Voters",
    "Proposals Registration",
    "Voting Session",
    "Votes Tallied",
  ];

  return (
    <ul className="flex flex-wrap gap-2 text-gray-500 mb-8 sm:flex-col sm:gap-0 sm:mb-0">
      {workflowStatus.map((item) => (
        <li
          key={item}
          className={
            item === active
              ? "text-gray-900 font-semibold sm:mb-2 sm:text-lg"
              : "text-sm sm:mb-2 sm:text-base"
          }
        >
          {item === active ? `${item}` : item}
        </li>
      ))}
    </ul>
  );
};

export default WorkflowStatus;
