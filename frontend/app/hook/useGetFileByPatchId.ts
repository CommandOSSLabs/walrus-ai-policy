import { useQuery } from "@tanstack/react-query";
import type { ArtifactFile } from "app/services/graphql-app/generated";
import utilsWalrus from "app/utils/utils.walrus";

export default (file: ArtifactFile) => {
  return useQuery({
    queryKey: ["markdown", file.patchId],
    queryFn: async () => {
      const request = await fetch(utilsWalrus.getQuiltPatchId(file.patchId));

      if (!request.ok) throw `Request failed for ${file.name}`;

      return await request.text();
    },
  });
};
