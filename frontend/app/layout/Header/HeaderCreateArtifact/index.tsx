import Typography from "app/components/Typography";
import PlusLine from "public/assets/line/plus.svg";
import { Link } from "react-router";

export default () => {
  return (
    <Link
      to="/create-artifact"
      className="text-black flex items-center gap-2 px-2 md:px-4 h-full rounded-xs"
      style={{
        background:
          "linear-gradient(135deg, #46F1CF 0%, #41EDCC 12.5%, #3BEAC8 25%, #35E6C5 37.5%, #2EE2C1 50%, #27DFBE 62.5%, #1EDBBB 75%, #13D8B7 87.5%, #00D4B4 100%)",
      }}
    >
      <PlusLine />

      <Typography
        font="grotesk"
        className="hidden md:block text-xs font-bold whitespace-pre"
      >
        Create Artifact
      </Typography>
    </Link>
  );
};
