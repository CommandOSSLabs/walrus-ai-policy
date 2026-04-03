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
import utilsSui from "app/utils/utils.sui";
import Typography from "app/components/Typography";
import useSuiNs from "app/hook/useSuiNs";
import { Skeleton } from "app/components/ui/skeleton";

interface HeaderProfileProps {
  address: string;
}

export default ({ address }: HeaderProfileProps) => {
  const [copied, setCopied] = useState(false);

  const suiNS = useSuiNs(address);
  const walBalance = useWalBalance(address);

  const { disconnectWallet } = useDAppKit();

  const handleCopy = () => {
    navigator.clipboard.writeText(address);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (suiNS.isLoading || walBalance.isLoading) {
    return <Skeleton className="size-8 rounded-full" />;
  }

  return (
    <>
      <HeaderNotification />

      <Popover>
        <PopoverTrigger>
          <div className="size-8 min-w-8 rounded-full overflow-hidden">
            {suiNS.data?.avatar ? (
              <img src={suiNS.data.avatar} className="size-full" />
            ) : (
              <Jazzicon address={address} className="size-full" />
            )}
          </div>
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
              <div className="size-9 rounded-full overflow-hidden">
                {suiNS.data?.avatar ? (
                  <img src={suiNS.data.avatar} className="size-full" />
                ) : (
                  <Jazzicon address={address} className="size-full" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-neutral-500 font-medium tracking-widest uppercase mb-0.5">
                  Address
                </p>
                <p className="text-sm font-mono text-white/90 truncate">
                  {suiNS.data?.name || shorten(address)}
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

                <Typography
                  font="jetbrains"
                  className="text-[11px] text-neutral-500 font-medium tracking-wide uppercase"
                >
                  {utilsSui.getSuiClient.network}
                </Typography>
              </div>

              <div className="flex items-center gap-1.5">
                <Typography className="text-[13px] font-mono font-semibold text-white/90">
                  {walBalance.data ?? "—"}
                </Typography>

                <Typography className="text-[11px] font-medium text-[#46F1CF]/80 tracking-wide">
                  WAL
                </Typography>
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
