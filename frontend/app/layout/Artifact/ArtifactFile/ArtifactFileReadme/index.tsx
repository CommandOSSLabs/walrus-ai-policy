import Hstack from "app/components/Hstack";
import Typography from "app/components/Typography";
import { Skeleton } from "app/components/ui/skeleton";
import Vstack from "app/components/Vstack";
import type { ArtifactFile } from "app/services/graphql-app/generated";
import OpenBookLine from "public/assets/line/open-book.svg";

import Markdown from "app/components/Markdown";
import useGetFileByPatchId from "app/hook/useGetFileByPatchId";

interface ArtifactFileReadmeProps {
  file: ArtifactFile;
}

export default ({ file }: ArtifactFileReadmeProps) => {
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
    <div className="w-full border border-[#352F2F] rounded-xl">
      <Hstack className="text-white justify-start h-10 px-3.5 border-b border-[#352F2F]">
        <OpenBookLine />

        <Typography className="text-sm">{file.name}</Typography>
      </Hstack>

      <div className="p-3.5">
        <Markdown content={data} />
      </div>
    </div>
  );
};
