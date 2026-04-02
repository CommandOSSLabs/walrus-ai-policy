import { Transaction } from "@mysten/sui/transactions";
import utilsSui from "app/utils/utils.sui";
import useSignAndExecuteTransaction from "./useSignAndExecuteTransaction";
import type useUploadQuilt from "./useUploadQuilt";
import type useSteps from "./useSteps";
import type { ArtifactFile } from "app/services/graphql-app/generated";
import { formatIdentify } from "app/utils";

type MetadataType = {
  title: string;
  description: string;
  category: string;
};

export type ArtifactObjectType = {
  id: string;
  parent_id: string | null;
  root_id: string | null;
  creator: string;
  created_at: string;
};

export default () => {
  const { signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const createNewStruct = (
    tx: Transaction,
    metadata: MetadataType,
    files: ArtifactFile[],
  ) => {
    return {
      metadata: tx.moveCall({
        target: `${utilsSui.programs.package}::metadata::new_metadata`,
        arguments: [
          tx.pure.string(metadata.title),
          tx.pure.string(metadata.description),
          tx.pure.string(metadata.category),
          tx.object.clock(),
        ],
      }),

      file: tx.moveCall({
        target: `${utilsSui.programs.package}::file::new_file`,
        arguments: [
          tx.pure.vector(
            "string",
            files.map(({ patchId }) => patchId),
          ),
          tx.pure.vector(
            "string",
            files.map(({ mimeType }) => mimeType),
          ),
          tx.pure.vector(
            "u64",
            files.map(({ sizeBytes }) => sizeBytes),
          ),
          tx.pure.vector(
            "string",
            files.map(({ name }) => formatIdentify(name)),
          ),
          tx.pure.vector(
            "string",
            files.map(({ hash }) => hash),
          ),
        ],
      }),
    };
  };

  const initArtifact = async (
    metadata: MetadataType,
    quilt: Awaited<
      ReturnType<ReturnType<typeof useUploadQuilt>["uploadQuilt"]>
    >,
    updateFee: ReturnType<typeof useSteps>["updateFee"],
    updateStatus: ReturnType<typeof useSteps>["updateStatus"],
  ) => {
    return new Promise<ArtifactObjectType>(async (resolve) => {
      updateStatus("loading");

      const tx = new Transaction();

      // handle moveCall
      {
        const struct = createNewStruct(
          tx,
          metadata,
          quilt.files.map((file, index) => ({
            mimeType: file.type,
            name: file.name,
            patchId: quilt.quiltIds[index],
            sizeBytes: file.size,
            hash: quilt.hash[index],
          })),
        );

        tx.moveCall({
          target: `${utilsSui.programs.package}::artifact::init_artifact`,
          arguments: [struct.metadata, struct.file],
        });

        await updateFee(tx);
      }

      await signAndExecuteTransaction({
        transaction: tx,
        onSuccess: ({ event }) => {
          if (event?.json) {
            resolve(event.json as ArtifactObjectType);
          }
        },
      });

      updateStatus("success");
    });
  };

  const releaseArtifact = async (
    metadata: MetadataType,
    files: ArtifactFile[],
    rootId: string,
    parentId: string | undefined,
    updateFee: ReturnType<typeof useSteps>["updateFee"],
    updateStatus: ReturnType<typeof useSteps>["updateStatus"],
  ) => {
    return new Promise<ArtifactObjectType>(async (resolve) => {
      updateStatus("loading");

      const tx = new Transaction();

      // handle moveCall
      {
        const struct = createNewStruct(tx, metadata, files);

        if (parentId?.length) {
          tx.moveCall({
            target: `${utilsSui.programs.package}::artifact::commit_artifact_with_parent`,
            arguments: [
              tx.object(rootId),
              tx.object(parentId),
              struct.metadata,
              struct.file,
            ],
          });
        } else {
          tx.moveCall({
            target: `${utilsSui.programs.package}::artifact::commit_artifact_without_parent`,
            arguments: [tx.object(rootId), struct.metadata, struct.file],
          });
        }

        await updateFee(tx);
      }

      await signAndExecuteTransaction({
        transaction: tx,
        onSuccess: ({ event }) => {
          if (event?.json) {
            resolve(event.json as ArtifactObjectType);
          }
        },
      });

      updateStatus("success");
    });
  };

  return {
    initArtifact,
    releaseArtifact,
  };
};
