import type { BcsType } from "@mysten/sui/bcs";
import { SuiGrpcClient } from "@mysten/sui/grpc";
import { getJsonRpcFullnodeUrl } from "@mysten/sui/jsonRpc";
import { Transaction } from "@mysten/sui/transactions";

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

const commandResults = async (target: string, type: BcsType<any>) => {
  const tx = new Transaction();

  tx.moveCall({
    target: `${programs.package}::${target}`,
  });

  const result = await getSuiClient.simulateTransaction({
    transaction: tx,
    include: {
      commandResults: true,
    },
  });

  if (result.$kind === "FailedTransaction") {
    throw "request file config is failed";
  }

  return type.parse(result.commandResults[0].returnValues[0].bcs);
};

export default {
  networkConfig,
  getSuiClient,
  programs,
  commandResults,
};
