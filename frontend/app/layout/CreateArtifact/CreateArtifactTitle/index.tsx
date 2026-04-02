import Typography from "app/components/Typography";
import Vstack from "app/components/Vstack";
import useGetConfig from "app/hook/useGetConfig";
import { forceToNumber } from "app/utils";
import { Controller, type Control } from "react-hook-form";
import type { CreateArtifactFieldProps } from "..";
import { Skeleton } from "app/components/ui/skeleton";
import Center from "app/components/Center";

interface CreateArtifactTitleProps {
  control: Control<CreateArtifactFieldProps>;
}

export default ({ control }: CreateArtifactTitleProps) => {
  const { metadataConfig } = useGetConfig();

  return (
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

              <Center className="justify-end">
                {metadataConfig.isLoading ? (
                  <Skeleton className="w-10 min-h-5" />
                ) : (
                  <Typography className="input-max">
                    {`${forceToNumber(field.value?.length)}/${MAX}`}
                  </Typography>
                )}
              </Center>
            </Vstack>
          );
        }}
      />
    </Vstack>
  );
};
