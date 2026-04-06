import type { ArtifactFile } from "app/services/graphql-app/generated";
import ArtifactFileList from "./ArtifactFileList";
import { Link } from "react-router";
import ArtifactFilePDF from "./ArtifactFilePDF";
import ArtifactFileMarkdown from "./ArtifactFileMarkdown";
import utilsWalrus from "app/utils/utils.walrus";
import ArtifactFileSVG from "./ArtifactFileSVG";
import ArtifactFileCSV from "./ArtifactFileCSV";
import Flex from "app/components/Flex";
import { renderSectionFile } from "app/utils";
import Typography from "app/components/Typography";
import Stack from "app/components/Stack";

interface ArtifactFilePreviewProps {
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
      <div className="min-w-96 hidden min-[992px]:block">
        <ArtifactFileList
          files={files}
          rootId={rootId || suiObjectId}
          onRefetch={onRefetch}
          variant={{
            className: `sticky top-18 max-h-[calc(100dvh-4.5rem-1.5rem)] overflow-y-auto`,
          }}
        />
      </div>

      <div className="flex-1">
        {(function () {
          if (!getSelectFile) {
            return (
              <Stack className="text-[#BACAC4] border border-[#352F2F] py-16">
                <Typography>404 - page not found</Typography>

                <Typography>
                  the list file does not contain the path&nbsp;
                  <Typography variant="span" className="text-white font-medium">
                    {select}
                  </Typography>
                </Typography>
              </Stack>
            );
          }

          return (
            <>
              <Flex className="gap-1.5 h-10 items-center text-sm sticky top-18 bg-background">
                <Link to={`/artifact/${suiObjectId}`}>
                  <Typography className="text-blue-400">Root</Typography>
                </Link>

                <Typography className="text-white/65">/</Typography>

                <Typography className="text-white/65">
                  {getSelectFile.name}
                </Typography>
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
              })}
            </>
          );
        })()}
      </div>
    </Flex>
  );
};
