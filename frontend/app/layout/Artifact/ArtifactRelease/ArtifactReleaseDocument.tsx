import Flex from "app/components/Flex";
import Typography from "app/components/Typography";
import type { CreateArtifactFieldProps } from "app/layout/CreateArtifact";
import CreateArtifactDocument from "app/layout/CreateArtifact/CreateArtifactDocument";
import type { ArtifactFile } from "app/services/graphql-app/generated";
import { computeSHA256, RANDOM_CHARACTER } from "app/utils";
import { Controller, type Control } from "react-hook-form";
import { tv } from "tailwind-variants";

const styleFile = tv({
  base: ["border rounded-xs", "py-1.5 px-2", "text-2xs font-bold uppercase"],
  variants: {
    status: {
      change: "bg-[#46F1CF]/10 border-[#46F1CF]/20 text-[#46F1CF]",
      delete: "bg-[#FF4D4D]/10 border-[#FF4D4D]/20 text-[#FF4D4D]",
    },
  },
});

interface ArtifactReleaseDocumentProps {
  control: Control<CreateArtifactFieldProps>;
  files: ArtifactFile[];
}

export default ({ control, files }: ArtifactReleaseDocumentProps) => {
  const getContentChange = async (newFile: File) => {
    const getPatchIdByNewFile = files.find(
      (file) => file.name === newFile.name,
    );

    if (!getPatchIdByNewFile) return true;

    const [oldHash, newHash] = await Promise.all([
      getPatchIdByNewFile.hash,

      computeSHA256(newFile),
    ]);

    return oldHash !== newHash;
  };

  return (
    <>
      <Controller
        control={control}
        name="files"
        render={({ field }) => {
          const newChange = field?.value?.filter((meta) => meta?.isCompared);

          const deleteChange = field?.value?.filter((meta) => meta?.isRemoved);

          return (
            <Flex className="-mb-4 gap-3 flex-wrap">
              <Typography
                font="jetbrains"
                className={styleFile({
                  status: "change",
                })}
              >
                new files: +{newChange.length}
              </Typography>

              <Typography
                font="jetbrains"
                className={styleFile({
                  status: "delete",
                })}
              >
                deleted files: +{deleteChange.length}
              </Typography>
            </Flex>
          );
        }}
      />

      <CreateArtifactDocument
        control={control}
        upload={async ({ files, fields, append, update, remove }) => {
          console.log("files", files);
          console.log("fields", fields);

          // handle duplicate
          for (const [index, field] of fields.entries()) {
            const newFileIndex = files?.findIndex(
              (file) => file?.name === field?.file?.name && !field?.isRemoved,
            );

            console.log("newFileIndex", newFileIndex);

            if (newFileIndex !== -1) {
              const isChanged = await getContentChange(files[newFileIndex]);

              // update new file because it's change
              if (isChanged) {
                // you should flag oldFile is removed
                if (field?.hash) {
                  update(index, {
                    ...field,
                    isRemoved: true,
                  });
                }

                /* you should check condition to update or append with new file
                    1. isCompared: meaning the file already uploaded
                    2. not isCompared: meaning the file completely fresh
                */
                if (field?.isCompared) {
                  update(index, {
                    id: field.id,
                    isCompared: true,
                    file: files[newFileIndex],
                  });
                } else {
                  append({
                    id: RANDOM_CHARACTER(),
                    isCompared: true,
                    file: files[newFileIndex],
                  });
                }
              }

              // revert old file because you uploaded, but you trying to push old file again
              if (!isChanged && field?.isCompared) {
                const oldFile = fields.findIndex(
                  (value) => value.file.name === field.file.name,
                );

                update(oldFile, {
                  ...fields[oldFile],
                  isRemoved: false,
                });

                remove(index);
              }

              // don't need append this file anymore
              delete files[newFileIndex];
              files = files.filter((file) => !!file);
            }
          }

          // after filter duplicate, if files exists we'll append
          if (files?.length) {
            append(
              files.map((file) => ({
                id: RANDOM_CHARACTER(),
                file,
                isCompared: true,
              })),
            );
          }
        }}
      />
    </>
  );
};
