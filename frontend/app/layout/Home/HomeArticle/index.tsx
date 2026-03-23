import CalendarLine from "public/assets/line/calendar.svg";
import EyesLine from "public/assets/line/eyes.svg";
import DownloadLine from "public/assets/line/download.svg";
import Center from "app/components/Center";
import Hstack from "app/components/Hstack";
import Typography from "app/components/Typography";
import Vstack from "app/components/Vstack";
import { tv } from "tailwind-variants";
import { Link } from "react-router";
import HomeArticlePagination from "./HomeArticlePagination";

export default () => {
  return (
    <article className="flex-1">
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {[...Array(9)].map((_, index) => (
          <Link key={index} to={`/artifact/${index}`}>
            <Vstack
              className={tv({
                base: [
                  "bg-[#191F2D] gap-5 p-5",
                  "border border-[#46F1CF]/20 rounded-lg",
                  "transition-colors hover:border-[#46F1CF]",
                ],
              })()}
            >
              <Center className="text-2xs justify-between">
                <Typography font="jetbrains" className="text-[#00D4B4]">
                  V{index + 1}
                </Typography>

                <Center className="h-5 px-2 bg-[#63F1B4]/10">
                  <Typography
                    font="grotesk"
                    className="text-[#63F1B4] font-bold"
                  >
                    Economy
                  </Typography>
                </Center>
              </Center>

              <Vstack className="gap-2.5 flex-1">
                <Typography
                  font="grotesk"
                  className="text-[#DDE2F5] text-xl font-bold"
                >
                  Yield Optimization Reports
                </Typography>

                <Typography className="text-[#BACAC4] text-sm line-clamp-4">
                  {`Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.`}
                </Typography>
              </Vstack>

              <Center className="justify-between text-[#84948F] text-2xs">
                <Hstack>
                  <CalendarLine />

                  <Typography font="jetbrains">2024.06.01</Typography>
                </Hstack>

                <Hstack>
                  <Hstack>
                    <EyesLine />

                    <Typography font="jetbrains">12.5K</Typography>
                  </Hstack>

                  <Hstack>
                    <DownloadLine />

                    <Typography font="jetbrains">1.5K</Typography>
                  </Hstack>
                </Hstack>
              </Center>
            </Vstack>
          </Link>
        ))}
      </div>

      <HomeArticlePagination />
    </article>
  );
};
