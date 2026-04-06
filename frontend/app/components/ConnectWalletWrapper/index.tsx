import type { HTMLAttributes, PropsWithChildren } from "react";
import React, { lazy, useEffect, useState } from "react";

const ConnectModal = lazy(() =>
  import("@mysten/dapp-kit-react/ui").then((module) => {
    return { default: module.ConnectModal };
  }),
);

import { useCurrentAccount } from "@mysten/dapp-kit-react";
import { isEnokiWallet } from "@mysten/enoki";

export default ({
  children,
  ...rest
}: PropsWithChildren & HTMLAttributes<HTMLDivElement>) => {
  const currentAccount = useCurrentAccount();

  const [isClient, setIsClient] = useState(false);
  const [open, setOpen] = useState(false);

  if (!currentAccount?.address?.length && typeof window !== "undefined") {
    children = React.cloneElement<HTMLAttributes<HTMLDivElement>>(
      children as never,
      {
        ...rest,
        onClick: (event) => {
          if (rest?.onClick) rest.onClick(event);

          event.stopPropagation();
          event.preventDefault();

          setOpen((prev) => !prev);
        },
      },
    );
  }

  // handle render modal in client-only
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {children}

      {isClient && open && (
        <ConnectModal
          className="wallet-modal-theme fixed"
          open={true}
          filterFn={(value) => {
            return isEnokiWallet(value) || value.name === "Slush";
          }}
          close={async () => {
            setOpen(false);
          }}
        />
      )}
    </>
  );
};
