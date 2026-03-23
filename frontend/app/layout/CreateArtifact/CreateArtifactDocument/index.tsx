import CreateArtifactDocumentPreview from "./CreateArtifactDocumentPreview";
import CreateArtifactDocumentUpload from "./CreateArtifactDocumentUpload";
import { useFieldArray, type Control } from "react-hook-form";
import type { CreateArtifactFieldProps } from "..";

interface CreateArtifactDocumentProps {
  control: Control<CreateArtifactFieldProps>;
}

export default ({ control }: CreateArtifactDocumentProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "files",
  });

  return (
    <>
      {fields?.length ? (
        <CreateArtifactDocumentPreview fields={fields} remove={remove} />
      ) : null}

      <CreateArtifactDocumentUpload append={append} />
    </>
  );
};
