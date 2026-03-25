import FilesLine from "public/assets/line/files.svg";
import FolderLine from "public/assets/line/folder.svg";
import CloseLine from "public/assets/line/close.svg";

import Center from "app/components/Center";
import Typography from "app/components/Typography";
import {
  type FieldArrayWithId,
  type UseFieldArrayRemove,
} from "react-hook-form";
import CreateArtifactDocumentHeader from "./CreateArtifactDocumentHeader";
import { formatBytesSizes, sumNumber } from "app/utils";
import Hstack from "app/components/Hstack";
import type { CreateArtifactFieldProps } from "..";
import Vstack from "app/components/Vstack";

interface CreateArtifactDocumentPreviewProps {
  fields: FieldArrayWithId<CreateArtifactFieldProps>[];
  remove: UseFieldArrayRemove;
}

export default ({ fields, remove }: CreateArtifactDocumentPreviewProps) => {
  return (
    <div className="text-[#CBD5E1] text-xs bg-[#080E1B] border border-[#352F2F] rounded-xl">
      <Center className="h-12 px-3.5 justify-between bg-[#272B33]/65 border-b border-[#352F2F]">
        <CreateArtifactDocumentHeader
          heading="FILES"
          body={`${fields.length} out of 100`}
        />

        <CreateArtifactDocumentHeader
          heading="SIZES"
          body={formatBytesSizes(
            sumNumber(fields.map(({ file }) => file.size)),
          )}
        />
      </Center>

      <Vstack className="max-h-52 overflow-y-scroll">
        {fields.map(({ file, id }, index) => {
          const isFolder = file.type.endsWith(".zip");

          return (
            <Center
              key={id}
              className="justify-between min-h-11 px-4 not-last:border-b not-last:border-[#352F2F]"
            >
              <Hstack>
                {isFolder ? <FolderLine /> : <FilesLine />}

                <Typography font="jetbrains">{file.name}</Typography>
              </Hstack>

              <Hstack>
                <Typography font="jetbrains">
                  {formatBytesSizes(file.size)}
                </Typography>

                <button
                  className="bg-[#2A303F] size-6 rounded-full flex items-center justify-center"
                  onClick={() => remove(index)}
                >
                  <CloseLine className="size-3" />
                </button>
              </Hstack>
            </Center>
          );
        })}
      </Vstack>
    </div>
  );
};
