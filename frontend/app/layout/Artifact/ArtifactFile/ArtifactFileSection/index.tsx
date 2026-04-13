import { renderSectionFile } from "app/utils";
import { lazy } from "react";
import ArtifactFileSVG from "../ArtifactFileSVG";
import utilsWalrus from "app/utils/utils.walrus";
import ArtifactFileReadme from "../ArtifactFileReadme";
import ArtifactFileMarkdown from "../ArtifactFileMarkdown";
import ArtifactFilePDF from "../ArtifactFilePDF";
import ArtifactFileFallback from "../ArtifactFileFallback";
import type { ArtifactFile } from "app/services/graphql-app/generated";

const ArtifactFileCSV = lazy(() => import("../ArtifactFileCSV"));

interface ArtifactFileSectionProps {
  file: ArtifactFile;
  rootId: string;
  onRefetch: () => void;
}

export default ({ file, rootId, onRefetch }: ArtifactFileSectionProps) => {
  return renderSectionFile(file.mimeType, {
    csv: <ArtifactFileCSV file={file} />,
    svg: <ArtifactFileSVG file={file} />,
    image: (
      <img
        src={utilsWalrus.getQuiltPatchId(file.patchId)}
        alt={file.name}
        className="object-cover w-full"
      />
    ),
    video: (
      <video
        src={utilsWalrus.getQuiltPatchId(file.patchId)}
        controls={true}
        className="aspect-video object-cover w-full"
      />
    ),
    markdown:
      file.name === "README.md" ? (
        <ArtifactFileReadme file={file} />
      ) : (
        <ArtifactFileMarkdown file={file} />
      ),
    pdf: <ArtifactFilePDF file={file} />,
    fallback: (
      <ArtifactFileFallback file={file} rootId={rootId} onRefetch={onRefetch} />
    ),
  });
};
