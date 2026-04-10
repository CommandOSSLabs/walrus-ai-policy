import Hstack from "app/components/Hstack";
import Spinner from "app/components/Spinner";
import type { CreateArtifactFieldProps } from "..";
import type { UseFormHandleSubmit } from "react-hook-form";
import { useCurrentAccount } from "@mysten/dapp-kit-react";
import { useNavigate } from "react-router";
import useUploadQuilt from "app/hook/useUploadQuilt";
import TransactionDetail from "app/components/TransactionDetail";
import useSteps from "app/hook/useSteps";
import ConnectWalletWrapper from "app/components/ConnectWalletWrapper";
import { getQueryClient } from "app/layout/Provider/ProviderReactQuery";
import { useArtifactsQuery } from "app/services/graphql-app/generated";
import useUploadArtifact from "app/hook/useUploadArtifact";
import { toast } from "sonner";

interface CreateArtifactSubmitProps {
  isSubmitting: boolean;
  handleSubmit: UseFormHandleSubmit<CreateArtifactFieldProps>;
}

export default ({ isSubmitting, handleSubmit }: CreateArtifactSubmitProps) => {
  const currentAccount = useCurrentAccount();
  const navigate = useNavigate();

  const { uploadQuilt } = useUploadQuilt();
  const { initArtifact } = useUploadArtifact();

  const { steps, status, updateFee, updateStatus } = useSteps([
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

                const quilt = await uploadQuilt(
                  values.files.map(({ file }) => file),
                  updateFee,
                  updateStatus,
                );

                const artifact = await initArtifact(
                  values,
                  quilt,
                  updateFee,
                  updateStatus,
                );

                // refetch home page
                getQueryClient.refetchQueries({
                  queryKey: useArtifactsQuery.getKey({} as never),
                });

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
        >
          <Hstack>
            {isSubmitting && <Spinner />}
            CREATE ARTIFACT
          </Hstack>
        </button>
      </ConnectWalletWrapper>
    </>
  );
};
