import Typography from "app/components/Typography";
import Vstack from "app/components/Vstack";

export default () => {
  return (
    <Vstack className="gap-5 w-full">
      <Vstack>
        <div className="w-24 h-1 bg-[#00D4B4]" />

        <Typography font="jetbrains" className="text-[#46F1CF] text-sm">
          {`> INITIALIZING_NEW_ARTIFACT`}
        </Typography>
      </Vstack>

      <Typography
        font="grotesk"
        variant="h1"
        className="text-[#DDE2F5] text-5xl font-bold tracking-[-0.225rem]"
      >
        CREATE ARTIFACT
      </Typography>

      <Typography className="text-[#BACAC4] text-lg font-light">
        Permanently seal your research, data, or media into the Walrus
        Protocol&nbsp;
        <Typography variant="span" className="text-[#46F1CF] font-medium">
          Immutable. Citable. On-chain.
        </Typography>
      </Typography>
    </Vstack>
  );
};
