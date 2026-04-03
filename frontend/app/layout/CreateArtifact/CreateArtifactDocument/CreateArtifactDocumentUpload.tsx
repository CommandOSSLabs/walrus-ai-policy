import UploadLine from "public/assets/line/upload.svg";
import Center from "app/components/Center";
import Typography from "app/components/Typography";
import Vstack from "app/components/Vstack";
import { createInputFile, forceToNumber } from "app/utils";
import { tv } from "tailwind-variants";

import useGetConfig from "app/hook/useGetConfig";
import { toast } from "sonner";
import { useState } from "react";
import Spinner from "app/components/Spinner";

export interface CreateArtifactDocumentUploadProps {
  upload: (files: File[]) => Promise<void>;
}

export default ({ upload }: CreateArtifactDocumentUploadProps) => {
  const { fileConfig } = useGetConfig();

  const [loading, setLoading] = useState<string>();

  const handleUpload = async (files: File[]) => {
    try {
      setLoading("uploading");

      if (files.length > forceToNumber(fileConfig.data)) {
        throw `File upload limit exceeded. Maximum is ${fileConfig.data}.`;
      }

      await upload(
        files.map(
          (file) =>
            new File([file], file.name.replaceAll(" ", "-"), {
              lastModified: file.lastModified,
              type: file.type,
            }),
        ),
      );
    } catch (error) {
      toast.error(JSON.stringify(error, null, 4));
    } finally {
      setLoading(undefined);
    }
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
          loading?.length && "pointer-events-none",

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
      {loading?.length ? (
        <Spinner className="size-6" />
      ) : (
        <UploadLine className="size-6 pointer-events-none" />
      )}

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
