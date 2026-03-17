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

const createDappkitModal = () => {
  const element = document.createElement("mysten-dapp-kit-connect-modal");

  element.instance = dAppKit;
  element.open = true;

  document.body.append(element);

  element.addEventListener(
    "close",
    () => {
      element.remove();
    },
    {
      once: true,
    },
  );

  return element;
};

export default {
  dAppKit,
  createDappkitModal,
};
