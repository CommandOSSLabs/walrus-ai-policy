import SearchLine from "public/assets/line/search.svg";
import CloseLine from "public/assets/line/close.svg";

import { useEffect, useState } from "react";
import { tv } from "tailwind-variants";
import useDebounce from "app/hook/useDebounce";
import { Dialog, DialogContent, DialogTrigger } from "app/components/ui/dialog";
import Typography from "app/components/Typography";
import Flex from "app/components/Flex";
import Vstack from "app/components/Vstack";
import {
  SortField,
  useArtifactsQuery,
} from "app/services/graphql-app/generated";
import graphqlApp from "app/services/graphql-app";
import { isValidSuiAddress } from "@mysten/sui/utils";
import HeaderSearchNoResult from "./HeaderSearchNoResult";
import { Skeleton } from "app/components/ui/skeleton";
import HeaderSearchWithResult from "./HeaderSearchWithResult";

export default () => {
  const [search, setSearch] = useState<string>();

  const debounced = useDebounce(search);

  const [open, setOpen] = useState(false);

  const { data, isLoading } = useArtifactsQuery(
    graphqlApp.client,
    {
      limit: 1000,
      offset: 0,
      sort: SortField.CreatedAtDesc,
      filter: {
        creator: isValidSuiAddress(String(debounced)) ? debounced : undefined,
        search: !isValidSuiAddress(String(debounced)) ? debounced : undefined,
      },
    },
    {
      enabled: !!debounced?.length,
    },
  );

  useEffect(() => {
    if (!open && search?.length) {
      setSearch(undefined);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={tv({
          base: [
            "bg-[#191F2D] size-8 justify-center md:px-4 md:w-full md:h-9 transition-all",
            "outline-none rounded-sm border border-green-900/65 hover:border-green-500",
            "flex items-center gap-2",
          ],
        })()}
      >
        <SearchLine className="size-4 text-[#84948f]" />

        <Typography
          font="inter"
          className="text-[#84948f] text-xs hidden md:block"
        >
          search artifacts, topics, authors...
        </Typography>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="w-lg py-0 md:px-0 ring-0"
        style={{
          maxWidth: "100%",
        }}
      >
        <Flex
          className={tv({
            base: [
              "border border-[#3B4A45] rounded-xl",
              "bg-[#141A28] overflow-hidden",
              "flex-col",
            ],
          })()}
        >
          <Flex className="relative items-center">
            <SearchLine className="size-5 absolute left-4" />

            <input
              placeholder="search artifacts, topics, authors..."
              value={search || ""}
              onChange={({ currentTarget }) => setSearch(currentTarget.value)}
              className={tv({
                base: [
                  "w-full h-14 pl-11",
                  "border-b border-[#3B4A45] outline-none",
                  "text-[#84948F]",
                ],
              })()}
            />

            <CloseLine className="size-5 absolute right-4" />
          </Flex>

          <div className="bg-[#1A2130] min-h-58">
            {(function () {
              if (isLoading) {
                return (
                  <Vstack className="max-h-96 px-4 py-2.5">
                    {[...Array(5)].map((_, index) => (
                      <Skeleton key={index} className="w-full min-h-14" />
                    ))}
                  </Vstack>
                );
              }

              if (!debounced?.length) {
                return (
                  <HeaderSearchNoResult
                    heading="Start searching"
                    body={`Find optimization reports, protocol authors, or
                    specific yield topics.`}
                  />
                );
              }

              if (!data?.artifacts?.items?.length) {
                return (
                  <HeaderSearchNoResult
                    heading="Nothing found"
                    body={`We couldn’t find anything. Try adjusting your search or
                    explore different topics.`}
                  />
                );
              }

              return (
                <HeaderSearchWithResult
                  artifacts={data.artifacts.items}
                  onClose={() => setOpen(false)}
                />
              );
            })()}
          </div>
        </Flex>
      </DialogContent>
    </Dialog>
  );
};
