import { useCurrentAccount, useDAppKit } from "@mysten/dapp-kit-react";

import Center from "app/components/Center";
import ConnectWalletWrapper from "app/components/ConnectWalletWrapper";
import Hstack from "app/components/Hstack";
import { Link } from "react-router";

export default () => {
  const currentAccount = useCurrentAccount();

  const { disconnectWallet } = useDAppKit();

  return (
    <header className="p-4 bg-black text-white">
      <Center className="justify-between">
        <Link to="/">Logo</Link>

        <Hstack>
          <Link to="/create-artifact">Create Artifact</Link>

          {currentAccount?.address ? (
            <button onClick={disconnectWallet}>Disconnect</button>
          ) : (
            <>
              <ConnectWalletWrapper>
                <button>Connect Wallet</button>
              </ConnectWalletWrapper>
            </>
          )}
        </Hstack>
      </Center>
    </header>
  );
};
