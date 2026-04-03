import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "app/components/ui/pagination";
import utilsConstants from "app/utils/utils.constants";
import { useEffect } from "react";
import { useLocation } from "react-router";

interface HomeArticlePaginationProps {
  totalCount: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export default ({
  totalCount,
  currentPage,
  setCurrentPage,
}: HomeArticlePaginationProps) => {
  const location = useLocation();

  const pageCount = Math.ceil(totalCount / utilsConstants.MAX_ARTIFACT_CARD);

  // handle scroll to top
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  // reset to first page whenever data change
  useEffect(() => {
    setCurrentPage(0);
  }, [location?.search]);

  if (pageCount <= 1) return null;

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
