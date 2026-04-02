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
import { SortField, type ArtifactFilter } from "app/services/graphql-app/generated";
import { useCurrentAccount } from "@mysten/dapp-kit-react";

interface ListFilterProps {
  key: string;
  field: keyof ArtifactFilter;
  children: {
    key: string;
    value: string;
  }[];
}

const SORT_OPTIONS: { label: string; value: SortField }[] = [
  { label: "Newest First", value: SortField.CreatedAtDesc },
  { label: "Oldest First", value: SortField.CreatedAtAsc },
  { label: "Most Viewed", value: SortField.ViewCountDesc },
  { label: "Most Downloaded", value: SortField.DownloadCountDesc },
];

export default () => {
  const [params, setSearchParams] = useSearchParams();
  const currentAccount = useCurrentAccount();

  const currentSort = params.get("sort") as SortField | null;
  const isCreatedByMe = !!currentAccount?.address && params.get("creator") === currentAccount.address;

  const ListFilter: ListFilterProps[] = [
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
      <label
        className={tv({
          base: [
            "flex items-center gap-3 p-4 border-b border-[#3B4A45]",
            currentAccount?.address ? "cursor-pointer" : "opacity-40 cursor-not-allowed",
          ],
        })()}
      >
        <Checkbox
          checked={isCreatedByMe}
          disabled={!currentAccount?.address}
          onCheckedChange={(isChecked) => {
            if (isChecked) {
              params.set("creator", currentAccount!.address);
            } else {
              params.delete("creator");
            }
            setSearchParams(params);
          }}
        />

        <div className="flex flex-col gap-0.5">
          <Typography font="grotesk" className="font-bold">
            Created by me
          </Typography>

          {!currentAccount?.address && (
            <Typography font="jetbrains" className="text-[#BACAC4] text-2xs">
              Connect wallet to use
            </Typography>
          )}
        </div>
      </label>

      <Collapsible defaultOpen={true} className="p-4 border-b border-[#3B4A45]">
        <CollapsibleTrigger className="group flex w-full justify-between">
          <Typography font="grotesk" className="font-bold">
            Sort By
          </Typography>

          <ArrowLine className="text-white transition-transform -rotate-90 group-data-[state=open]:rotate-90" />
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-3">
          {SORT_OPTIONS.map((option) => {
            const isActive =
              (currentSort === null && option.value === SortField.CreatedAtDesc) ||
              currentSort === option.value;

            return (
              <label
                key={option.value}
                className="flex gap-2 not-first:mt-2 cursor-pointer"
              >
                <Checkbox
                  checked={isActive}
                  onCheckedChange={() => {
                    if (option.value === SortField.CreatedAtDesc) {
                      params.delete("sort");
                    } else {
                      params.set("sort", option.value);
                    }
                    setSearchParams(params);
                  }}
                />

                <Typography font="jetbrains" className="text-[#BACAC4]">
                  {option.label}
                </Typography>
              </label>
            );
          })}
        </CollapsibleContent>
      </Collapsible>

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
