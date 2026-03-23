import Typography from "app/components/Typography";

interface CreateArtifactDocumentHeaderProps {
  heading: string;
  body: string;
}

export default ({ heading, body }: CreateArtifactDocumentHeaderProps) => {
  return (
    <Typography font="jetbrains" className="text-[#64748B]">
      {heading}:&nbsp;
      <span className="font-medium text-[#CBD5E1]">{body}</span>
    </Typography>
  );
};
