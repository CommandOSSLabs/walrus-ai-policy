import CreateArtifactDocumentPreview from "./CreateArtifactDocumentPreview";
import CreateArtifactDocumentUpload from "./CreateArtifactDocumentUpload";
import {
  useFieldArray,
  type Control,
  type UseFieldArrayReturn,
} from "react-hook-form";
import type { CreateArtifactFieldProps } from "..";

interface CreateArtifactDocumentProps {
  control: Control<CreateArtifactFieldProps>;

  upload: (
    params: Pick<
      UseFieldArrayReturn<CreateArtifactFieldProps>,
      "append" | "update" | "remove" | "fields"
    > & {
      files: File[];
    },
  ) => Promise<void>;
}

export default ({ control, upload }: CreateArtifactDocumentProps) => {
  const { fields, append, update, remove } = useFieldArray({
    control,
    name: "files",
    keyName: "field_id",
    rules: {
      required: true,
    },
  });

  return (
    <>
      {fields?.length ? (
        <CreateArtifactDocumentPreview
          fields={fields}
          remove={remove}
          update={update}
        />
      ) : null}

      <CreateArtifactDocumentUpload
        upload={async (files) => {
          return await upload({
            files,
            fields,
            update,
            append,
            remove,
          });
        }}
      />
    </>
  );
};
