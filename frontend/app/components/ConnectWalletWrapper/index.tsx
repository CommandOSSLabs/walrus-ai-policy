import type { HTMLAttributes, PropsWithChildren } from "react";
import React from "react";

import { useCurrentAccount } from "@mysten/dapp-kit-react";
import utilsDappKit from "app/utils/utils.dapp-kit";

export default ({
  children,
  ...rest
}: PropsWithChildren & HTMLAttributes<HTMLDivElement>) => {
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

          utilsDappKit.createDappkitModal();
        },
      },
    );
  }

  return children;
};
