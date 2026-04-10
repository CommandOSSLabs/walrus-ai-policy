import { useCurrentAccount } from "@mysten/dapp-kit-react";
import utilsWalrus from "app/utils/utils.walrus";
import { WalrusFile } from "@mysten/walrus";
import useSignAndExecuteTransaction from "./useSignAndExecuteTransaction";
import type useSteps from "./useSteps";
import { computeSHA256, formatIdentifyQuilt } from "app/utils";

export type RegisterEventType = {
  digest: string;
  object_id: string;
};

export default () => {
  const currentAccount = useCurrentAccount();

  const { signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const uploadQuilt = async (
    files: File[],
    updateFee: ReturnType<typeof useSteps>["updateFee"],
    updateStatus: ReturnType<typeof useSteps>["updateStatus"],
  ) => {
    if (!currentAccount?.address) throw "not found condition";

    updateStatus("loading");

    const flow = utilsWalrus.walrusClient.writeFilesFlow({
      files: await Promise.all(
        files.map(async (file) =>
          WalrusFile.from({
            contents: await file.bytes(),
            identifier: formatIdentifyQuilt(file.name),
          }),
        ),
      ),
    });

    // encode files
    await flow.encode();

    // handle register
    {
      const tx = flow.register({
        deletable: false,
        epochs: 52,
        owner: currentAccount.address,
      });

      await updateFee(tx);

      const { digest } = await signAndExecuteTransaction({
        transaction: tx,
      });

      await flow.upload({
        digest,
      });

      updateStatus("success");
    }

    // handle ceritfy
    {
      updateStatus("loading");

      const tx = flow.certify();

      await updateFee(tx);

      await signAndExecuteTransaction({
        transaction: tx,
      });
    }

    const [listFiles, hashes] = await Promise.all([
      flow.listFiles(),
      Promise.all(files.map(computeSHA256)),
    ]);

    updateStatus("success");

    return {
      blobObject: listFiles[0].blobObject.id,
      quiltIds: listFiles.map((file) => file.id),
      hashes,
      files,
    };
  };

  return {
    uploadQuilt,
  };
};
