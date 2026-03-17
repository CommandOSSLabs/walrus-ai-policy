import { DAppKitProvider } from "@mysten/dapp-kit-react";
import utilsDappKit from "app/utils/utils.dapp-kit";
import React, { useEffect, type PropsWithChildren } from "react";

export default ({ children }: PropsWithChildren) => {
  // handle visible modal connect wallet
  useEffect(() => {
    void import("@mysten/dapp-kit-core/web");
  }, []);

  return (
    <DAppKitProvider dAppKit={utilsDappKit.dAppKit}>{children}</DAppKitProvider>
  );
};
