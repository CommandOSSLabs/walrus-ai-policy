import Spinner from "app/components/Spinner";
import Stack from "app/components/Stack";
import Typography from "app/components/Typography";
import useDownloadFile from "app/hook/useDownloadFile";
import type { ArtifactFile } from "app/services/graphql-app/generated";
import FilesLine from "public/assets/line/files.svg";

interface ArtifactFileFallbackProps {
  file: ArtifactFile;
  rootId: string;
  onRefetch: () => void;
}

export default ({ file, rootId, onRefetch }: ArtifactFileFallbackProps) => {
  const { downloadFile, downloading } = useDownloadFile();

  return (
    <Stack className="gap-4 text-[#BACAC4] border border-[#352F2F] w-full py-16">
      <FilesLine className="size-8" />

      <Stack className="gap-0.5">
        <Typography>This file is not supported for preview.</Typography>

        <button
          disabled={!!downloading?.length}
          className="flex items-center gap-2"
          onClick={async () => {
            return await downloadFile({
              file,
              rootId,
              onRefetch,
            });
          }}
        >
          {downloading?.length ? <Spinner /> : null}

          <Typography className="text-blue-500">raw</Typography>
        </button>
      </Stack>
    </Stack>
  );
};
