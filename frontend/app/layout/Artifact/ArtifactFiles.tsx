import DownloadLine from "public/assets/line/download.svg";
import FilesLine from "public/assets/line/files.svg";
import FolderLine from "public/assets/line/folder.svg";
import Hstack from "app/components/Hstack";
import Typography from "app/components/Typography";
import Center from "app/components/Center";
import { tv } from "tailwind-variants";
import { type ArtifactFile } from "app/services/graphql-app/generated";
import { downloadFileWithBlob, formatBytesSizes } from "app/utils";
import utilsWalrus from "app/utils/utils.walrus";
import { useRef, useState } from "react";
import useClickOutside from "app/hook/useClickOutside";
import Spinner from "app/components/Spinner";
import { extension } from "mime-types";

interface ArtifactFilesProps {
  files: ArtifactFile[];
}

export default ({ files }: ArtifactFilesProps) => {
  const [loading, setLoading] = useState<string>();

  const fileRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => {
    removeSelectedFile();
  });

  const addSelectedFile = (currentTarget: EventTarget & HTMLButtonElement) => {
    fileRef.current = currentTarget;
    fileRef.current?.classList.add("isSelected");
  };

  const removeSelectedFile = () => {
    if (fileRef.current?.classList.contains("isSelected")) {
      fileRef.current?.classList.remove("isSelected");
    }
  };

  return (
    <div
      ref={containerRef}
      className="bg-[#080E1B] border border-[#352F2F] rounded-xl w-full"
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
        return (
          <button
            key={meta.patchId}
            disabled={!!loading?.length}
            className={tv({
              base: [
                "flex gap-6 justify-between",
                "text-[#BACAC4] text-xs",
                "w-full h-10 px-3.5",
                "not-last:border-b not-last:border-inherit",
                "hover:bg-[#272B33]/65",

                "[&.isSelected]:bg-[#272B33]",
              ],
            })()}
            onClick={({ currentTarget }) => {
              removeSelectedFile();
              addSelectedFile(currentTarget);
            }}
            onDoubleClick={() => {
              removeSelectedFile();

              alert(`preview ${meta.mimeType}`);
            }}
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

                      if (!request.ok) throw new Error("Download failed");

                      const blob = await request.blob();

                      downloadFileWithBlob(blob, meta.mimeType, meta.name);
                    } finally {
                      setLoading(undefined);
                    }
                  }}
                />
              )}
            </Hstack>
          </button>
        );
      })}
    </div>
  );
};
