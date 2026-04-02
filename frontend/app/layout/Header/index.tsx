import { useCurrentAccount, useDAppKit } from "@mysten/dapp-kit-react";
import { useState } from "react";
import useWalBalance from "app/hook/useWalBalance";

import Center from "app/components/Center";
import ConnectWalletWrapper from "app/components/ConnectWalletWrapper";
import Hstack from "app/components/Hstack";
import { Link } from "react-router";
import { tv } from "tailwind-variants";

import PlusLine from "public/assets/line/plus.svg";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "app/components/ui/popover";
import { shorten } from "app/utils";
import Typography from "app/components/Typography";
import Jazzicon from "app/components/Jazzicon";
import HeaderSearch from "./HeaderSearch";
import HeaderNotification from "./HeaderNotification";

export default () => {
  const currentAccount = useCurrentAccount();
  const { disconnectWallet } = useDAppKit();
  const [copied, setCopied] = useState(false);
  const walBalance = useWalBalance(currentAccount?.address);

  const handleCopy = () => {
    if (!currentAccount?.address) return;
    navigator.clipboard.writeText(currentAccount.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header
      className={tv({
        base: [
          "sticky top-0 z-50 h-18",
          "backdrop-blur-3xl bg-[#191F2D]/40",
          "border-b border-white/10",
        ],
      })()}
    >
      <Center className="container size-full justify-between">
        <Hstack className="gap-8">
          <Link to="/">
            <Typography
              font="grotesk"
              className="text-[#46F1CF] text-lg font-bold"
            >
              WALARCHIVE
            </Typography>
          </Link>

          <HeaderSearch />
        </Hstack>

        <Hstack className="gap-3 h-8">
          <Link
            to="/create-artifact"
            className="text-black flex items-center gap-2 px-2 md:px-4 h-full rounded-xs"
            style={{
              background:
                "linear-gradient(135deg, #46F1CF 0%, #41EDCC 12.5%, #3BEAC8 25%, #35E6C5 37.5%, #2EE2C1 50%, #27DFBE 62.5%, #1EDBBB 75%, #13D8B7 87.5%, #00D4B4 100%)",
            }}
          >
            <PlusLine />

            <Typography
              font="grotesk"
              className="hidden md:block text-xs font-bold"
            >
              Create Artifact
            </Typography>
          </Link>

          {currentAccount?.address ? (
            <>
              <HeaderNotification />

              <Popover>
                <PopoverTrigger>
                  <Jazzicon
                    address={currentAccount.address}
                    className="size-8 cursor-pointer rounded-full ring-2 ring-transparent hover:ring-[#46F1CF]/40 transition-all duration-200"
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
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-[#46F1CF]/60 to-transparent" />

                  <div className="px-4 pt-4 pb-3 flex flex-col gap-3">
                    {/* Avatar + address row */}
                    <Hstack className="gap-3 items-center">
                      <Jazzicon
                        address={currentAccount.address}
                        className="size-9 shrink-0 rounded-full"
                      />

                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-neutral-500 font-medium tracking-widest uppercase mb-0.5">
                          Address
                        </p>
                        <p className="text-sm font-mono text-white/90 truncate">
                          {shorten(currentAccount.address)}
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
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                          >
                            <path
                              d="M2 7L5.5 10.5L12 4"
                              stroke="#46F1CF"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                          >
                            <rect
                              x="4.5"
                              y="4.5"
                              width="7"
                              height="7"
                              rx="1"
                              stroke="currentColor"
                              strokeWidth="1.2"
                            />
                            <path
                              d="M2.5 9.5V2.5H9.5"
                              stroke="currentColor"
                              strokeWidth="1.2"
                              strokeLinecap="round"
                            />
                          </svg>
                        )}
                      </button>
                    </Hstack>

                    {/* Network badge + WAL balance */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-[#46F1CF] shadow-[0_0_4px_#46F1CF]" />
                        <span className="text-[11px] text-neutral-500 font-medium tracking-wide">
                          Sui Testnet
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {walBalance.isPending ? (
                          <span className="h-2.5 w-10 rounded bg-white/10 animate-pulse" />
                        ) : (
                          <span className="text-[13px] font-mono font-semibold text-white/90">
                            {walBalance.data ?? "—"}
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
          ) : (
            <ConnectWalletWrapper>
              <button
                className={tv({
                  base: [
                    "text-[#00D4B4] text-xs font-bold",
                    "px-4 h-full",
                    "border-2 border-[#00D4B4] rounded-xs",
                  ],
                })()}
              >
                <Typography font="grotesk">Connect wallet</Typography>
              </button>
            </ConnectWalletWrapper>
          )}
        </Hstack>
      </Center>
    </header>
  );
};
