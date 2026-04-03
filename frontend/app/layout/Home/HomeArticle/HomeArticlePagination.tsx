import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "app/components/ui/pagination";
import type { ArtifactsQuery } from "app/services/graphql-app/generated";
import utilsConstants from "app/utils/utils.constants";
import { useEffect } from "react";

interface HomeArticlePaginationProps {
  artifacts: ArtifactsQuery["artifacts"];
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export default ({
  artifacts,
  currentPage,
  setCurrentPage,
}: HomeArticlePaginationProps) => {
  const pageCount = Math.ceil(
    artifacts.totalCount / utilsConstants.MAX_ARTIFACT_CARD,
  );

  if (pageCount <= 1) return null;

  // handle scroll to top
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  // reset to first page whenever data change
  useEffect(() => {
    if (currentPage) {
      setCurrentPage(0);
    }
  }, [artifacts.items]);

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            disabled={!currentPage}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          />
        </PaginationItem>

        {[...Array(pageCount)].map((_, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              isActive={currentPage === index}
              onClick={() => setCurrentPage(index)}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            disabled={currentPage + 1 >= pageCount}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
