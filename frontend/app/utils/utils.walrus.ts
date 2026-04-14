import { walrus } from "@mysten/walrus";

import utilsSui from "./utils.sui";
import walrusWasmUrl from "@mysten/walrus-wasm/web/walrus_wasm_bg.wasm?url";
import { mergeAllCoin, multipliedNumberDecimal } from ".";
import { Transaction } from "@mysten/sui/transactions";

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

const WAL_COIN_TYPE = utilsSui.isTestNet
  ? "0x8270feb7375eee355e64fdb69c50abb6b5f9393a722883c1cf45f8e26048810a::wal::WAL"
  : "0x356a26eb9e012a68958082340d4c4116e7f55615cf27affcff209cf0ae544f59::wal::WAL";

const getQuiltPatchId = (patchId: string) => {
  return `https://aggregator.walrus-testnet.walrus.space/v1/blobs/by-quilt-patch-id/${patchId}`;
};

const transferCoin = async (owner: string, amount: number, receive: string) => {
  const tx = new Transaction();

  const mergeCoin = await mergeAllCoin(owner, WAL_COIN_TYPE, tx);

  const [coin] = tx.splitCoins(tx.object(mergeCoin.objectId), [
    multipliedNumberDecimal(amount),
  ]);

  tx.transferObjects([coin], tx.pure.address(receive));

  return tx;
};

export default {
  walrusClient,
  WAL_COIN_TYPE,
  getQuiltPatchId,
  transferCoin,
};
