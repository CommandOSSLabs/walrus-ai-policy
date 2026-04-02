import Center from "app/components/Center";
import Typography from "app/components/Typography";
import { Link, useSearchParams } from "react-router";
import HomeArticlePagination from "./HomeArticlePagination";
import { Skeleton } from "app/components/ui/skeleton";
import EmptyClipboardLine from "public/assets/line/empty-clipboard.svg";
import utilsConstants from "app/utils/utils.constants";
import { useArtifactsQuery } from "app/services/graphql-app/generated";
import graphqlApp from "app/services/graphql-app";
import { useState } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import HomeArticleGrid from "./HomeArticleGrid";
import HomeArticleCard from "./HomeArticleCard";

export default () => {
  const [currentPage, setCurrentPage] = useState(0);

  const [params] = useSearchParams();

  const { data, isLoading } = useArtifactsQuery(
    graphqlApp.client,
    {
      limit: utilsConstants.MAX_ARTIFACT_CARD,
      offset: currentPage * utilsConstants.MAX_ARTIFACT_CARD,
      filter: {
        category: params.getAll("category") || undefined,
        creator: params.get("creator") || undefined,
        search: params.get("search") || undefined,
        onlyRoots: true,
      },
    },
    {
      placeholderData: keepPreviousData,
    },
  );

  return (
    <article className="flex-1">
      {isLoading ? (
        <HomeArticleGrid>
          {[...Array(utilsConstants.MAX_ARTIFACT_CARD)].map((_, index) => (
            <Skeleton key={index} className="h-64" />
          ))}
        </HomeArticleGrid>
      ) : (
        <>
          {data?.artifacts?.items?.length ? (
            <>
              <HomeArticleGrid>
                {data.artifacts.items.map((artifact) => (
                  <Link
                    key={artifact.suiObjectId}
                    to={`/artifact/${artifact.suiObjectId}`}
                  >
                    <HomeArticleCard artifact={artifact} />
                  </Link>
                ))}
              </HomeArticleGrid>

              <HomeArticlePagination
                totalCount={data.artifacts.totalCount}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </>
          ) : (
            <Center className="flex-col gap-5 py-56 text-[#84948F]">
              <EmptyClipboardLine className="size-8" />

              <Typography className="text-center text-sm font-semibold w-96">
                {`There are currently no artifacts to display. Please
                create a new artifact to see it appear here.`}
              </Typography>
            </Center>
          )}
        </>
      )}
    </article>
  );
};
