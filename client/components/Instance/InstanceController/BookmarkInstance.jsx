import { useState, useEffect } from "react";

import { getBookmark } from "../../../utils/instance/getBookmark";
import { handleBookmark } from "../../../utils/instance/handleBookmark";

import ButtonLoader from "../../Buttons/ButtonLoader";

const BookmarkInstance = (instancesList) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const instancesListContract = instancesList.instancesList;
  const contractAddress = instancesList.contractAddress;

  // Check if this voting session is bookmarked
  const checkBookmarks = async () => {
    setIsBookmarked(await getBookmark(instancesListContract, contractAddress));
  };

  useEffect(() => {
    checkBookmarks();
  }, [instancesList]);

  // Add / remove from bookmark
  const toggleBookmark = async () => {
    setIsLoading(true);
    await handleBookmark(instancesListContract, contractAddress, isBookmarked);
    checkBookmarks();
    setIsLoading(false);
  };

  return (
    <>
      {isLoading ? (
        <ButtonLoader theme="mini" />
      ) : (
        <>
          {isBookmarked == true ? (
            <button onClick={toggleBookmark}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="24"
                fill="none"
              >
                <path
                  fill="#050507"
                  fillRule="evenodd"
                  d="M2.667 0H16c1.467 0 2.667 1.2 2.667 2.667V24l-9.334-4L0 24 .013 2.667A2.663 2.663 0 0 1 2.667 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          ) : (
            <button
              className="flex items-center gap-2"
              onClick={toggleBookmark}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="24"
                fill="none"
              >
                <path
                  fill="#050507"
                  d="M16 0H2.667A2.663 2.663 0 0 0 .013 2.667L0 24l9.333-4 9.334 4V2.667C18.667 1.2 17.467 0 16 0Zm0 20-6.667-2.907L2.667 20V2.667H16V20Z"
                />
              </svg>
              <span>Add to my dashboard</span>
            </button>
          )}
        </>
      )}
    </>
  );
};

export default BookmarkInstance;
