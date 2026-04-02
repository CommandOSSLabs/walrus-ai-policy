import { useState } from "react";
import useWalBalance from "app/hook/useWalBalance";

import Hstack from "app/components/Hstack";
import { tv } from "tailwind-variants";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "app/components/ui/popover";
import { shorten } from "app/utils";
import Jazzicon from "app/components/Jazzicon";
import HeaderNotification from "../HeaderNotification";
import { useDAppKit } from "@mysten/dapp-kit-react";

import CheckedLine from "public/assets/line/checked.svg";
import CopyLine from "public/assets/line/copy.svg";

interface HeaderProfileProps {
  address: string;
}

export default ({ address }: HeaderProfileProps) => {
  const [copied, setCopied] = useState(false);

  const { data, isLoading } = useWalBalance(address);

  const { disconnectWallet, networks } = useDAppKit();

  console.log(networks);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <HeaderNotification />

      <Popover>
        <PopoverTrigger>
          <Jazzicon
            address={address}
            className="size-8 min-w-8 cursor-pointer rounded-full ring-2 ring-transparent hover:ring-[#46F1CF]/40 transition-all duration-200"
          />
        </PopoverTrigger>

        <PopoverContent
          sideOffset={12}
          align="end"
          className={tv({
            base: [
              "w-64 p-0 overflow-hidden",
              "bg-[#141921] border border-white/8",
              "shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
            ],
          })()}
        >
          {/* teal accent bar */}
          <div className="h-px w-full bg-linear-to-r from-transparent via-[#46F1CF]/60 to-transparent" />

          <div className="px-4 pt-4 pb-3 flex flex-col gap-3">
            {/* Avatar + address row */}
            <Hstack className="gap-3 items-center">
              <Jazzicon
                address={address}
                className="size-9 shrink-0 rounded-full"
              />

              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-neutral-500 font-medium tracking-widest uppercase mb-0.5">
                  Address
                </p>
                <p className="text-sm font-mono text-white/90 truncate">
                  {shorten(address)}
                </p>
              </div>

              {/* Copy button */}
              <button
                onClick={handleCopy}
                title="Copy full address"
                className={tv({
                  base: [
                    "shrink-0 size-7 rounded flex items-center justify-center",
                    "text-neutral-400 transition-all duration-200",
                    "hover:bg-white/8 hover:text-white",
                  ],
                })()}
              >
                {copied ? (
                  <CheckedLine className="text-[#46F1CF]" />
                ) : (
                  <CopyLine className="size-3.5" />
                )}
              </button>
            </Hstack>

            {/* Network badge + WAL balance */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-[#46F1CF] shadow-[0_0_4px_#46F1CF]" />
                <span className="text-[11px] text-neutral-500 font-medium tracking-wide">
                  Testnet
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {isLoading ? (
                  <span className="h-2.5 w-10 rounded bg-white/10 animate-pulse" />
                ) : (
                  <span className="text-[13px] font-mono font-semibold text-white/90">
                    {data ?? "—"}
                  </span>
                )}
                <span className="text-[11px] font-medium text-[#46F1CF]/80 tracking-wide">
                  WAL
                </span>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-white/6 mx-0" />

          {/* Disconnect */}
          <div className="px-4 py-3">
            <button
              onClick={disconnectWallet}
              className={tv({
                base: [
                  "w-full h-8 rounded text-xs font-semibold tracking-wide",
                  "text-red-400/80 border border-red-500/20",
                  "hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/35",
                  "transition-all duration-200",
                ],
              })()}
            >
              Disconnect
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};
