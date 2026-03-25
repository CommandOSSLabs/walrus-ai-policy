import { Transaction } from "@mysten/sui/transactions";
import utilsSui from "app/utils/utils.sui";
import useSignAndExecuteTransaction from "./useSignAndExecuteTransaction";
import type useUploadQuilt from "./useUploadQuilt";
import type useSteps from "./useSteps";

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
    quilt: Awaited<
      ReturnType<ReturnType<typeof useUploadQuilt>["uploadQuilt"]>
    >,
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
            quilt.quiltIds.map((quilt) => quilt),
          ),
          tx.pure.vector(
            "string",
            quilt.files.map((file) => file.type),
          ),
          tx.pure.vector(
            "u64",
            quilt.files.map((file) => file.size),
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
        const struct = createNewStruct(tx, metadata, quilt);

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

  return {
    initArtifact,
  };
};
