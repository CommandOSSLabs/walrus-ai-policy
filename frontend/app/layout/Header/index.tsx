import { useCurrentAccount } from "@mysten/dapp-kit-react";
import Center from "app/components/Center";
import Hstack from "app/components/Hstack";
import { Link } from "react-router";

export default () => {
  const currentAccount = useCurrentAccount();

  return (
    <header className="p-4 bg-black text-white">
      <Center className="justify-between">
        <Link to="/">Logo</Link>

        <Hstack>
          <Link to="/create-artifact">Create Artifact</Link>

          {currentAccount?.address ? (
            <button>Disconnect</button>
          ) : (
            <button>Connect Wallet</button>
          )}
        </Hstack>
      </Center>
    </header>
  );
};
