import Center from "app/components/Center";
import { Link } from "react-router";

export default () => {
  return (
    <header className="p-4 bg-black text-white">
      <Center className="justify-between">
        <Link to="/">Logo</Link>

        <Link to="/create-artifact">Create Artifact</Link>
      </Center>
    </header>
  );
};
