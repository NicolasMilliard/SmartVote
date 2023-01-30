import { useRef, useState } from "react";
import Draggable from "react-draggable";

const LatestVotingSession = ({ events }) => {
  const [elSize, setElSize] = useState(0);
  const scrollable = useRef();

  const handleDrag = () => {
    // 32 represent p-8 class (2rem or 32px)
    setElSize(scrollable.current.scrollWidth - window.innerWidth + 32);
  };

  return (
    <section className="mb-16">
      <h2 className="text-gray-900 text-2xl font-bold sm:mb-0 ml-8">
        Latest voting sessions:
      </h2>

      <Draggable
        axis="x"
        onDrag={handleDrag}
        bounds={{ left: -elSize, right: 0 }}
      >
        <div
          className="flex flex-col relative sm:flex-row whitespace-nowrap cursor-grab p-8 gap-6 sm:gap-10"
          ref={scrollable}
        >
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white drop-shadow-md rounded px-6 py-4"
            >
              <p className="font-bold">
                {event.contract.slice(0, 5)}...
                {event.contract.slice(event.contract.length - 4)}
              </p>
              <p>
                Created by: {event.from.slice(0, 5)}...
                {event.from.slice(event.from.length - 4)}
              </p>
            </div>
          ))}
        </div>
      </Draggable>
    </section>
  );
};

export default LatestVotingSession;
