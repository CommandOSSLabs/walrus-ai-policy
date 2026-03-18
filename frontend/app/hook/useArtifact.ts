import { Transaction } from "@mysten/sui/transactions";
import utilsSui from "app/utils/utils.sui";
import useSignAndExecuteTransaction from "./useSignAndExecuteTransaction";

export type ArtifactObjectType = {
  id: string;
  parent_id: string | null;
  root_id: string | null;
  creator: string;
  created_at: string;
};

export default () => {
  const { signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const createArtifact = async (quilt_ids: string[], name_ids: string[]) => {
    const tx = new Transaction();
    let artifact = {} as ArtifactObjectType;

    tx.moveCall({
      target: `${utilsSui.programs.package}::artifact::create_artifact`,
      arguments: [
        tx.pure.vector("string", quilt_ids),
        tx.pure.vector("string", name_ids),
        tx.object.clock(),
      ],
    });

    await signAndExecuteTransaction({
      transaction: tx,
      onSuccess: ({ event }) => {
        if (event?.json) {
          artifact = event.json as typeof artifact;
        }
      },
    });

    return artifact;
  };

  return {
    createArtifact,
  };
};
