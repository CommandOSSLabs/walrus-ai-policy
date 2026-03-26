import { walrus } from "@mysten/walrus";

import utilsSui from "./utils.sui";
import walrusWasmUrl from "@mysten/walrus-wasm/web/walrus_wasm_bg.wasm?url";

const walrusClient = utilsSui.getSuiClient.$extend(
  walrus({
    wasmUrl: walrusWasmUrl,

    uploadRelay: {
      host: "https://upload-relay.testnet.walrus.space",
      sendTip: {
        max: 10000000,
      },
      timeout: 600_000,
    },
  }),
).walrus;

const getQuiltPatchId = (patchId: string) => {
  return `https://aggregator.walrus-testnet.walrus.space/v1/blobs/by-quilt-patch-id/${patchId}`;
};

export default {
  walrusClient,
  getQuiltPatchId,
};
