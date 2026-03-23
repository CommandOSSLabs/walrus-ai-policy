import Hstack from "app/components/Hstack";
import Typography from "app/components/Typography";
import Vstack from "app/components/Vstack";

export default () => {
  return (
    <Vstack className="gap-3 p-4">
      <Typography font="jetbrains">Network Capacity</Typography>

      <div>
        <Hstack>
          <div className="w-full h-1.5 relative bg-[#84948F]/25 rounded-full">
            <div
              className="absolute w-11/12 h-full"
              style={{
                background:
                  "linear-gradient(90deg, #46F1CF 0%, #41EDCC 12.5%, #3BEAC8 25%, #35E6C5 37.5%, #2EE2C1 50%, #27DFBE 62.5%, #1EDBBB 75%, #13D8B7 87.5%, #00D4B4 100%)",
              }}
            />
          </div>

          <Typography font="jetbrains" className="text-[#00D4B4] font-bold">
            91%
          </Typography>
        </Hstack>

        <Typography font="jetbrains" className="text-[#BACAC4] text-2xs">
          6.4 PB Active • 19.0 TB/s
        </Typography>
      </div>
    </Vstack>
  );
};
