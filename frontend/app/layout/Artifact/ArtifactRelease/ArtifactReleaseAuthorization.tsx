import Center from "app/components/Center";
import Typography from "app/components/Typography";
import Hstack from "app/components/Hstack";
import LockFill from "public/assets/fill/lock.svg";
import Stack from "app/components/Stack";
import Vstack from "app/components/Vstack";

export default () => {
  return (
    <Center className="h-[calc(100dvh-4.5rem)]">
      <Stack className="gap-8 max-w-lg text-center">
        <Center className="size-18 bg-[#FF4D4D]/10 border border-[#FF4D4D]/20 rounded-lg">
          <LockFill className="text-[#FF4D4D] size-8" />
        </Center>

        <Vstack className="gap-3">
          <Typography font="grotesk" className="text-2xl font-bold">
            Archive Access Restricted
          </Typography>

          <Typography font="grotesk" className="text-[#84948F] text-sm">
            The experimental release artifact module is restricted to protocol
            administrators. Unauthorized attempts to access the archive are
            logged and monitored.
          </Typography>
        </Vstack>

        <div className="bg-[#FF4D4D]/25 w-full h-px" />

        <Hstack>
          <div className="size-1.5 bg-[#FF4D4D] animate-ping rounded-full" />

          <Typography font="jetbrains" className="text-[#FF4D4D] text-2xs">
            Security Protocol
          </Typography>
        </Hstack>
      </Stack>
    </Center>
  );
};
