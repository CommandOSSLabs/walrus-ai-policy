import Hstack from "app/components/Hstack";
import Typography from "app/components/Typography";
import Vstack from "app/components/Vstack";
import {
  Controller,
  type Control,
  type UseFormSetValue,
} from "react-hook-form";
import type { CreateArtifactFieldProps } from "..";
import utilsConstants from "app/utils/utils.constants";
import { Badge } from "app/components/ui/badge";

interface CreateArtifactResourceProps {
  control: Control<CreateArtifactFieldProps>;
  setValue: UseFormSetValue<CreateArtifactFieldProps>;
}

export default ({ control, setValue }: CreateArtifactResourceProps) => {
  return (
    <Vstack>
      <Typography className="input-heading">RESOURCE TYPE</Typography>

      <Controller
        control={control}
        name="category"
        render={({ field }) => (
          <Hstack className="justify-start">
            {utilsConstants.FORMAT_RESOURCE.map((meta) => {
              const isActive = field.value === meta.key;

              return (
                <button
                  key={meta.key}
                  onClick={() => setValue("category", meta.key)}
                  className="flex"
                >
                  <Badge
                    active={isActive ? meta.type : undefined}
                    type={meta.type}
                  >
                    <Typography font="grotesk">{meta.key}</Typography>
                  </Badge>
                </button>
              );
            })}
          </Hstack>
        )}
      />
    </Vstack>
  );
};
