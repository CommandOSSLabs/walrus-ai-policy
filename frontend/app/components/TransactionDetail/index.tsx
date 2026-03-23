import Flex from "../Flex";
import Hstack from "../Hstack";
import Typography from "../Typography";
import Vstack from "../Vstack";
import CheckedFill from "public/assets/fill/checked.svg";
import SuiToken from "public/assets/token/sui.svg";
export default () => {
  return (
    <Vstack className="bg-[#9597C6]/5 border border-[#9597C6]/25 rounded-xl">
      <div className="p-6 border-b border-white/10">
        <Typography font="jetbrains" className="text-white text-xl font-bold">
          Transaction Details
        </Typography>
      </div>

      <Vstack className="p-4">
        {[...Array(3)].map((_, index) => (
          <Flex key={index} className="gap-2 text-white">
            <CheckedFill className="size-6" />

            <Vstack className="gap-1 flex-1">
              <Typography className="font-bold">
                Creating Walrus storage
              </Typography>

              <Flex className="justify-between text-sm font-medium">
                <Typography>Estimated Fee</Typography>

                <Vstack>
                  <Hstack className="gap-1">
                    <Typography>12.52</Typography>

                    <SuiToken />
                  </Hstack>

                  <Hstack className="gap-1">
                    <Typography>12.52</Typography>

                    <SuiToken />
                  </Hstack>
                </Vstack>
              </Flex>
            </Vstack>
          </Flex>
        ))}
      </Vstack>
    </Vstack>
  );
};
