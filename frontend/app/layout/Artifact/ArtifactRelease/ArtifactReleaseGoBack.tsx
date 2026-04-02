import ArrowLine from "public/assets/line/arrow.svg";
import Typography from "app/components/Typography";
import { useSearchParams } from "react-router";

export default () => {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <button
      className="text-black flex items-center px-3 w-fit h-8 rounded-xs"
      style={{
        background:
          "linear-gradient(135deg, #46F1CF 0%, #41EDCC 12.5%, #3BEAC8 25%, #35E6C5 37.5%, #2EE2C1 50%, #27DFBE 62.5%, #1EDBBB 75%, #13D8B7 87.5%, #00D4B4 100%)",
      }}
      onClick={() => {
        searchParams.delete("release");

        setSearchParams(searchParams);
      }}
    >
      <ArrowLine />

      <Typography font="grotesk" className="text-xs font-bold">
        Go back
      </Typography>
    </button>
  );
};
