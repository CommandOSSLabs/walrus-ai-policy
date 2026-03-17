import { createDAppKit } from "@mysten/dapp-kit-core";
import { SuiGrpcClient } from "@mysten/sui/grpc";
import utilsSui from "./utils.sui";

const dAppKit = createDAppKit({
  networks: ["testnet", "mainnet"],

  defaultNetwork: "testnet",

  createClient(network) {
    return new SuiGrpcClient({
      network,
      baseUrl: utilsSui.networkConfig[network].url,
    });
  },
});

// global type registration necessary for the hooks to work correctly
declare module "@mysten/dapp-kit-react" {
  interface Register {
    dAppKit: typeof dAppKit;
  }
}

export default {
  dAppKit,
};
