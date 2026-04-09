import { Transaction } from "@mysten/sui/transactions";
import utilsSui from "app/utils/utils.sui";
import useSignAndExecuteTransaction from "./useSignAndExecuteTransaction";
import type useUploadQuilt from "./useUploadQuilt";
import type useSteps from "./useSteps";
import type { ArtifactFile } from "app/services/graphql-app/generated";
import { newMetadata } from "app/services/sui-codegen/walrus_archive/metadata";
import { newFile } from "app/services/sui-codegen/walrus_archive/file";
import * as artifact from "app/services/sui-codegen/walrus_archive/artifact";

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
      metadata: newMetadata({
        package: utilsSui.programs.package,
        arguments: {
          category: metadata.category,
          description: metadata.description,
          title: metadata.title,
        },
      })(tx),

      file: newFile({
        package: utilsSui.programs.package,
        arguments: {
          mimeType: files.map((file) => file.mimeType),
          name: files.map((file) => file.name),
          patchId: files.map((file) => file.patchId),
          sizeBytes: files.map((file) => BigInt(file.sizeBytes)),
          hash: files.map((file) => file.hash),
        },
      })(tx),
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
    return new Promise<ArtifactObjectType>(async (resolve, reject) => {
      try {
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
              hash: quilt.hashes[index],
            })),
          );

          artifact.initArtifact({
            package: utilsSui.programs.package,
            arguments: {
              files: struct.file,
              metadata: struct.metadata,
            },
          })(tx);

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
      } catch (error) {
        reject(error);
      }
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
    return new Promise<ArtifactObjectType>(async (resolve, reject) => {
      try {
        updateStatus("loading");

        const tx = new Transaction();

        // handle moveCall
        {
          const struct = createNewStruct(tx, metadata, files);

          if (parentId?.length) {
            artifact.commitArtifactWithParent({
              package: utilsSui.programs.package,
              arguments: {
                parent: parentId,
                root: rootId,
                metadata: struct.metadata,
                files: struct.file,
              },
            })(tx);
          } else {
            artifact.commitArtifactWithoutParent({
              package: utilsSui.programs.package,
              arguments: {
                root: rootId,
                metadata: struct.metadata,
                files: struct.file,
              },
            })(tx);
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
      } catch (error) {
        reject(error);
      }
    });
  };

  return {
    initArtifact,
    releaseArtifact,
  };
};
