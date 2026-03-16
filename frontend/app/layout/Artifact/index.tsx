import { useParams } from "react-router";

export default () => {
  const { blobId } = useParams();

  return (
    <>
      <p>Artifact Detail</p>

      <p>{blobId}</p>
    </>
  );
};
