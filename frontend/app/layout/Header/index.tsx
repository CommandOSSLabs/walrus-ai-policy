import { useCurrentAccount, useDAppKit } from "@mysten/dapp-kit-react";

import Center from "app/components/Center";
import ConnectWalletWrapper from "app/components/ConnectWalletWrapper";
import Hstack from "app/components/Hstack";
import { Link } from "react-router";
import { tv } from "tailwind-variants";

import PlusLine from "public/assets/line/plus.svg";
import NotificationLine from "public/assets/line/notification.svg";
import Jazzicon from "app/components/Jazzicon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "app/components/ui/popover";
import { shorten } from "app/utils";

export default () => {
  const currentAccount = useCurrentAccount();

  const { disconnectWallet } = useDAppKit();

  return (
    <header className="bg-[#14191F] border-b border-[#2A3340] h-18 px-4">
      <Center className="h-full justify-between">
        <Link to="/" className="text-[#E4EAF2] text-xl font-semibold">
          Walrus-Walarchive
        </Link>

        {currentAccount?.address ? (
          <Hstack className="gap-4">
            <Link
              to="/create-artifact"
              className="bg-[#3B82F6] px-3 h-9 rounded-md"
            >
              <Hstack className="size-full">
                <PlusLine className="size-5" />

                <p>Create Artifact</p>
              </Hstack>
            </Link>

            <button className="size-9 hover:bg-red-500 rounded-md">
              <NotificationLine className="size-5 m-auto" />
            </button>

            <Popover>
              <PopoverTrigger>
                <Jazzicon
                  address={currentAccount.address}
                  className="size-10"
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

                <div className="w-full h-[0.0625rem] bg-neutral-600/65" />

                <button
                  className="bg-red-500 w-full h-9 rounded-sm font-medium"
                  onClick={disconnectWallet}
                >
                  Disconnect
                </button>
              </PopoverContent>
            </Popover>
          </Hstack>
        ) : (
          <ConnectWalletWrapper>
            <button
              className={tv({
                base: [
                  "bg-white/[0.153] border border-[#00D4B4]",
                  "h-9 px-5 rounded-md",
                  "text-[#00D4B4] text-sm font-medium",
                ],
              })()}
            >
              Connect wallet
            </button>
          </ConnectWalletWrapper>
        )}
      </Center>
    </header>
  );
};
