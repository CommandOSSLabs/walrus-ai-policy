import type { HTMLAttributes, PropsWithChildren } from "react";
import React from "react";

import {
  useCurrentAccount,
  useDAppKit,
  useWallets,
} from "@mysten/dapp-kit-react";

export default ({
  children,
  ...rest
}: PropsWithChildren & HTMLAttributes<HTMLDivElement>) => {
  const { connectWallet } = useDAppKit();

  const wallets = useWallets();
  const currentAccount = useCurrentAccount();

  if (!currentAccount?.address?.length) {
    children = React.cloneElement<HTMLAttributes<HTMLDivElement>>(
      children as never,
      {
        ...rest,
        onClick: (event) => {
          if (rest?.onClick) rest.onClick(event);

          event.stopPropagation();
          event.preventDefault();

          const wallet = wallets.find(
            (meta) => meta.name === "Sign in with Google",
          );

          if (wallet) {
            connectWallet({ wallet });
          }
        },
      },
    );
  }

  return children;
};
