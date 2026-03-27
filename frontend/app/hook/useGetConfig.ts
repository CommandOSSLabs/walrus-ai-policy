import { useQuery } from "@tanstack/react-query";

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

  return {
    contributorConfig,
    fileConfig,
    metadataConfig,
  };
};
