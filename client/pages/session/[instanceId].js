import { useRouter } from "next/router";

const Instance = () => {
  const router = useRouter();
  const { instanceId } = router.query;

  return <p>Instance: {instanceId}</p>;
};

export default Instance;
