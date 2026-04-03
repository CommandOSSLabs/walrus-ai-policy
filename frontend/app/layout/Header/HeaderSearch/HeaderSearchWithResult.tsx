import FilesLine from "public/assets/line/files.svg";

import Typography from "app/components/Typography";
import Center from "app/components/Center";
import Flex from "app/components/Flex";
import Vstack from "app/components/Vstack";

import { Link } from "react-router";
import type { ArtifactsQuery } from "app/services/graphql-app/generated";

interface HeaderSearchWithResultProps {
  artifacts: ArtifactsQuery["artifacts"]["items"];
  onClose: () => void;
}

export default ({ artifacts, onClose }: HeaderSearchWithResultProps) => {
  return (
    <div>
      <Typography
        font="jetbrains"
        className="text-[#46F1CF] text-xs p-4 border-b border-[#3B4A45]"
      >
        Search Results
      </Typography>

      <div className="max-h-96 overflow-y-auto">
        {artifacts.map((meta) => (
          <Link
            key={meta.suiObjectId}
            to={`/artifact/${meta.suiObjectId}`}
            className="not-last:border-b not-last:border-[#3B4A45] block"
            onClick={onClose}
          >
            <Flex className="gap-3 px-4 py-2.5 hover:bg-[#84948F]/12 transition-all">
              <Center className="size-10 bg-[#0D111D] border border-[#352F2F] rounded-sm">
                <FilesLine className="size-4" />
              </Center>

              <Vstack className="flex-1">
                <Typography className="text-white/65 text-xs line-clamp-2">
                  {meta.title}
                </Typography>

                <Typography
                  font="jetbrains"
                  className="text-[#84948F] text-xs font-medium uppercase"
                >
                  {meta.category}
                </Typography>
              </Vstack>
            </Flex>
          </Link>
        ))}
      </div>
    </div>
  );
};
