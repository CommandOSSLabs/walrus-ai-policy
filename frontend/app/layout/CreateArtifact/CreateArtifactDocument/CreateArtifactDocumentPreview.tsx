import FilesLine from "public/assets/line/files.svg";
import FolderLine from "public/assets/line/folder.svg";
import CloseLine from "public/assets/line/close.svg";

import Center from "app/components/Center";
import Typography from "app/components/Typography";
import {
  type FieldArrayWithId,
  type UseFieldArrayRemove,
  type UseFieldArrayUpdate,
} from "react-hook-form";
import CreateArtifactDocumentHeader from "./CreateArtifactDocumentHeader";
import { formatBytesSizes, sumNumber } from "app/utils";
import Hstack from "app/components/Hstack";
import { extension } from "mime-types";
import { tv } from "tailwind-variants";
import type { CreateArtifactFieldProps } from "..";
import RevertLine from "public/assets/line/revert.svg";

interface CreateArtifactDocumentPreviewProps {
  fields: FieldArrayWithId<CreateArtifactFieldProps>[];
  remove: UseFieldArrayRemove;
  update: UseFieldArrayUpdate<CreateArtifactFieldProps>;
}

export default ({
  fields,
  remove,
  update,
}: CreateArtifactDocumentPreviewProps) => {
  return (
    <div className="text-[#CBD5E1] text-xs bg-[#080E1B] border border-[#352F2F] rounded-xl">
      <Center className="h-12 px-3.5 justify-between bg-[#272B33]/65 border-b border-[#352F2F]">
        <CreateArtifactDocumentHeader
          heading="FILES"
          body={`${fields.filter((field) => !field?.isRemoved).length} out of 100`}
        />

        <CreateArtifactDocumentHeader
          heading="SIZES"
          body={formatBytesSizes(
            sumNumber(fields.map(({ file }) => file.size)),
          )}
        />
      </Center>

      <div className="max-h-64 overflow-y-scroll">
        {fields.map((field, index) => (
          <Center
            key={field.id}
            className={tv({
              base: [
                field?.isCompared && "bg-[#46F1CF]/10 text-[#46F1CF]",

                field?.isRemoved &&
                  "bg-[#FF4D4D]/10 text-[#FF4D4D] line-through",

                "justify-between",
                "min-h-11 px-4",
                "not-last:border-b not-last:border-[#352F2F]",
              ],
            })()}
          >
            <Hstack>
              {(function () {
                if (extension(field.file.type) === "zip") {
                  return <FolderLine />;
                }

                return <FilesLine />;
              })()}

              <Typography font="jetbrains">{field.file.name}</Typography>
            </Hstack>

            <Hstack>
              <Typography font="jetbrains">
                {formatBytesSizes(field.file.size)}
              </Typography>

              <button
                className="bg-[#2A303F] border border-white/12 text-[#CBD5E1] size-6 rounded-full flex items-center justify-center"
                onClick={() => {
                  // revert old file when click undo
                  if (field?.isOld) {
                    // remove new files, if it exists
                    const newFileIndex = fields.findIndex(
                      (value) =>
                        value.file.name === field.file.name &&
                        value?.isCompared,
                    );

                    if (newFileIndex !== -1) {
                      remove(newFileIndex);
                    }

                    return update(index, {
                      ...field,
                      isRemoved: !field?.isRemoved,
                    });
                  }

                  // revert old file when remove new file
                  {
                    const oldFileIndex = fields.findIndex(
                      (value) =>
                        value.file.name === field.file.name && value?.isRemoved,
                    );

                    if (oldFileIndex !== -1) {
                      update(oldFileIndex, {
                        ...fields[oldFileIndex],
                        isRemoved: false,
                      });
                    }
                  }

                  // remove current file
                  remove(index);
                }}
              >
                {(function () {
                  if (field?.isRemoved) {
                    return <RevertLine className="size-3" />;
                  }

                  return <CloseLine className="size-3" />;
                })()}
              </button>
            </Hstack>
          </Center>
        ))}
      </div>
    </div>
  );
};
