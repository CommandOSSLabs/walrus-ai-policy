import Hstack from "app/components/Hstack";
import Typography from "app/components/Typography";
import { Link } from "react-router";

interface ArtifactFilePreviewDirectoryProps {
  suiObjectId: string;
  name: string;
}

export default ({ suiObjectId, name }: ArtifactFilePreviewDirectoryProps) => {
  return (
    <Hstack className="gap-1.5 text-sm">
      <Link to={`/artifact/${suiObjectId}`}>
        <Typography className="text-blue-400">Root</Typography>
      </Link>

      <Typography className="text-white/65">/</Typography>

      <Typography className="text-white/65">{name}</Typography>
    </Hstack>
  );
};
