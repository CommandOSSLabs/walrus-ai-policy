import { DAppKitProvider } from "@mysten/dapp-kit-react";
import utilsDappKit from "app/utils/utils.dapp-kit";
import { useEffect, type PropsWithChildren } from "react";

import { isEnokiNetwork, registerEnokiWallets } from "@mysten/enoki";
import utilsSui from "app/utils/utils.sui";

export default ({ children }: PropsWithChildren) => {
  useEffect(() => {
    if (!isEnokiNetwork(utilsSui.getSuiClient.network)) return;

    const { unregister } = registerEnokiWallets({
      apiKey: "enoki_public_968286dc9ecca630e42466a11f2edc97",
      client: utilsSui.getSuiClient.core,
      network: utilsSui.getSuiClient.network as never,
      providers: {
        google: {
          clientId:
            "472548068257-gae232tqisi84ams4miifc7kkebu9c6s.apps.googleusercontent.com",
          redirectUrl: location.origin,
        },
      },
    });

    return unregister;
  }, []);

  return (
    <DAppKitProvider dAppKit={utilsDappKit.dAppKit}>{children}</DAppKitProvider>
  );
};
