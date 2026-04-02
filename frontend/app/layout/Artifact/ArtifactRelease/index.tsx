import Vstack from "app/components/Vstack";
import Stack from "app/components/Stack";
import { useForm } from "react-hook-form";

import type { CreateArtifactFieldProps } from "app/layout/CreateArtifact";
import type { ArtifactQuery } from "app/services/graphql-app/generated";
import CreateArtifactHeader from "app/layout/CreateArtifact/CreateArtifactHeader";
import CreateArtifactResource from "app/layout/CreateArtifact/CreateArtifactResource";
import { Skeleton } from "app/components/ui/skeleton";
import ArtifactReleaseGoBack from "./ArtifactReleaseGoBack";
import CreateArtifactTitle from "app/layout/CreateArtifact/CreateArtifactTitle";
import CreateArtifactDescription from "app/layout/CreateArtifact/CreateArtifactDescription";
import ArtifactReleaseSubmit from "./ArtifactReleaseSubmit";
import ArtifactReleaseDocument from "./ArtifactReleaseDocument";

import ArtifactReleaseAuthorization from "./ArtifactReleaseAuthorization";

interface ArtifactReleaseProps {
  artifact: NonNullable<ArtifactQuery["artifact"]>;
  isAdmin: boolean;
  isLoading: boolean;
  onRefetch: () => void;
}

export default ({
  artifact,
  isAdmin,
  isLoading,
  onRefetch,
}: ArtifactReleaseProps) => {
  const {
    setValue,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<CreateArtifactFieldProps>({
    defaultValues: {
      title: artifact.title,
      description: artifact.description,
      category: artifact.category,
      files: artifact.files.map((file) => ({
        isCompared: false,
        hash: file.hash,
        id: file.patchId,
        file: new File([new ArrayBuffer(file.sizeBytes)], file.name, {
          type: file.mimeType,
        }),
      })),
    },
  });

  if (isLoading) {
    return (
      <Vstack className="container mt-8 mb-14">
        <Skeleton className="w-21.5 h-8" />

        <Skeleton className="mx-auto max-w-xl min-h-dvh w-full" />
      </Vstack>
    );
  }

  if (!isAdmin) {
    return <ArtifactReleaseAuthorization />;
  }

  return (
    <Vstack className="container mt-8 mb-14">
      <ArtifactReleaseGoBack />

      <Stack className="gap-8 mt-8 mx-auto max-w-xl">
        <CreateArtifactHeader type="release" />

        <Vstack className="gap-6 w-full">
          <CreateArtifactTitle control={control} />

          <CreateArtifactDescription control={control} />

          <CreateArtifactResource control={control} setValue={setValue} />

          <ArtifactReleaseDocument control={control} files={artifact.files} />

          <ArtifactReleaseSubmit
            rootId={artifact?.rootId || artifact.suiObjectId}
            parentId={artifact?.parentId ? artifact.suiObjectId : undefined}
            isSubmitting={isSubmitting}
            handleSubmit={handleSubmit}
            onRefetch={onRefetch}
          />
        </Vstack>
      </Stack>
    </Vstack>
  );
};
