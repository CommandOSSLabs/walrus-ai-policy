import CheckedLine from "public/assets/line/checked.svg";
import CopyLine from "public/assets/line/copy.svg";
import CloseLine from "public/assets/line/close.svg";
import Center from "app/components/Center";
import Typography from "app/components/Typography";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "app/components/ui/dialog";

import LinkLine from "public/assets/line/link.svg";
import Vstack from "app/components/Vstack";
import ShareLine from "public/assets/line/share.svg";
import Flex from "app/components/Flex";
import Hstack from "app/components/Hstack";
import { Badge } from "app/components/ui/badge";
import XFill from "public/assets/fill/x.svg";
import TelegramFill from "public/assets/fill/telegram.svg";
import LinkedinFill from "public/assets/fill/linkedin.svg";
import FacebookFill from "public/assets/fill/facebook.svg";
import { useState } from "react";
import { tv } from "tailwind-variants";
import useClipboard from "app/hook/useClipboard";
import { openSocialShare } from "app/utils";
import type { ArtifactQuery } from "app/services/graphql-app/generated";

interface ArtifactStatisticShareProps {
  artifact: NonNullable<ArtifactQuery["artifact"]>;
}

export default ({ artifact }: ArtifactStatisticShareProps) => {
  const shareURL =
    typeof window === "undefined"
      ? "undefined"
      : `${location.origin}/artifact/${artifact.suiObjectId}`;

  const ListPlatform = [
    {
      key: "x",
      heading: "X (Twitter)",
      description: "Post with preview card",
      icon: <XFill />,
    },
    {
      key: "telegram",
      heading: "Telegram",
      description: "Send to chat or channel",
      icon: <TelegramFill />,
    },
    {
      key: "linkedin",
      heading: "LinkedIn",
      description: "Share on your feed",
      icon: <LinkedinFill />,
    },
    {
      key: "facebook",
      heading: "Facebook",
      description: "Share to your timeline",
      icon: <FacebookFill />,
    },
  ];

  const { handleCopy, isCopy } = useClipboard();

  const [select, setSelect] = useState<string>(ListPlatform[0].key);

  return (
    <Dialog>
      <DialogTrigger className="text-[#BACAC4] flex items-center justify-center gap-2 border border-[#3B4A45] h-10 rounded-lg">
        <ShareLine />

        <Typography font="grotesk">SHARE</Typography>
      </DialogTrigger>

      <DialogContent showCloseButton={false} className="sm:w-130">
        <div className="bg-[#1A2130] border border-[#3B4A45] rounded-xl overflow-hidden">
          <Center className="px-6 py-3 justify-between bg-[#141A28] border-b border-[#3B4A45]">
            <div>
              <Typography font="grotesk" className="text-sm font-bold">
                Share Artifact
              </Typography>

              <Typography font="jetbrains" className="text-[#84948F] text-xs">
                Choose a platform to share on
              </Typography>
            </div>

            <DialogClose className="size-8 bg-[#1A2130] border border-[#3B4A45] rounded-sm">
              <CloseLine className="size-3.5 mx-auto" />
            </DialogClose>
          </Center>

          <Vstack className="px-6 py-4 gap-5">
            <Flex className="bg-[#0D111D] border border-[#352F2F] rounded-lg px-4 py-3 gap-6">
              <Vstack className="gap-0.5">
                <Flex className="gap-2">
                  <Typography
                    font="grotesk"
                    className="text-xs font-bold line-clamp-1"
                  >
                    {artifact.title}
                  </Typography>

                  <Badge
                    type="green"
                    className="text-[0.5rem] h-3.5 px-1.5 whitespace-pre"
                  >
                    {artifact.category}
                  </Badge>
                </Flex>

                <Typography
                  font="jetbrains"
                  className="text-2xs text-[#84948F] line-clamp-1"
                >
                  {artifact.description}
                </Typography>
              </Vstack>

              <Center className="bg-[#46F1CF]/10 border border-[#46F1CF]/20 rounded-sm px-3 h-full">
                <Typography
                  font="jetbrains"
                  className="text-[#46F1CF] text-2xs"
                >
                  v{artifact.version}
                </Typography>
              </Center>
            </Flex>

            <Vstack className="gap-3">
              <Typography
                font="jetbrains"
                className="text-[#84948F]/60 text-xs uppercase"
              >
                Select platform
              </Typography>

              <div className="grid grid-cols-2 gap-3">
                {ListPlatform.map((meta) => (
                  <button
                    key={meta.key}
                    onClick={() => setSelect(meta.key)}
                    className={tv({
                      base: [
                        meta.key === select
                          ? "bg-white/4 border-white/25"
                          : "bg-[#0D111D]/60 border-[#0088CC]/20",

                        "p-3.5 border rounded-lg",
                        "hover:bg-white/4 transition-colors",
                      ],
                    })()}
                  >
                    {meta.icon}

                    <Vstack className="gap-0.5 text-xs text-left mt-3">
                      <Typography font="grotesk" className="font-bold">
                        {meta.heading}
                      </Typography>

                      <Typography font="jetbrains" className="text-[#84948F]">
                        {meta.description}
                      </Typography>
                    </Vstack>
                  </button>
                ))}
              </div>
            </Vstack>

            <Vstack>
              <Typography
                font="jetbrains"
                className="text-xs text-[#84948F]/60 uppercase"
              >
                Or copy link
              </Typography>

              <Hstack className="min-w-0 text-[#84948F]">
                <Hstack className="min-w-0 flex-1 bg-[#0D111D] rounded-lg px-3 h-9">
                  <LinkLine />

                  <Typography
                    font="jetbrains"
                    className="min-w-0 flex-1 truncate text-2xs"
                  >
                    {shareURL}
                  </Typography>
                </Hstack>

                <button
                  onClick={() => handleCopy(shareURL)}
                  className={tv({
                    base: [
                      isCopy
                        ? "bg-[#46F1CF]/10 border-[#46F1CF]/40 text-[#46F1CF]"
                        : "bg-[#0D111D]/60 border-[#352F2F]",

                      "flex items-center gap-2",
                      "border rounded-lg h-9 px-3",
                    ],
                  })()}
                >
                  {isCopy ? (
                    <CheckedLine className="size-3.5" />
                  ) : (
                    <CopyLine className="size-3.5" />
                  )}

                  <Typography font="jetbrains" className="text-2xs">
                    {isCopy ? "COPIED!" : "COPY"}
                  </Typography>
                </button>
              </Hstack>
            </Vstack>
          </Vstack>

          <Center className="px-6 py-3 justify-end bg-[#141A28] border-t border-[#3B4A45]">
            <button
              className="text-xs font-bold px-5 h-9 border border-white/25 rounded-full"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.13) 0%, rgba(255, 255, 255, 0.07) 100%)",
              }}
              onClick={() => {
                const getPlatform = ListPlatform.find(
                  (meta) => meta.key === select,
                );

                if (!getPlatform) return;

                openSocialShare(getPlatform.key, shareURL);
              }}
            >
              Share now
            </button>
          </Center>
        </div>
      </DialogContent>
    </Dialog>
  );
};
