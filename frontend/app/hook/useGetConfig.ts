import { useQuery } from "@tanstack/react-query";
import utilsWalrus from "app/utils/utils.walrus";

export default () => {
  const contributorConfig = useQuery({
    queryKey: ["contributor_config"],
    queryFn: async () => {
      const roles: Record<number, string> = {
        0: "Admin",
        1: "Moderator",
      };

      return roles;
    },
  });

  const fileConfig = useQuery({
    queryKey: ["file_config"],
    queryFn: async () => {
      const get_limit_file = 100;

      return get_limit_file;
    },
  });

  const metadataConfig = useQuery({
    queryKey: ["metadata_config"],
    queryFn: async () => {
      return {
        title: 100,
        descrpition: 280,
      };
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
