import DownloadLine from "public/assets/line/download.svg";
import FilesLine from "public/assets/line/files.svg";
// import FolderLine from "public/assets/line/folder.svg";
import Hstack from "app/components/Hstack";
import Typography from "app/components/Typography";
import Center from "app/components/Center";
import { tv } from "tailwind-variants";
import { type ArtifactFile } from "app/services/graphql-app/generated";
import { formatBytesSizes, shorten } from "app/utils";
import utilsWalrus from "app/utils/utils.walrus";

import OpenBookLine from "public/assets/line/open-book.svg";

interface ArtifactFilesProps {
  files: ArtifactFile[];
}

export default ({ files }: ArtifactFilesProps) => {
  return (
    <>
      <div className="bg-[#080E1B] border border-[#352F2F] rounded-xl w-full">
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

        {files.map((meta, index) => {
          return (
            <Center
              key={index}
              className={tv({
                base: [
                  "text-[#BACAC4] text-xs h-10",
                  "px-3.5",
                  "justify-between",
                  "not-last:border-b not-last:border-inherit",
                ],
              })()}
            >
              <Hstack>
                <FilesLine />

                <Typography font="jetbrains">
                  {shorten(meta.patchId)} - {meta.mimeType}
                </Typography>
              </Hstack>

              <Hstack>
                <Typography>{formatBytesSizes(meta.sizeBytes)}</Typography>

                <button
                  onClick={async () => {
                    const kaka = await fetch(
                      utilsWalrus.getQuiltPatchId(meta.patchId),
                    );

                    console.log(kaka);
                  }}
                >
                  <DownloadLine />
                </button>
              </Hstack>
            </Center>
          );
        })}
      </div>

      <div className="border border-[#352F2F] rounded-xl">
        <Hstack className="text-white justify-start h-10 px-3.5 border-b border-[#352F2F]">
          <OpenBookLine />

          <Typography>README</Typography>
        </Hstack>

        <div className="p-3.5">
          <Typography className="text-[#BACAC4]">
            This artifact contains the complete technical specification for a
            novel consensus algorithm designed for decentralized archival
            storage networks. The algorithm combines sharded binary tree
            structures with proof-of-storage validation to ensure data integrity
            and availability across distributed nodes. Key innovations include:
            • Parallel validation across shard boundaries • Adaptive difficulty
            adjustment based on network capacity • Byzantine fault tolerance up
            to 33% malicious nodes • Sub-second finality for storage commitments
            The specification includes formal proofs, reference implementations,
            and integration guidelines for existing blockchain infrastructures.
          </Typography>
        </div>
      </div>
    </>
  );
};
