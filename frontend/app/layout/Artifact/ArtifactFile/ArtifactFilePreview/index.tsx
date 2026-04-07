import type { ArtifactFile } from "app/services/graphql-app/generated";
import ArtifactFileList from "../ArtifactFileList";
import ArtifactFilePDF from "../ArtifactFilePDF";
import ArtifactFileMarkdown from "../ArtifactFileMarkdown";
import utilsWalrus from "app/utils/utils.walrus";
import ArtifactFileSVG from "../ArtifactFileSVG";
import ArtifactFileCSV from "../ArtifactFileCSV";
import Flex from "app/components/Flex";
import { renderSectionFile } from "app/utils";

import ArtifactFilePreviewExpand from "./ArtifactFilePreviewExpand";
import ArtifactFilePreview404 from "./ArtifactFilePreview404";
import ArtifactFilePreviewDirectory from "./ArtifactFilePreviewDirectory";
import ArtifactFileFallback from "../ArtifactFileFallback";

export interface ArtifactFilePreviewProps {
  files: ArtifactFile[];
  rootId: string | undefined;
  suiObjectId: string;
  select: string;
  onRefetch: () => void;
}

export default ({
  files,
  rootId,
  suiObjectId,
  select,
  onRefetch,
}: ArtifactFilePreviewProps) => {
  const getSelectFile = files.find((file) => file.name === select);

  return (
    <Flex className="gap-6 p-4 flex-col min-[992px]:flex-row">
      <div className="min-w-96 max-w-96 min-h-dvh hidden min-[992px]:block border border-[#352F2F]">
        <ArtifactFileList
          files={files}
          rootId={rootId}
          suiObjectId={suiObjectId}
          select={select}
          onRefetch={onRefetch}
          variant={{
            className: `sticky top-18 max-h-[calc(100dvh-4.5rem-1.5rem)] overflow-y-auto border-none`,
          }}
        />
      </div>

      <div className="flex-1">
        {(function () {
          if (!getSelectFile) {
            return (
              <ArtifactFilePreview404
                select={select}
                suiObjectId={suiObjectId}
              />
            );
          }

          return (
            <>
              <Flex className="gap-3 h-12 items-center sticky top-18 bg-background">
                <ArtifactFilePreviewExpand
                  files={files}
                  rootId={rootId}
                  suiObjectId={suiObjectId}
                  select={select}
                  onRefetch={onRefetch}
                />

                <ArtifactFilePreviewDirectory
                  suiObjectId={suiObjectId}
                  name={getSelectFile.name}
                />
              </Flex>

              {renderSectionFile(getSelectFile.mimeType, {
                csv: <ArtifactFileCSV file={getSelectFile} />,
                svg: <ArtifactFileSVG file={getSelectFile} />,
                image: (
                  <img
                    src={utilsWalrus.getQuiltPatchId(getSelectFile.patchId)}
                    alt={getSelectFile.name}
                    className="aspect-video object-cover"
                  />
                ),
                video: (
                  <video
                    src={utilsWalrus.getQuiltPatchId(getSelectFile.patchId)}
                    controls={true}
                    className="aspect-video object-cover"
                  />
                ),
                markdown: <ArtifactFileMarkdown file={getSelectFile} />,
                pdf: <ArtifactFilePDF file={getSelectFile} />,
                fallback: (
                  <ArtifactFileFallback
                    file={getSelectFile}
                    rootId={rootId || suiObjectId}
                    onRefetch={onRefetch}
                  />
                ),
              })}
            </>
          );
        })()}
      </div>
    </Flex>
  );
};
