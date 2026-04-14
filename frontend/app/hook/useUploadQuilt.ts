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

    let parseFiles = await Promise.all(
      files
        // why sort ASCILL?, because following the SDK: https://github.com/MystenLabs/ts-sdks/blob/main/packages/walrus/src/utils/quilts.ts#L143
        .sort((a, b) => (a.name < b.name ? -1 : 1))
        .map(async (file) => ({
          file,
          hash: await computeSHA256(file),
          contents: await file.bytes(),
          identifier: formatIdentifyQuilt(file.name),
          patchId: "",
        })),
    );

    const flow = utilsWalrus.walrusClient.writeFilesFlow({
      files: await Promise.all(
        parseFiles.map(async ({ contents, identifier }) =>
          WalrusFile.from({
            contents,
            identifier,
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

    // handle patchId
    {
      const listFiles = await flow.listFiles();

      if (parseFiles.length !== listFiles.length) {
        throw "Upload quilt: file count mismatch";
      }

      parseFiles = parseFiles.map((file, index) => {
        const listFile = listFiles[index];

        if (!listFile) {
          throw "Upload quilt: missing corresponding file from listFiles";
        }

        return {
          ...file,
          patchId: listFile.id,
        };
      });
    }

    updateStatus("success");

    return {
      parseFiles,
    };
  };

  return {
    uploadQuilt,
  };
};
