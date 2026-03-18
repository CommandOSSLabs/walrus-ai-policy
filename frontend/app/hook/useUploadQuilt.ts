import { useCurrentAccount } from "@mysten/dapp-kit-react";
import utilsWalrus from "app/utils/utils.walrus";
import { WalrusFile } from "@mysten/walrus";
import useSignAndExecuteTransaction from "./useSignAndExecuteTransaction";

export interface uploadQuiltParametersProps {
  files: File[];
  title: string;
  description: string;
  categories: string[];
}

interface ManifestDocumentProps {
  name: string;
  mimeType: string;
}

export default () => {
  const currentAccount = useCurrentAccount();

  const { signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const getManifestIdentify = () => {
    return {
      identify: "manifest.json",
      mimeType: "application/json",
    };
  };

  const getManifest = (params: Parameters<typeof uploadQuilt>["0"]) => {
    const { identify, mimeType } = getManifestIdentify();

    const documents: ManifestDocumentProps[] = [
      {
        name: identify,
        mimeType: mimeType,
      },

      ...params.files.map((file) => ({
        name: file.name,
        mimeType: file.type,
      })),
    ];

    return {
      title: params.title,
      description: params.description,
      categories: params.categories,
      documents,
    };
  };

  const uploadQuilt = async (params: uploadQuiltParametersProps) => {
    if (!currentAccount?.address) throw "not found condition";

    const manifest = getManifest(params);
    const manifestIdentify = getManifestIdentify();

    const flow = utilsWalrus.walrusClient.writeFilesFlow({
      files: [
        WalrusFile.from({
          contents: new TextEncoder().encode(JSON.stringify(manifest)),
          identifier: manifestIdentify.identify,
        }),

        ...(await Promise.all(
          params.files.map(async (file) =>
            WalrusFile.from({
              contents: await file.bytes(),
              identifier: file.name,
            }),
          ),
        )),
      ],
    });

    // encode files
    await flow.encode();

    // handle register
    {
      const tx = await signAndExecuteTransaction({
        transaction: flow.register({
          deletable: true,
          epochs: 1,
          owner: currentAccount.address,
        }),
      });

      await flow.upload({
        digest: tx.digest,
      });
    }

    // handle ceritfy
    await signAndExecuteTransaction({
      transaction: flow.certify(),
    });

    const [{ blobId }] = await flow.listFiles();

    return manifest.documents.map((meta) => ({
      quilt: blobId,
      name: meta.name,
    }));
  };

  return {
    uploadQuilt,
  };
};
