import graphqlApp from "app/services/graphql-app";
import {
  useIncrementDownloadMutation,
  type ArtifactFile,
} from "app/services/graphql-app/generated";
import { downloadFileWithBlob } from "app/utils";
import utilsWalrus from "app/utils/utils.walrus";
import JSZip from "jszip";
import { useState } from "react";
import { toast } from "sonner";

export default () => {
  const [downloading, setDownloading] = useState<string>();

  const incrementDownload = useIncrementDownloadMutation(graphqlApp.client);

  const downloadZip = async (params: {
    files: ArtifactFile[];
    name: string;
    rootId: string;
    onRefetch?: () => void;
  }) => {
    try {
      setDownloading("download");

      const zip = new JSZip();

      await Promise.all(
        params.files.map(async (meta) => {
          const request = await fetch(
            utilsWalrus.getQuiltPatchId(meta.patchId),
          );

          if (!request.ok) {
            throw new Error(`Download failed for ${meta.name}`);
          }

          const blob = await request.blob();

          zip.file(meta.name, blob);
        }),
      );

      const zipBlob = await zip.generateAsync({
        type: "blob",
      });

      downloadFileWithBlob(zipBlob, "application/zip", params.name);

      incrementDownload.mutate(
        {
          rootId: params.rootId,
        },
        {
          onSuccess: params?.onRefetch,
        },
      );
    } catch (error) {
      toast.error(JSON.stringify(error, null, 4));
    } finally {
      setDownloading(undefined);
    }
  };

  const downloadFile = async (params: {
    file: ArtifactFile;
    rootId: string;
    onRefetch?: () => void;
  }) => {
    try {
      setDownloading(params.file.patchId);

      const request = await fetch(
        utilsWalrus.getQuiltPatchId(params.file.patchId),
      );

      if (!request.ok) {
        throw new Error(`Download failed for ${params.file.name}`);
      }

      downloadFileWithBlob(
        await request.blob(),
        params.file.mimeType,
        params.file.name,
      );

      incrementDownload.mutate(
        {
          rootId: params.rootId,
        },
        {
          onSuccess: params?.onRefetch,
        },
      );
    } catch (error) {
      console.log(error);

      toast.error(JSON.stringify(error, null, 4));
    } finally {
      setDownloading(undefined);
    }
  };

  return {
    downloadZip,
    downloadFile,

    downloading,
  };
};
