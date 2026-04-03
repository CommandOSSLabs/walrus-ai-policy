import SearchLine from "public/assets/line/search.svg";
import Center from "app/components/Center";
import Stack from "app/components/Stack";
import Typography from "app/components/Typography";

interface HeaderSearchNoResultProps {
  heading: string;
  body: string;
}

export default ({ heading, body }: HeaderSearchNoResultProps) => {
  return (
    <Stack className="gap-6 justify-center size-full">
      <Center className="size-12 rounded-full bg-white/5 border border-white/10">
        <SearchLine className="size-6 text-[#84948F]" />
      </Center>

      <Stack className="gap-1 text-center">
        <Typography font="grotesk" className="text-sm font-bold">
          {heading}
        </Typography>

        <Typography className="text-[#84948F] text-xs w-3/4">{body}</Typography>
      </Stack>
    </Stack>
  );
};
