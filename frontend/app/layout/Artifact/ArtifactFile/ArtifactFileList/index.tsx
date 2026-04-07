import DownloadLine from "public/assets/line/download.svg";
import FilesLine from "public/assets/line/files.svg";
import FolderLine from "public/assets/line/folder.svg";
import Hstack from "app/components/Hstack";
import Typography from "app/components/Typography";
import Center from "app/components/Center";
import { tv } from "tailwind-variants";
import { type ArtifactFile } from "app/services/graphql-app/generated";
import { useIncrementDownloadMutation } from "app/services/graphql-app/generated";
import graphqlApp from "app/services/graphql-app";
import { downloadFileWithBlob, formatBytesSizes } from "app/utils";
import utilsWalrus from "app/utils/utils.walrus";
import { useState, type HTMLAttributes } from "react";
import Spinner from "app/components/Spinner";
import { extension } from "mime-types";
import { Link } from "react-router";

interface ArtifactFileListProps {
  files: ArtifactFile[];
  rootId: string | undefined;
  suiObjectId: string;
  select?: string;
  onRefetch: () => void;
  variant?: HTMLAttributes<HTMLDivElement>;
}

export default ({
  files,
  rootId,
  suiObjectId,
  select,
  onRefetch,
  variant,
}: ArtifactFileListProps) => {
  const [loading, setLoading] = useState<string>();

  const incrementDownload = useIncrementDownloadMutation(graphqlApp.client);

  return (
    <div
      {...variant}
      className={tv({
        base: ["bg-[#080E1B] border border-[#352F2F] rounded-xl w-full"],
      })({
        className: variant?.className,
      })}
    >
      <Center
        className={tv({
          base: [
            "justify-between",
            "bg-[#272B33]/65",
            "border-b border-inherit",
            "px-9 h-10",
            "text-xs font-bold",
          ],
        })()}
      >
        <Typography font="jetbrains">NAME</Typography>

        <Typography font="jetbrains">SIZE</Typography>
      </Center>

      {files.map((meta) => {
        const isSelectedFile = select === meta.name;
        const isLoading = loading === meta.patchId;

        return (
          <Link
            key={meta.patchId}
            to={`/artifact/${suiObjectId}?file=${meta.name}`}
            onClick={(event) => {
              if (isLoading) event.preventDefault();
            }}
            className={tv({
              base: [
                isSelectedFile && "bg-[#272B33]/65",

                "flex gap-6 justify-between",
                "text-[#BACAC4] text-xs",
                "w-full h-10 px-3.5",
                "not-last:border-b not-last:border-inherit",
                "hover:bg-[#272B33]/65",
              ],
            })()}
          >
            <Hstack className="min-w-0 flex-1">
              {isSelectedFile && <div className="bg-blue-400 h-full w-0.5" />}

              {extension(meta.mimeType) === "zip" ? (
                <FolderLine />
              ) : (
                <FilesLine />
              )}

              <Typography
                font="jetbrains"
                className="flex-1 truncate text-left"
              >
                {meta.name}
              </Typography>
            </Hstack>

            <Hstack className="whitespace-pre">
              <Typography>{formatBytesSizes(meta.sizeBytes)}</Typography>

              {isLoading ? (
                <Spinner />
              ) : (
                <DownloadLine
                  onClick={async (event) => {
                    try {
                      event.stopPropagation();
                      event.preventDefault();

                      setLoading(meta.patchId);

                      const request = await fetch(
                        utilsWalrus.getQuiltPatchId(meta.patchId),
                      );

                      if (!request.ok) {
                        throw new Error(`Download failed for ${meta.name}`);
                      }

                      downloadFileWithBlob(
                        await request.blob(),
                        meta.mimeType,
                        meta.name,
                      );

                      incrementDownload.mutate(
                        {
                          rootId: rootId || suiObjectId,
                        },
                        {
                          onSuccess: onRefetch,
                        },
                      );
                    } finally {
                      setLoading(undefined);
                    }
                  }}
                />
              )}
            </Hstack>
          </Link>
        );
      })}
    </div>
  );
};
