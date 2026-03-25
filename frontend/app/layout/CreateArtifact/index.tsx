import Vstack from "app/components/Vstack";
import Stack from "app/components/Stack";
import { useForm } from "react-hook-form";

import Typography from "app/components/Typography";

import CreateArtifactHeader from "./CreateArtifactHeader";
import CreateArtifactResource from "./CreateArtifactResource";
import CreateArtifactDocument from "./CreateArtifactDocument";
import CreateArtifactSubmit from "./CreateArtifactSubmit";

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
  const {
    register,
    setValue,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<CreateArtifactFieldProps>();

  return (
    <Stack className="gap-8 pt-8 pb-14 mx-auto max-w-xl">
      <CreateArtifactHeader />

      <Vstack className="gap-6 w-full">
        <Vstack>
          <Typography className="input-heading">TITLE</Typography>

          <input
            placeholder="Enter the title of the artifact."
            className="input-bold h-14"
            {...register("title", { required: true })}
          />
        </Vstack>

        <Vstack>
          <Typography className="input-heading">DESCRIPTION</Typography>

          <textarea
            placeholder="Enter the description of the artifact."
            className="input-bold min-h-32 resize-none"
            {...register("description", { required: true })}
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
