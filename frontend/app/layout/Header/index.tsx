import { useCurrentAccount } from "@mysten/dapp-kit-react";

import ConnectWalletWrapper from "app/components/ConnectWalletWrapper";
import Hstack from "app/components/Hstack";
import { Link } from "react-router";
import { tv } from "tailwind-variants";

import Typography from "app/components/Typography";
import HeaderSearch from "./HeaderSearch";
import HeaderProfile from "./HeaderProfile";
import HeaderCreateArtifact from "./HeaderCreateArtifact";

export default () => {
  const currentAccount = useCurrentAccount();

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
      <Hstack className="container size-full justify-between">
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
          <HeaderCreateArtifact />

          {currentAccount?.address ? (
            <HeaderProfile address={currentAccount.address} />
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
      </Hstack>
    </header>
  );
};
