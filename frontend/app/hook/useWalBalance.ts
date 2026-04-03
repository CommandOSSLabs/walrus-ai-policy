import { SUI_DECIMALS } from "@mysten/sui/utils";
import { useQuery } from "@tanstack/react-query";
import { BigNumber } from "bignumber.js";
import utilsSui from "app/utils/utils.sui";

export default (address: string | undefined) => {
  return useQuery({
    queryKey: ["wal_balance", address],
    enabled: !!address,
    queryFn: async () => {
      const { balance } = await utilsSui.getSuiClient.getBalance({
        owner: address!,
        coinType: utilsSui.isTestNet
          ? "0x8270feb7375eee355e64fdb69c50abb6b5f9393a722883c1cf45f8e26048810a::wal::WAL"
          : "0x356a26eb9e012a68958082340d4c4116e7f55615cf27affcff209cf0ae544f59::wal::WAL",
      });

      return BigNumber(balance?.balance?.toString() ?? "0")
        .dividedBy(Math.pow(10, SUI_DECIMALS))
        .toFormat(2);
    },
  });
};
