import { useQuery } from "@tanstack/react-query";
import graphqlSui from "app/services/graphql-sui";
import { useSuiMetadataSuinsQuery } from "app/services/graphql-sui/generated";
import { fromUnixTimestamp } from "app/utils";
import utilsSui from "app/utils/utils.sui";

export default (address: string | undefined | null) => {
  return useQuery({
    queryKey: ["suins_avatar", address],
    queryFn: async () => {
      if (address?.length) {
        const {
          response: { record },
        } = await utilsSui.getSuiClient.nameService.reverseLookupName({
          address,
        });

        if (!record?.name) return null;

        /*
          no Personalize Avatar, so select with the default,
          Personalize Avatar uploaded, so display them for yourself,
          
          testnet: using ip gateway: "image_url": "https://www.walrus.xyz/walrus-blob",
          mainnet: using IPFS: "image_url": "ipfs://QmXRwUEoMMyQpkuoYnXpbL3yLwFRzPozc9njvoafCK1Dz6",
        */
        if (!record?.data?.avatar && record?.expirationTimestamp?.seconds) {
          const date = fromUnixTimestamp(
            Number(record.expirationTimestamp.seconds),
            record.expirationTimestamp.nanos,
          );

          return {
            avatar: `https://api-${import.meta.env.VITE_SUI_NETWORK}.suins.io/nfts/${record.name}/${date.getTime()}`,
            name: record.name.replace(".sui", ""),
          };
        }

        return {
          avatar: await (async function () {
            const metadata = await useSuiMetadataSuinsQuery.fetcher(
              graphqlSui.client,
              {
                address: record.data.avatar,
              },
            )();

            const image_url = String(
              metadata?.object?.asMoveObject?.contents?.display?.output?.[
                "image_url" as never
              ],
            );

            if (image_url === "https://www.walrus.xyz/walrus-blob") {
              return `https://${import.meta.env.VITE_SUI_NETWORK}.suivision.xyz/images/nft-default.svg`;
            }

            return image_url;
          })(),
          name: record.name.replace(".sui", ""),
        };
      }

      return null;
    },
    retry: 0,
  });
};
