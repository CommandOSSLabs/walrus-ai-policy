import SearchLine from "public/assets/line/search.svg";
import CloseLine from "public/assets/line/close.svg";

import { useState } from "react";
import { tv } from "tailwind-variants";
import { useSearchParams } from "react-router";

export default () => {
  const [search, setSearch] = useState<string>();

  const [params, setSearchParams] = useSearchParams();

  return (
    <div className="hidden md:block relative text-[#84948F]">
      <input
        placeholder="search artifacts, topics, authors..."
        value={search || ""}
        onChange={({ currentTarget }) => setSearch(currentTarget.value)}
        className={tv({
          base: [
            "w-80 lg:w-100 h-8 pl-4 pr-10 bg-[#191F2D]",
            "text-xs placeholder-inherit",
            "border border-[#3B4A45] rounded-xs outline-none",
          ],
        })()}
        onKeyUp={({ key }) => {
          if (key === "Backspace" && !search?.length) {
            params.delete("creator");

            setSearchParams(params);
          }

          if (key === "Enter" && search?.length) {
            params.set("creator", search);

            setSearchParams(params);
          }
        }}
      />

      <button
        onClick={() => {
          if (search?.length) setSearch("");
        }}
        className={tv({
          base: [
            "absolute right-0 top-1/2 -translate-1/2",
            "size-6 flex items-center justify-center",
          ],
        })()}
      >
        {search?.length ? <CloseLine /> : <SearchLine />}
      </button>
    </div>
  );
};
