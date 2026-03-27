import Vstack from "app/components/Vstack";
import Stack from "app/components/Stack";
import { Controller, useForm } from "react-hook-form";

import Typography from "app/components/Typography";

import CreateArtifactHeader from "./CreateArtifactHeader";
import CreateArtifactResource from "./CreateArtifactResource";
import CreateArtifactDocument from "./CreateArtifactDocument";
import CreateArtifactSubmit from "./CreateArtifactSubmit";
import useGetConfig from "app/hook/useGetConfig";
import { forceToNumber } from "app/utils";

export interface CreateArtifactFieldProps {
  title: string;
  description: string;
  category: string;
  files: {
    id: string;
    file: File;
  }[];
}

export default () => {
  const { metadataConfig } = useGetConfig();

  const {
    setValue,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<CreateArtifactFieldProps>();

  return (
    <Stack className="gap-8 pt-8 pb-14 px-4 sm:px-0 mx-auto max-w-xl">
      <CreateArtifactHeader />

      <Vstack className="gap-6 w-full">
        <Vstack>
          <Typography className="input-heading">TITLE</Typography>

          <Controller
            name="title"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field, formState }) => {
              const MAX = forceToNumber(metadataConfig.data?.title);

              return (
                <Vstack>
                  <input
                    placeholder="Enter the title of the artifact."
                    className="input-bold h-14"
                    disabled={formState.isSubmitting}
                    name={field.name}
                    ref={field.ref}
                    value={field?.value || ""}
                    onChange={({ currentTarget }) => {
                      if (currentTarget.value.length > MAX) {
                        currentTarget.value = currentTarget.value.slice(0, MAX);
                      }

                      field.onChange(currentTarget.value);
                    }}
                  />

                  <Typography className="text-[#BACAC4]/65 text-sm text-right">
                    {`${forceToNumber(field.value?.length)}/${MAX}`}
                  </Typography>
                </Vstack>
              );
            }}
          />
        </Vstack>

        <Vstack>
          <Typography className="input-heading">DESCRIPTION</Typography>

          <Controller
            name="description"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field, formState }) => {
              const MAX = forceToNumber(metadataConfig.data?.descrpition);

              return (
                <Vstack>
                  <textarea
                    placeholder="Enter the description of the artifact."
                    className="input-bold min-h-32 resize-none"
                    disabled={formState.isSubmitting}
                    name={field.name}
                    ref={field.ref}
                    value={field?.value || ""}
                    onChange={({ currentTarget }) => {
                      if (currentTarget.value.length > MAX) {
                        currentTarget.value = currentTarget.value.slice(0, MAX);
                      }

                      field.onChange(currentTarget.value);
                    }}
                  />

                  <Typography className="text-[#BACAC4]/65 text-sm text-right">
                    {`${forceToNumber(field.value?.length)}/${MAX}`}
                  </Typography>
                </Vstack>
              );
            }}
          />
        </Vstack>

        <CreateArtifactResource control={control} setValue={setValue} />

        <CreateArtifactDocument control={control} />

        <CreateArtifactSubmit
          isSubmitting={isSubmitting}
          handleSubmit={handleSubmit}
        />
      </Vstack>
    </Stack>
  );
};
