import { useCurrentAccount } from "@mysten/dapp-kit-react";
import ConnectWalletWrapper from "app/components/ConnectWalletWrapper";
import Hstack from "app/components/Hstack";
import Spinner from "app/components/Spinner";
import TransactionDetail from "app/components/TransactionDetail";
import useSteps from "app/hook/useSteps";
import useUploadArtifact from "app/hook/useUploadArtifact";
import useUploadQuilt from "app/hook/useUploadQuilt";
import type { CreateArtifactFieldProps } from "app/layout/CreateArtifact";
import type { ArtifactFile } from "app/services/graphql-app/generated";
import type { UseFormHandleSubmit } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface ArtifactReleaseSubmitProps {
  rootId: string;
  parentId: string | undefined;
  isSubmitting: boolean;
  handleSubmit: UseFormHandleSubmit<CreateArtifactFieldProps>;
}

export default ({
  rootId,
  parentId,
  isSubmitting,
  handleSubmit,
}: ArtifactReleaseSubmitProps) => {
  const currentAccount = useCurrentAccount();
  const navigate = useNavigate();

  const { uploadQuilt } = useUploadQuilt();
  const { releaseArtifact } = useUploadArtifact();

  const { steps, status, setSteps, updateFee, updateStatus } = useSteps([
    {
      key: "Creating Walrus storage",
    },
    {
      key: "Certifying the Blob",
    },
    {
      key: "initializing New Artifact",
    },
  ]);

  return (
    <>
      {status?.length ? <TransactionDetail steps={steps} /> : null}

      <ConnectWalletWrapper>
        <button
          className="text-[#00382E] font-bold w-full h-16 rounded-lg disabled:opacity-45"
          disabled={isSubmitting}
          style={{
            background: "linear-gradient(135deg, #46F1CF 0%, #00D4B4 100%)",
          }}
          onClick={handleSubmit(
            async (values) => {
              try {
                if (!currentAccount?.address) return;

                const files: ArtifactFile[] | undefined = [];

                // handle upload new file
                {
                  const newFiles = values.files.filter(
                    (file) => !!file.isCompared,
                  );

                  if (newFiles?.length) {
                    const quilt = await uploadQuilt(
                      newFiles.map((meta) => meta.file),
                      updateFee,
                      updateStatus,
                    );

                    files?.push(
                      ...quilt.files.map((file, index) => ({
                        mimeType: file.type,
                        name: file.name,
                        patchId: quilt.quiltIds[index],
                        sizeBytes: file.size,
                      })),
                    );
                  } else {
                    // don't need create walrus anymore
                    setSteps([steps[steps.length - 1]]);
                  }
                }

                // handle old files
                {
                  const oldFiles = values?.files?.filter(
                    (meta) => meta?.isOld && !meta?.isRemoved,
                  );

                  if (oldFiles?.length) {
                    files?.push(
                      ...oldFiles.map((meta) => ({
                        mimeType: meta.file.type,
                        name: meta.file.name,
                        patchId: meta.id,
                        sizeBytes: meta.file.size,
                      })),
                    );
                  }
                }

                if (!files?.length) throw "hello";

                const artifact = await releaseArtifact(
                  values,
                  files,
                  rootId,
                  parentId,
                  updateFee,
                  updateStatus,
                );

                navigate(`/artifact/${artifact.id}`);

                toast.success("Artifact created successfully.");
              } catch (error) {
                updateStatus("error");

                toast.error(JSON.stringify(error));
              }
            },
            (errors) => {
              if (errors?.title) {
                const el = document.querySelector(`[name="title"]`);

                if (!el) return;

                const [header] = document.getElementsByTagName("header");
                const offset = 32;
                const top = el.getBoundingClientRect().top + window.scrollY;

                window.scrollTo({
                  top: top - header.offsetHeight - offset,
                });
              }
            },
          )}
          // onClick={handleSubmit((values) => {
          //   const oldFiles = values.files.filter((file) => !file.isCompared);
          //   const newFiles = values.files.filter((file) => file.isCompared);

          //   console.log(newFiles);
          //   console.log(oldFiles);

          //   // console.log(values);
          //   // console.log(files);
          // })}
        >
          <Hstack>
            {isSubmitting && <Spinner />}
            RELEASE ARTIFACT
          </Hstack>
        </button>
      </ConnectWalletWrapper>
    </>
  );
};
