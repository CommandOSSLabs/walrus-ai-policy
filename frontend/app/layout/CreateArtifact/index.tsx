import Vstack from "app/components/Vstack";
import Stack from "app/components/Stack";
import { useForm } from "react-hook-form";

import CreateArtifactHeader from "./CreateArtifactHeader";
import CreateArtifactResource from "./CreateArtifactResource";
import CreateArtifactDocument from "./CreateArtifactDocument";
import CreateArtifactSubmit from "./CreateArtifactSubmit";
import CreateArtifactTitle from "./CreateArtifactTitle";
import CreateArtifactDescription from "./CreateArtifactDescription";
import { RANDOM_CHARACTER } from "app/utils";

export interface CreateArtifactFieldProps {
  title: string;
  description: string;
  category: string;
  files: {
    id: string;
    hash?: string; // from old files
    file: File;

    // state
    isCompared?: boolean;
    isRemoved?: boolean;
  }[];
}

export default () => {
  const {
    setValue,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<CreateArtifactFieldProps>();

  return (
    <Stack className="gap-8 pt-8 pb-14 px-4 sm:px-0 mx-auto max-w-xl">
      <CreateArtifactHeader type="create" />

      <Vstack className="gap-6 w-full">
        <CreateArtifactTitle control={control} />

        <CreateArtifactDescription control={control} />

        <CreateArtifactResource control={control} setValue={setValue} />

        <CreateArtifactDocument
          control={control}
          upload={async ({ files, fields, append, update }) => {
            // handle duplicate
            for (const [index, field] of fields.entries()) {
              const newFileIndex = files?.findIndex(
                (file) => file?.name === field?.file?.name,
              );

              if (newFileIndex !== -1) {
                update(index, {
                  ...field,
                  file: files[newFileIndex],
                });

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
                })),
              );
            }
          }}
        />

        <CreateArtifactSubmit
          isSubmitting={isSubmitting}
          handleSubmit={handleSubmit}
        />
      </Vstack>
    </Stack>
  );
};
