import PlusLine from "public/assets/line/plus.svg";
import Typography from "app/components/Typography";
import Vstack from "app/components/Vstack";
import Center from "app/components/Center";
import { useSearchParams } from "react-router";

export default () => {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div className="px-5">
      <div className="flex items-center gap-2 mt-1">
        <div className="flex-1 h-px bg-[#46F1CF]/15" />
        <Typography
          font="jetbrains"
          className="text-[#46F1CF]/35 text-2xs uppercase tracking-widest"
        >
          admin
        </Typography>
        <div className="flex-1 h-px bg-[#46F1CF]/15" />
      </div>

      <button
        className="version-release-cta relative w-full group overflow-hidden rounded-lg transition-all duration-300 hover:border-[#46F1CF]/70"
        style={{
          background:
            "linear-gradient(160deg, #0C2922 0%, #081E18 60%, #060F0D 100%)",
          border: "1px solid rgba(70, 241, 207, 0.35)",
        }}
        onClick={() => {
          searchParams.set("release", "true");
          setSearchParams(searchParams);
        }}
      >
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-8 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 100%, rgba(70, 241, 207, 0.22) 0%, transparent 70%)",
          }}
        />

        <Center className="relative gap-3 px-4 py-3 justify-start">
          <Center
            className="w-7 h-7 rounded-full shrink-0"
            style={{
              background: "rgba(70, 241, 207, 0.12)",
              border: "1px solid rgba(70, 241, 207, 0.45)",
            }}
          >
            <PlusLine className="w-3.5 h-3.5 text-[#46F1CF]" />
          </Center>

          <Vstack className="items-start gap-0.5">
            <Typography
              font="grotesk"
              className="text-[#46F1CF] text-xs font-bold leading-tight"
            >
              Release New Version
            </Typography>
            <Typography
              font="jetbrains"
              className="text-[#84948F] text-2xs leading-tight"
            >
              Publish an updated artifact
            </Typography>
          </Vstack>
        </Center>

        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(70, 241, 207, 0.06) 0%, transparent 50%, rgba(70, 241, 207, 0.06) 100%)",
          }}
        />
      </button>
    </div>
  );
};
