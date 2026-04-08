import { Transaction } from "@mysten/sui/transactions";
import Hstack from "app/components/Hstack";
import Spinner from "app/components/Spinner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "app/components/ui/dialog";
import Vstack from "app/components/Vstack";
import useSignAndExecuteTransaction from "app/hook/useSignAndExecuteTransaction";
import { waitForSeconds } from "app/utils";
import utilsSui from "app/utils/utils.sui";
import CloseLine from "public/assets/line/close.svg";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { tv } from "tailwind-variants";

interface ArtifactContributorsRemoveRoleProps {
  rootId: string;
  creator: string;
  onRefetch: () => void;
}

export default ({
  rootId,
  creator,
  onRefetch,
}: ArtifactContributorsRemoveRoleProps) => {
  const closeRef = useRef<HTMLButtonElement>(null);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<string>();

  const { signAndExecuteTransaction } = useSignAndExecuteTransaction();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={tv({
          base: [
            "size-6 bg-[#3B4A45]/80 rounded-full transition-opacity opacity-0 group-hover:opacity-100",
          ],
        })()}
      >
        <CloseLine className="mx-auto size-3.5" />
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="flex justify-center"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <Vstack className="p-4 gap-4 bg-[#191F2D] border border-white/15 w-sm rounded-xl">
          <DialogHeader>
            <DialogTitle>Delete Role</DialogTitle>

            <DialogDescription>
              This action cannot be undone. The role will be permanently
              deleted.
            </DialogDescription>
          </DialogHeader>

          <Hstack className="gap-4 justify-end font-semibold h-9">
            <DialogClose
              ref={closeRef}
              className="bg-[#3B4A45]/45 border border-[#3B4A45] px-4 h-full rounded-sm"
            >
              Cancel
            </DialogClose>

            <button
              className="bg-red-500 px-4 h-full rounded-sm"
              onClick={async () => {
                try {
                  setLoading(creator);

                  const tx = new Transaction();

                  // handle moveCall
                  {
                    tx.moveCall({
                      target: `${utilsSui.programs.package}::artifact::management_role`,
                      arguments: [
                        tx.object(rootId),
                        tx.pure.address(creator),
                        tx.pure.option("u8", null),
                      ],
                    });
                  }

                  await signAndExecuteTransaction({
                    transaction: tx,
                  });

                  await waitForSeconds(() => {
                    onRefetch();

                    toast.success("You removed the role successfully.");

                    setOpen(false);
                  });
                } catch (error) {
                  toast.error(JSON.stringify(error, null, 4));
                } finally {
                  setLoading(undefined);
                }
              }}
            >
              <Hstack>
                {loading === creator ? <Spinner /> : null}
                Delete
              </Hstack>
            </button>
          </Hstack>
        </Vstack>
      </DialogContent>
    </Dialog>
  );
};
