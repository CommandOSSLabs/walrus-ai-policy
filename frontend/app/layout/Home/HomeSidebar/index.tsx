import Typography from "app/components/Typography";
import ArrowLine from "public/assets/line/arrow.svg";
import { Checkbox } from "app/components/ui/checkbox";
import HomeSidebarCapacity from "./HomeSidebarCapacity";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "app/components/ui/collapsible";
import { useSearchParams } from "react-router";
import { tv } from "tailwind-variants";
import utilsConstants from "app/utils/utils.constants";
import type { ArtifactFilter } from "app/services/graphql-app/generated";

interface ListFilterProps {
  key: string;
  field: keyof ArtifactFilter;
  children: {
    key: string;
    value: string;
  }[];
}

export default () => {
  const [params, setSearchParams] = useSearchParams();

  const ListFilter: ListFilterProps[] = [
    // {
    //   key: "File Type",
    //   children: [
    //     ".pdf / Documentation",
    //     ".json / Metadata",
    //     ".mp4 / Multimedia",
    //     ".wasm / Executable",
    //   ],
    // },
    {
      key: "Resource Type",
      field: "category",
      children: utilsConstants.FORMAT_RESOURCE.map((meta) => ({
        key: meta.key,
        value: meta.key,
      })),
    },
  ];

  return (
    <aside
      className={tv({
        base: [
          "text-[#DDE2F5] text-xs",
          "bg-[#191F2D]/40",
          "border border-[#3B4A45] rounded-lg",
          "sticky top-18 w-72 h-fit",

          "hidden lg:block",
        ],
      })()}
    >
      {ListFilter.map((meta) => (
        <Collapsible
          key={meta.key}
          defaultOpen={true}
          className="p-4 border-b border-[#3B4A45]"
        >
          <CollapsibleTrigger className="group flex w-full justify-between">
            <Typography font="grotesk" className="font-bold">
              {meta.key}
            </Typography>

            <ArrowLine className="text-white transition-transform -rotate-90 group-data-[state=open]:rotate-90" />
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-3">
            {meta.children.map((children) => {
              const isActive = params
                .getAll(meta.field)
                ?.some((field) => field === children.value);

              return (
                <label
                  key={children.key}
                  className="flex gap-2 not-first:mt-2 cursor-pointer"
                >
                  <Checkbox
                    defaultChecked={isActive}
                    onCheckedChange={(isChecked) => {
                      if (isChecked) {
                        params.append("category", children.key);
                      } else {
                        params.delete("category", children.key);
                      }

                      setSearchParams(params);
                    }}
                  />

                  <Typography font="jetbrains" className="text-[#BACAC4]">
                    {children.key}
                  </Typography>
                </label>
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      ))}

      <HomeSidebarCapacity />
    </aside>
  );
};
