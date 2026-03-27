import Hstack from "app/components/Hstack";
import Typography from "app/components/Typography";
import { Skeleton } from "app/components/ui/skeleton";
import Vstack from "app/components/Vstack";
import useGetConfig from "app/hook/useGetConfig";
import graphqlApp from "app/services/graphql-app";
import { usePlatformStatsQuery } from "app/services/graphql-app/generated";
import { forceToNumber, formatBytesSizes } from "app/utils";

export default () => {
  const { walrusConfig } = useGetConfig();

  const { data, isLoading } = usePlatformStatsQuery(graphqlApp.client);

  const usedBytes = forceToNumber(data?.platformStats.totalSizeBytes);
  const totalBytes = forceToNumber(walrusConfig.data);

  const percentage = Math.min((usedBytes / totalBytes) * 100, 100);

  return (
    <Vstack className="gap-3 p-4">
      <Typography font="jetbrains">Network Capacity</Typography>

      <Vstack className="gap-1">
        {isLoading || walrusConfig.isLoading ? (
          <>
            <Skeleton className="min-h-4" />

            <Skeleton className="w-2/3 min-h-3.5" />
          </>
        ) : (
          <>
            <Hstack>
              <div className="w-full h-1.5 relative bg-[#84948F]/25 rounded-full">
                <div
                  className="absolute h-full rounded-full"
                  style={{
                    width: `${percentage}%`,
                    background:
                      "linear-gradient(90deg, #46F1CF 0%, #41EDCC 12.5%, #3BEAC8 25%, #35E6C5 37.5%, #2EE2C1 50%, #27DFBE 62.5%, #1EDBBB 75%, #13D8B7 87.5%, #00D4B4 100%)",
                  }}
                />
              </div>

              <Typography font="jetbrains" className="text-[#00D4B4] font-bold">
                {(function () {
                  if (percentage.toString().length > 3) {
                    return parseFloat(percentage.toPrecision(2));
                  }

                  return percentage;
                })()}
                %
              </Typography>
            </Hstack>

            <Typography font="jetbrains" className="text-[#BACAC4] text-2xs">
              {formatBytesSizes(usedBytes)}&nbsp;Active •&nbsp;
              {formatBytesSizes(totalBytes)}
            </Typography>
          </>
        )}
      </Vstack>
    </Vstack>
  );
};
