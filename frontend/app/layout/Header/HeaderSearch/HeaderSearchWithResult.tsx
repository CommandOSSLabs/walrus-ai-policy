import CloseLine from "public/assets/line/close.svg";
import Typography from "app/components/Typography";
import Flex from "app/components/Flex";

import { Link } from "react-router";
import type { SearchQuery } from "app/services/graphql-app/generated";
import { Badge } from "app/components/ui/badge";
import utilsConstants from "app/utils/utils.constants";
import { tv } from "tailwind-variants";
import { formatGrammarCount } from "app/utils";

interface HeaderSearchWithResultProps {
  search: SearchQuery["search"];
  tags: string[] | undefined;
  setTags: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  onClose: () => void;
}

export default ({
  tags,
  search,
  setTags,
  onClose,
}: HeaderSearchWithResultProps) => {
  const handleFilter = (element: string) => {
    const isActive = tags?.some((tag) => tag === element);

    if (isActive) {
      const instance = tags?.filter((tag) => tag !== element);

      return setTags(instance);
    }

    setTags((prev) => [
      ...(prev?.filter((prev) => prev !== element) || []),
      element,
    ]);
  };

  return (
    <div>
      <div className="px-4 pt-4 space-y-2 border-b border-[#3B4A45]">
        <Typography font="jetbrains" className="text-[#46F1CF] text-xs">
          Filter by {formatGrammarCount("tag", search.availableTags.length)}
        </Typography>

        <Flex className="gap-2.5 pb-4 overflow-x-auto">
          {search.availableTags.map((meta) => {
            const isActive = tags?.some((tag) => tag === meta);

            return (
              <button
                key={meta}
                onClick={() => handleFilter(meta)}
                className={tv({
                  base: [
                    isActive
                      ? "border-green-500 bg-green-700/20 text-green-400"
                      : "border-neutral-500 bg-neutral-700/20 text-white/65",

                    "flex items-center gap-1",
                    "px-2 h-7 border rounded-sm",
                    "text-2xs font-medium uppercase whitespace-pre",
                  ],
                })()}
              >
                <Typography font="grotesk">{meta}</Typography>

                {isActive && <CloseLine className="size-3.5" />}
              </button>
            );
          })}
        </Flex>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {search.items.map(({ artifact, aiTags }) => {
          const getTypeResource = utilsConstants.FORMAT_RESOURCE.find(
            (resource) => resource.key === artifact.category,
          );

          return (
            <Link
              key={artifact.suiObjectId}
              to={`/artifact/${artifact.suiObjectId}`}
              onClick={onClose}
              className={tv({
                base: [
                  "not-last:border-b not-last:border-[#3B4A45]",
                  "flex flex-col gap-3",
                  "px-4 py-2.5 hover:bg-[#84948F]/12 transition-all",
                ],
              })()}
            >
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

              <Flex className="gap-1 flex-wrap whitespace-pre">
                {aiTags.map((meta) => (
                  <Typography
                    key={meta}
                    font="jetbrains"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();

                      handleFilter(meta);
                    }}
                    className={tv({
                      base: [
                        "border border-[#352F2F] rounded-full",
                        "text-white/80 text-2xs font-medium uppercase",
                        "px-3.5 py-1.5",
                        "bg-[#0D111D] hover:bg-neutral-700/65",
                      ],
                    })()}
                  >
                    {meta}
                  </Typography>
                ))}
              </Flex>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
