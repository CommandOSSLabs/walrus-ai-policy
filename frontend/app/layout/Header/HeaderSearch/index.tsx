import SearchLine from "public/assets/line/search.svg";
import CloseLine from "public/assets/line/close.svg";

import { useState } from "react";
import { tv } from "tailwind-variants";
import useDebounce from "app/hook/useDebounce";

export default () => {
  const [search, setSearch] = useState<string>();

  const debounced = useDebounce(search);

  console.log("debounced", debounced);

  return (
    <div className="hidden md:block relative text-[#84948F]">
      <input
        placeholder="search artifacts, topics, authors..."
        value={search || ""}
        onChange={({ currentTarget }) => setSearch(currentTarget.value)}
        className={tv({
          base: [
            "min-w-80 lg:min-w-100 h-8 pl-4 pr-10 bg-[#191F2D]",
            "text-xs placeholder-inherit",
            "border border-[#3B4A45] rounded-xs outline-none",
          ],
        })()}
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
