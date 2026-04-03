import Typography from "app/components/Typography";
import { Checkbox } from "app/components/ui/checkbox";

import { useSearchParams } from "react-router";
import { tv } from "tailwind-variants";
import { useCurrentAccount } from "@mysten/dapp-kit-react";

export default () => {
  const [params, setSearchParams] = useSearchParams();

  const currentAccount = useCurrentAccount();

  const isCreatedByMe = params.get("creator") === currentAccount?.address;

  if (!currentAccount?.address) return null;

  return (
    <label
      className={tv({
        base: [
          "border-b border-[#3B4A45]",
          "flex items-center gap-3 p-4",
          "cursor-pointer",
        ],
      })()}
    >
      <Checkbox
        checked={isCreatedByMe}
        onCheckedChange={(isChecked) => {
          if (isChecked) {
            params.set("creator", currentAccount.address);
          } else {
            params.delete("creator");
          }

          setSearchParams(params);
        }}
      />

      <div className="flex flex-col gap-0.5">
        <Typography font="grotesk" className="font-bold">
          Created by me
        </Typography>

        {!currentAccount?.address && (
          <Typography font="jetbrains" className="text-[#BACAC4] text-2xs">
            Connect wallet to use
          </Typography>
        )}
      </div>
    </label>
  );
};
