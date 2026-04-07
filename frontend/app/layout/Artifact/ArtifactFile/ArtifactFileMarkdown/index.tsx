import { Skeleton } from "app/components/ui/skeleton";
import Vstack from "app/components/Vstack";
import type { ArtifactFile } from "app/services/graphql-app/generated";

import Markdown from "app/components/Markdown";
import useGetFileByPatchId from "app/hook/useGetFileByPatchId";

interface ArtifactFileMarkdownProps {
  file: ArtifactFile;
}

export default ({ file }: ArtifactFileMarkdownProps) => {
  const { data, isError, isLoading } = useGetFileByPatchId(file, "text");

  if (isLoading) {
    return (
      <Vstack className="w-full p-3.5 border border-[#352F2F] rounded-xl">
        <Skeleton className="min-h-10" />
        <Skeleton className="min-h-56" />
      </Vstack>
    );
  }

  if (!data?.length || isError) return null;

  return (
    <div className="w-full p-3.5 border border-[#352F2F] rounded-xl overflow-scroll">
      <Markdown content={data} />
    </div>
  );
};
