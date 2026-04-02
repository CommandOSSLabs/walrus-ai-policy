import Typography from "app/components/Typography";
import Vstack from "app/components/Vstack";
import useGetConfig from "app/hook/useGetConfig";
import { forceToNumber } from "app/utils";
import { Controller, type Control } from "react-hook-form";
import type { CreateArtifactFieldProps } from "..";
import Center from "app/components/Center";
import { Skeleton } from "app/components/ui/skeleton";

interface CreateArtifactDescriptionProps {
  control: Control<CreateArtifactFieldProps>;
}

export default ({ control }: CreateArtifactDescriptionProps) => {
  const { metadataConfig } = useGetConfig();

  return (
    <Vstack>
      <Typography className="input-heading">DESCRIPTION</Typography>

      <Controller
        name="description"
        control={control}
        rules={{
          required: true,
        }}
        render={({ field, formState }) => {
          const MAX = forceToNumber(metadataConfig.data?.description);

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
