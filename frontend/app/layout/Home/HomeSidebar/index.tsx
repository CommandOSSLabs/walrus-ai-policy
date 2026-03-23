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

export default () => {
  const [params, setSearchParams] = useSearchParams();

  const ListFilter = [
    {
      key: "File Type",
      children: [
        ".pdf / Documentation",
        ".json / Metadata",
        ".mp4 / Multimedia",
        ".wasm / Executable",
      ],
    },
    {
      key: "Resource Type",
      children: ["Governance", "Research Archive", "System Core"],
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
            {meta.children.map((value) => {
              return (
                <label
                  key={value}
                  className="flex gap-2 not-first:mt-2 cursor-pointer"
                >
                  <Checkbox
                    onCheckedChange={(isChecked) => {
                      if (isChecked) {
                        params.append("sort", value);
                      } else {
                        params.delete("sort", value);
                      }

                      setSearchParams(params);
                    }}
                  />

                  <Typography font="jetbrains" className="text-[#BACAC4]">
                    {value}
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
