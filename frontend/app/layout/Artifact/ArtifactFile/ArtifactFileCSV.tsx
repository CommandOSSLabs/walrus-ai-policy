import { Skeleton } from "app/components/ui/skeleton";
import useGetFileByPatchId from "app/hook/useGetFileByPatchId";
import type { ArtifactFile } from "app/services/graphql-app/generated";
import { CsvToHtmlTable } from "react-csv-to-table";
import { tv } from "tailwind-variants";

interface ArtifactFileCSVProps {
  file: ArtifactFile;
}

export default ({ file }: ArtifactFileCSVProps) => {
  const { data, isError, isLoading } = useGetFileByPatchId(file);

  if (isLoading) return <Skeleton className="w-full min-h-56" />;

  if (!data?.length || isError) return null;

  return (
    <div className="w-full whitespace-pre overflow-x-auto">
      <CsvToHtmlTable
        data={data}
        csvDelimiter=","
        tableRowClassName="not-last:border-b not-last:border-black/25"
        tableClassName={tv({
          base: [
            "bg-white text-black",
            "size-full",
            "[&_td]:px-2.5 [&_td]:py-1",
          ],
        })()}
      />
    </div>
  );
};
