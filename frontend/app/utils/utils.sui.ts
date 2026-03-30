import { SuiGrpcClient } from "@mysten/sui/grpc";
import { getJsonRpcFullnodeUrl } from "@mysten/sui/jsonRpc";

const networkConfig = {
  mainnet: {
    url: getJsonRpcFullnodeUrl("mainnet"),
    network: "mainnet",
    appUrl: getJsonRpcFullnodeUrl("mainnet"),
  },
  testnet: {
    url: getJsonRpcFullnodeUrl("testnet"),
    network: "testnet",
    appUrl: getJsonRpcFullnodeUrl("testnet"),
  },
};

const getSuiClient = new SuiGrpcClient({
  network: "testnet",
  baseUrl: networkConfig.testnet.url,
});

const programs = {
  package: import.meta.env.VITE_ARCHIVE_PACKAGE_ID,
};

export default {
  networkConfig,
  getSuiClient,
  programs,
};
