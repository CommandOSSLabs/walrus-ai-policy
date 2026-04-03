import { bcs } from "@mysten/sui/bcs";
import { useQuery } from "@tanstack/react-query";
import { forceToNumber } from "app/utils";
import utilsSui from "app/utils/utils.sui";
import utilsWalrus from "app/utils/utils.walrus";

export enum contributorConfigEnum {
  moderator = 0,
  admin = 1,
}

export default () => {
  const contributorConfig = useQuery({
    queryKey: ["contributor_config"],
    queryFn: async () => {
      const roles: Record<number, string> = {};

      for (const [role, key] of Object.entries(contributorConfigEnum)) {
        if (typeof key === "number") {
          const value = await utilsSui.commandResults(
            `contributor::get_role_${role}`,
            bcs.u8(),
          );

          roles[value] = role;
        }
      }

      return roles;
    },
  });

  const fileConfig = useQuery({
    queryKey: ["file_config"],
    queryFn: async () => {
      return forceToNumber(
        await utilsSui.commandResults("file::get_file_limit", bcs.u64()),
      );
    },
  });

  const metadataConfig = useQuery({
    queryKey: ["metadata_config"],
    queryFn: async () => {
      const table = {
        title: 0,
        description: 0,
        category: 0,
      };

      for (const key of Object.keys(table)) {
        const value = await utilsSui.commandResults(
          `metadata::get_${key}_limit`,
          bcs.u64(),
        );

        table[key as keyof typeof table] = forceToNumber(value);
      }

      return table;
    },
  });

  const walrusConfig = useQuery({
    queryKey: ["walrus_config"],
    queryFn: async () => {
      const system = await utilsWalrus.walrusClient.systemState();

      return system.used_capacity_size;
    },
  });

  return {
    contributorConfig,
    fileConfig,
    metadataConfig,
    walrusConfig,
  };
};
