import { useCurrentAccount, useDAppKit } from "@mysten/dapp-kit-react";

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

  return (
    <header className="bg-[#0D1320]/80 border-b border-[#00D4B4]/15 h-18 px-4">
      <Center className="h-full justify-between">
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
          {currentAccount?.address ? (
            <>
              <Link
                to="/create-artifact"
                className="text-black flex items-center gap-2 px-4 h-full rounded-xs"
                style={{
                  background:
                    "linear-gradient(135deg, #46F1CF 0%, #41EDCC 12.5%, #3BEAC8 25%, #35E6C5 37.5%, #2EE2C1 50%, #27DFBE 62.5%, #1EDBBB 75%, #13D8B7 87.5%, #00D4B4 100%)",
                }}
              >
                <PlusLine />

                <Typography font="grotesk" className="text-xs font-bold">
                  Create Artifact
                </Typography>
              </Link>

              <HeaderNotification />

              <Popover>
                <PopoverTrigger>
                  <Jazzicon
                    address={currentAccount.address}
                    className="size-8 cursor-pointer"
                  />
                </PopoverTrigger>

                <PopoverContent
                  sideOffset={12}
                  align="end"
                  className={tv({
                    base: [
                      "w-56 pt-4 gap-4 items-start",
                      "bg-neutral-800 border border-neutral-700",
                    ],
                  })()}
                >
                  <Hstack>
                    <Jazzicon
                      address={currentAccount.address}
                      className="size-8"
                    />

                    <p className="text-sm font-medium">
                      {shorten(currentAccount.address)}
                    </p>
                  </Hstack>

                  <div className="w-full h-px bg-neutral-600/65" />

                  <button
                    className="bg-red-500 w-full h-9 rounded-sm font-medium"
                    onClick={disconnectWallet}
                  >
                    Disconnect
                  </button>
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
