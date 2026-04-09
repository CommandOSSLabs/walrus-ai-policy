import Typography from "app/components/Typography";
import Vstack from "app/components/Vstack";
import useGetConfig from "app/hook/useGetConfig";
import { forceToNumber } from "app/utils";
import { Controller, type Control } from "react-hook-form";
import type { CreateArtifactFieldProps } from "..";
import { Skeleton } from "app/components/ui/skeleton";
import Center from "app/components/Center";
import useUtf8Bytes from "app/hook/useUtf8Bytes";

interface CreateArtifactTitleProps {
  control: Control<CreateArtifactFieldProps>;
}

export default ({ control }: CreateArtifactTitleProps) => {
  const { metadataConfig } = useGetConfig();

  const { getByteLength } = useUtf8Bytes();

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
                {...field}
                placeholder="Enter the title of the artifact."
                className="input-bold h-14"
                disabled={formState.isSubmitting}
                onChange={({ currentTarget }) => {
                  if (getByteLength(currentTarget.value) > MAX) {
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
                    {`${getByteLength(field.value)}/${MAX}`}
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
