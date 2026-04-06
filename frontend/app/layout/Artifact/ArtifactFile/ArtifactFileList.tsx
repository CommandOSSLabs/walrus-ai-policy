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
import { useSearchParams } from "react-router";

interface ArtifactFileListProps {
  files: ArtifactFile[];
  rootId: string;
  onRefetch: () => void;
  variant?: HTMLAttributes<HTMLDivElement>;
}

export default ({
  files,
  rootId,
  onRefetch,
  variant,
}: ArtifactFileListProps) => {
  const [loading, setLoading] = useState<string>();
  const [params, setSearchParams] = useSearchParams();

  const incrementDownload = useIncrementDownloadMutation(graphqlApp.client);

  return (
    <div
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

      {files.map((meta) => (
        <button
          key={meta.patchId}
          disabled={loading === meta.patchId}
          onClick={() => {
            params.set("file", meta.name);

            setSearchParams(params);
          }}
          className={tv({
            base: [
              "flex gap-6 justify-between",
              "text-[#BACAC4] text-xs",
              "w-full h-10 px-3.5",
              "not-last:border-b not-last:border-inherit",
              "hover:bg-[#272B33]/65",
            ],
          })()}
        >
          <Hstack>
            {extension(meta.mimeType) === "zip" ? (
              <FolderLine />
            ) : (
              <FilesLine />
            )}

            <Typography
              font="jetbrains"
              className="text-left line-clamp-1 flex-1"
            >
              {meta.name}
            </Typography>
          </Hstack>

          <Hstack className="whitespace-pre">
            <Typography>{formatBytesSizes(meta.sizeBytes)}</Typography>

            {loading === meta.patchId ? (
              <Spinner />
            ) : (
              <DownloadLine
                onClick={async (event) => {
                  try {
                    event.stopPropagation();

                    setLoading(meta.patchId);

                    const request = await fetch(
                      utilsWalrus.getQuiltPatchId(meta.patchId),
                    );

                    if (!request.ok) {
                      throw new Error(`Download failed for ${meta.name}`);
                    }

                    const blob = await request.blob();

                    downloadFileWithBlob(blob, meta.mimeType, meta.name);

                    incrementDownload.mutate(
                      {
                        rootId,
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
        </button>
      ))}
    </div>
  );
};
