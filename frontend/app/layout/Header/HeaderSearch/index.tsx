import SearchLine from "public/assets/line/search.svg";
import CloseLine from "public/assets/line/close.svg";

import { useState } from "react";
import { tv } from "tailwind-variants";

export default () => {
  const [search, setSearch] = useState<string>();

  return (
    <div className="relative text-[#84948F]">
      <input
        className="w-100 h-8 pl-4 pr-10 bg-[#191F2D] border border-[#3B4A45] rounded-xs text-xs focus:outline-none"
        placeholder="search artifacts, topics, authors..."
        value={search || ""}
        onChange={({ currentTarget }) => setSearch(currentTarget.value)}
      />

      <button
        onClick={() => {
          if (search?.length) setSearch("");
        }}
        className={tv({
          base: [
            "absolute right-0 top-0 bottom-0",
            "size-8 flex items-center justify-center",
          ],
        })()}
      >
        {search?.length ? <CloseLine /> : <SearchLine />}
      </button>
    </div>
  );
};
