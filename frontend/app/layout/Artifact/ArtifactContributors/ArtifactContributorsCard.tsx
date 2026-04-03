import Flex from "app/components/Flex";
import Jazzicon from "app/components/Jazzicon";
import Typography from "app/components/Typography";
import Vstack from "app/components/Vstack";
import { formatSuiNS } from "app/utils";
import ArtifactContributorsRemoveRole from "./ArtifactContributorsRemoveRole";
import { useCurrentAccount } from "@mysten/dapp-kit-react";
import useSuiNs from "app/hook/useSuiNs";
import { Skeleton } from "app/components/ui/skeleton";
import type { Contributor } from "app/services/graphql-app/generated";

interface ArtifactContributorsCardProps {
  contributor: Contributor;
  roles: Record<number, string> | undefined;
  suiObjectId: string;
  isAdmin: boolean;
}

export default ({
  contributor,
  roles,
  suiObjectId,
  isAdmin,
}: ArtifactContributorsCardProps) => {
  const { data, isLoading } = useSuiNs(contributor.creator);

  const currentAccount = useCurrentAccount();

  const isYou = currentAccount?.address === contributor.creator;

  if (isLoading) return <Skeleton className="min-h-14" />;

  return (
    <Flex className="bg-[#191F2D] border border-[#3B4A45] rounded-lg px-3 py-2 gap-3 group">
      <div className="size-9 rounded-full overflow-hidden">
        {data?.avatar ? (
          <img src={data.avatar} className="size-full" />
        ) : (
          <Jazzicon address={contributor.creator} className="size-9" />
        )}
      </div>

      <Vstack className="gap-0.5 flex-1">
        <Typography font="grotesk" className="text-[#DDE2F5] text-xs font-bold">
          {formatSuiNS(
            contributor.creator,
            data?.name,
            currentAccount?.address,
          )}
        </Typography>

        <Typography
          font="jetbrains"
          className="text-[#84948F] text-2xs capitalize"
        >
          {roles?.[contributor.role] || "Unknown"}
        </Typography>
      </Vstack>

      {!isYou && isAdmin && (
        <ArtifactContributorsRemoveRole
          suiObjectId={suiObjectId}
          creator={contributor.creator}
        />
      )}
    </Flex>
  );
};
