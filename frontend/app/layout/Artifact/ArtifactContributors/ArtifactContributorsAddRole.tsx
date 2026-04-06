import { Transaction } from "@mysten/sui/transactions";
import { isValidSuiAddress } from "@mysten/sui/utils";
import Hstack from "app/components/Hstack";
import Spinner from "app/components/Spinner";
import Typography from "app/components/Typography";
import Vstack from "app/components/Vstack";
import useSignAndExecuteTransaction from "app/hook/useSignAndExecuteTransaction";
import { forceToNumber, waitForSeconds } from "app/utils";
import utilsSui from "app/utils/utils.sui";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface ArtifactContributorsAddRoleProps {
  rootId: string;
  roles: Record<number, string>;
  onRefetch: () => void;
}

export default ({
  rootId,
  roles,
  onRefetch,
}: ArtifactContributorsAddRoleProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const roleRef = useRef<HTMLSelectElement>(null);

  const [loading, setLoading] = useState<string>();

  const { signAndExecuteTransaction } = useSignAndExecuteTransaction();

  return (
    <Vstack className="w-full p-3 gap-5 bg-[#191F2D] border border-[#3B4A45] rounded-md">
      <Vstack className="gap-4 text-[#BACAC4] text-xs">
        <Vstack>
          <Typography font="jetbrains">Address</Typography>

          <input
            ref={inputRef}
            className="input-bold h-10 text-xs border-white/10"
            placeholder="Enter the address"
          />
        </Vstack>

        <Vstack>
          <Typography font="jetbrains">Role</Typography>

          <select
            className="h-10 px-2 bg-[#272B33]/45 border border-[#352F2F] text-sm capitalize rounded-sm outline-none"
            ref={roleRef}
          >
            {Object.entries(roles).map(([role, key]) => (
              <option key={key} value={role} defaultValue={role}>
                {key}
              </option>
            ))}
          </select>
        </Vstack>
      </Vstack>

      <button
        className="bg-primary w-full h-8 rounded-sm"
        disabled={!!loading?.length}
        onClick={async () => {
          try {
            if (!inputRef.current?.value?.length) {
              throw "Address is required.";
            }

            if (!isValidSuiAddress(inputRef.current.value)) {
              throw "Invalid address.";
            }

            setLoading(rootId);

            const tx = new Transaction();

            // handle moveCall
            {
              tx.moveCall({
                target: `${utilsSui.programs.package}::artifact::management_role`,
                arguments: [
                  tx.object(rootId),
                  tx.pure.address(inputRef.current.value),
                  tx.pure.option("u8", forceToNumber(roleRef.current?.value)),
                ],
              });
            }

            await signAndExecuteTransaction({
              transaction: tx,
            });

            await waitForSeconds(() => {
              onRefetch();

              toast.success("You added the role successfully.");
            });
          } catch (error) {
            return toast.error(JSON.stringify(error, null, 4));
          } finally {
            setLoading(undefined);
          }
        }}
      >
        <Hstack>
          {loading == rootId ? <Spinner /> : null}

          <Typography font="jetbrains" className="text-sm text-black">
            Confirm
          </Typography>
        </Hstack>
      </button>
    </Vstack>
  );
};
