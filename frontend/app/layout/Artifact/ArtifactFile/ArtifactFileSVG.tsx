import { Skeleton } from "app/components/ui/skeleton";
import useGetFileByPatchId from "app/hook/useGetFileByPatchId";
import type { ArtifactFile } from "app/services/graphql-app/generated";
import DOMPurify from "dompurify";

interface ArtifactFileSVGProps {
  file: ArtifactFile;
}

export default ({ file }: ArtifactFileSVGProps) => {
  const { data, isError, isLoading } = useGetFileByPatchId(file, "text");

  if (isLoading) {
    return <Skeleton className="w-full min-h-10" />;
  }

  if (!data?.length || isError) return null;

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(data),
      }}
    />
  );
};
