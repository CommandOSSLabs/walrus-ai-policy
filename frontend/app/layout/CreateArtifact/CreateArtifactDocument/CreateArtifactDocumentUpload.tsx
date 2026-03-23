import UploadLine from "public/assets/line/upload.svg";
import Center from "app/components/Center";
import Typography from "app/components/Typography";
import Vstack from "app/components/Vstack";
import { createInputFile, RANDOM_CHARACTER } from "app/utils";
import { tv } from "tailwind-variants";
import { type UseFieldArrayAppend } from "react-hook-form";
import type { CreateArtifactFieldProps } from "..";

interface CreateArtifactDocumentUploadProps {
  append: UseFieldArrayAppend<CreateArtifactFieldProps>;
}

export default ({ append }: CreateArtifactDocumentUploadProps) => {
  const handleUpload = (files: File[]) => {
    if (files.length > 100) {
      // code here
    }

    append(
      files.map((file) => ({
        file,
        id: RANDOM_CHARACTER(),
      })),
    );
  };

  return (
    <Center
      onDragOver={(event) => event.preventDefault()}
      onDragEnter={({ currentTarget }) => {
        currentTarget.classList.add("isDraging");
      }}
      onDragLeave={({ currentTarget }) => {
        currentTarget.classList.remove("isDraging");
      }}
      onDrop={(event) => {
        event.preventDefault();
        event.currentTarget.classList.remove("isDraging");

        handleUpload(Object.values(event.dataTransfer.files));
      }}
      className={tv({
        base: [
          "gap-4 flex-col h-45 cursor-pointer",
          "bg-[#46F1CF]/5 text-[#46F1CF]",
          "border-2 border-dashed border-[#46F1CF]/30 rounded-lg",

          "[&.isDraging]:border-[#46F1CF]",
        ],
      })()}
      onClick={() => {
        createInputFile({
          callback: handleUpload,
          options: {
            multiple: true,
          },
        });
      }}
    >
      <UploadLine className="size-6 pointer-events-none" />

      <Vstack className="gap-1 text-center pointer-events-none">
        <Typography font="grotesk" className="text-sm font-bold">
          Drop files here or click to upload.
        </Typography>

        <Typography font="jetbrains" className="text-[#64748B] text-2xs">
          All file types are supported.
        </Typography>
      </Vstack>
    </Center>
  );
};
