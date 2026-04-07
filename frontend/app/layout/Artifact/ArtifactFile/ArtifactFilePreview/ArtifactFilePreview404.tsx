import Stack from "app/components/Stack";
import Typography from "app/components/Typography";
import { Link } from "react-router";
import WarnLine from "public/assets/line/warn.svg";

interface ArtifactFilePreview404Props {
  select: string;
  suiObjectId: string;
}

export default ({ select, suiObjectId }: ArtifactFilePreview404Props) => {
  return (
    <Stack className="gap-4 text-[#BACAC4] border border-[#352F2F] py-16">
      <WarnLine className="size-8" />

      <Stack className="gap-0.5">
        <Typography>404 - page not found</Typography>

        <Typography>
          the list file does not contain the path&nbsp;
          <Typography variant="span" className="text-white font-medium">
            {select}
          </Typography>
        </Typography>
      </Stack>

      <Link
        to={`/artifact/${suiObjectId}`}
        className="bg-green-500/65 text-white py-2 px-4 rounded-sm"
      >
        Return to the artifact
      </Link>
    </Stack>
  );
};
