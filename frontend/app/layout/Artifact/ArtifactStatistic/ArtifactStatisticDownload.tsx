import Spinner from "app/components/Spinner";
import Typography from "app/components/Typography";
import useDownloadFile from "app/hook/useDownloadFile";
import type { ArtifactQuery } from "app/services/graphql-app/generated";
import DownloadLine from "public/assets/line/download.svg";

interface ArtifactStatisticDownloadProps {
  artifact: NonNullable<ArtifactQuery["artifact"]>;
  rootId: string;
  onRefetch: () => void;
}

export default ({
  artifact,
  rootId,
  onRefetch,
}: ArtifactStatisticDownloadProps) => {
  const { downloadZip, downloading } = useDownloadFile();

  return (
    <button
      className="text-[#00382E] rounded-lg h-10 flex gap-2 items-center justify-center"
      disabled={!!downloading?.length}
      style={{
        background: "linear-gradient(135deg, #46F1CF 0%, #00D4B4 100%)",
      }}
      onClick={async () => {
        return await downloadZip({
          files: artifact.files,
          name: `artifact-${artifact.createdAt}`,
          rootId,
          onRefetch,
        });
      }}
    >
      {downloading?.length ? <Spinner /> : <DownloadLine />}

      <Typography font="grotesk">DOWNLOAD ARTIFACT</Typography>
    </button>
  );
};
