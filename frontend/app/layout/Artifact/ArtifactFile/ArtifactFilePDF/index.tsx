import { Skeleton } from "app/components/ui/skeleton";
import useGetFileByPatchId from "app/hook/useGetFileByPatchId";
import type { ArtifactFile } from "app/services/graphql-app/generated";
import { useEffect, useMemo } from "react";

interface ArtifactFilePDFProps {
  file: ArtifactFile;
}

export default ({ file }: ArtifactFilePDFProps) => {
  const { data, isLoading, isError } = useGetFileByPatchId(file, "arrayBuffer");

  const preview = useMemo(() => {
    if (!data) return;

    const blob = new Blob([data], {
      type: file.mimeType,
    });

    return URL.createObjectURL(blob);
  }, [data]);

  // cleanup memory
  useEffect(() => {
    return () => {
      if (preview?.length) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  if (isLoading) return <Skeleton className="w-full min-h-56" />;

  if (!preview?.length || isError) return null;

  return <iframe src={preview} className="aspect-video" />;
};
