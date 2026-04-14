import { SUI_DECIMALS } from "@mysten/sui/utils";
import { useQuery } from "@tanstack/react-query";
import { BigNumber } from "bignumber.js";
import utilsSui from "app/utils/utils.sui";
import utilsWalrus from "app/utils/utils.walrus";

export default (address: string | undefined) => {
  return useQuery({
    queryKey: ["wal_balance", address],
    enabled: !!address,
    queryFn: async () => {
      const { balance } = await utilsSui.getSuiClient.getBalance({
        owner: address!,
        coinType: utilsWalrus.getCoinTypes,
      });

      return BigNumber(balance?.balance?.toString() ?? "0")
        .dividedBy(Math.pow(10, SUI_DECIMALS))
        .toFormat(2);
    },
  });
};
