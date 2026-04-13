import { useCurrentAccount } from "@mysten/dapp-kit-react";
import utilsWalrus from "app/utils/utils.walrus";
import { WalrusFile } from "@mysten/walrus";
import useSignAndExecuteTransaction from "./useSignAndExecuteTransaction";
import type useSteps from "./useSteps";
import {
  computeSHA256,
  formatIdentifyQuilt,
  sortAlphabetically,
} from "app/utils";

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
      sortAlphabetically(files, (file) => file.name).map(async (file) => ({
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

      parseFiles = parseFiles.map((file, index) => ({
        ...file,
        patchId: listFiles[index].id,
      }));

      if (parseFiles.some((file) => !file.patchId.length)) {
        throw "upload quilt doesn't safety forward, invalid patchId";
      }
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
