import Hstack from "app/components/Hstack";
import Typography from "app/components/Typography";
import Vstack from "app/components/Vstack";
import {
  Controller,
  type Control,
  type UseFormSetValue,
} from "react-hook-form";
import { tv } from "tailwind-variants";
import type { CreateArtifactFieldProps } from "..";

interface CreateArtifactResourceProps {
  control: Control<CreateArtifactFieldProps>;
  setValue: UseFormSetValue<CreateArtifactFieldProps>;
}

export default ({ control, setValue }: CreateArtifactResourceProps) => {
  const styles = tv({
    base: ["uppercase text-xs", "border rounded-xl", "px-5 py-2"],
    variants: {
      type: {
        red: "text-[#FF4D4D] border-[#FF4D4D]/40",
        cyan: "text-[#00D4FF] border-[#00D4FF]/40",
        gold: "text-[#FFD700] border-[#FFD700]/40",
      },

      active: {
        red: "bg-[#FF4D4D]/20",
        cyan: "bg-[#00D4FF]/20",
        gold: "bg-[#FFD700]/20",
      },
    },
  });

  const ListResource = [
    {
      key: "LAW Crimson",
      type: "red" as const,
    },
    {
      key: "Software Cyan",
      type: "cyan" as const,
    },
    {
      key: "Economy Gold",
      type: "gold" as const,
    },
  ];

  return (
    <Vstack>
      <Typography className="input-heading">RESOURCE TYPE</Typography>

      <Controller
        control={control}
        name="category"
        render={({ field }) => (
          <Hstack className="justify-start">
            {ListResource.map((meta) => {
              const isActive = field.value === meta.key;

              return (
                <button
                  key={meta.key}
                  onClick={() => setValue("category", meta.key)}
                  className={styles({
                    type: meta.type,
                    active: isActive ? meta.type : undefined,
                  })}
                >
                  <Typography font="grotesk">{meta.key}</Typography>
                </button>
              );
            })}
          </Hstack>
        )}
      />
    </Vstack>
  );
};
