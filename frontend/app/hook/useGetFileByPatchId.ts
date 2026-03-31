import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { ArtifactFile } from "app/services/graphql-app/generated";
import utilsWalrus from "app/utils/utils.walrus";

type ResponseType = "text" | "arrayBuffer";

function useGetFileByPatchId(
  file: ArtifactFile,
  response: "text",
): UseQueryResult<string>;
function useGetFileByPatchId(
  file: ArtifactFile,
  response: "arrayBuffer",
): UseQueryResult<ArrayBuffer>;
function useGetFileByPatchId(file: ArtifactFile, response: ResponseType) {
  return useQuery({
    queryKey: ["useGetFileByPatchId", file.patchId, response],
    queryFn: async () => {
      const request = await fetch(utilsWalrus.getQuiltPatchId(file.patchId));

      if (!request.ok) throw `Request failed for ${file.name}`;

      if (response === "arrayBuffer") return await request.arrayBuffer();
      if (response === "text") return await request.text();
    },
  });
}

export default useGetFileByPatchId;
