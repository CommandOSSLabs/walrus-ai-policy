import Typography from "app/components/Typography";
import Flex from "app/components/Flex";

import { Link } from "react-router";
import type { SearchQuery } from "app/services/graphql-app/generated";
import { Badge } from "app/components/ui/badge";
import utilsConstants from "app/utils/utils.constants";
import { tv } from "tailwind-variants";

interface HeaderSearchWithResultProps {
  search: SearchQuery["search"];
  onClose: () => void;
}

export default ({ search, onClose }: HeaderSearchWithResultProps) => {
  return (
    <div>
      <Typography
        font="jetbrains"
        className="text-[#46F1CF] text-xs p-4 border-b border-[#3B4A45]"
      >
        Search Results
      </Typography>

      <div className="max-h-96 overflow-y-auto">
        {search.items.map(({ artifact, aiTags }) => {
          const getTypeResource = utilsConstants.FORMAT_RESOURCE.find(
            (resource) => resource.key === artifact.category,
          );

          return (
            <Link
              key={artifact.suiObjectId}
              to={`/artifact/${artifact.suiObjectId}`}
              className="not-last:border-b not-last:border-[#3B4A45] block"
              onClick={onClose}
            >
              <div className="space-y-3 px-4 py-2.5 hover:bg-[#84948F]/12 transition-all">
                <Badge
                  active={getTypeResource?.type}
                  type={getTypeResource?.type}
                  className="text-2xs whitespace-pre px-3 py-0.5 w-fit"
                >
                  <Typography font="jetbrains">{artifact.category}</Typography>
                </Badge>

                <div className="space-y-0.5">
                  <Typography className="text-white font-semibold line-clamp-1">
                    {artifact.title}
                  </Typography>

                  <Typography className="text-white/45 text-xs line-clamp-2">
                    {artifact.description}
                  </Typography>
                </div>

                <Flex className="gap-2">
                  {[`Version ${artifact.version}`, ...(aiTags || [])].map(
                    (meta) => (
                      <Typography
                        key={meta}
                        font="jetbrains"
                        className={tv({
                          base: [
                            "bg-[#0D111D] border border-[#352F2F] rounded-full",
                            "text-white/80 text-2xs font-medium uppercase",
                            "px-3.5 py-1.5",
                          ],
                        })()}
                      >
                        {meta}
                      </Typography>
                    ),
                  )}
                </Flex>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
