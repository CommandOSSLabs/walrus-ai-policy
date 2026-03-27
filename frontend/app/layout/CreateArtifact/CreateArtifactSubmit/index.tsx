import Hstack from "app/components/Hstack";
import Spinner from "app/components/Spinner";
import type { CreateArtifactFieldProps } from "..";
import type { UseFormHandleSubmit } from "react-hook-form";
import { useCurrentAccount } from "@mysten/dapp-kit-react";
import { useNavigate } from "react-router";
import useUploadQuilt from "app/hook/useUploadQuilt";
import useArtifact from "app/hook/useArtifact";
import TransactionDetail from "app/components/TransactionDetail";
import { waitForSeconds } from "app/utils";
import useSteps from "app/hook/useSteps";
import ConnectWalletWrapper from "app/components/ConnectWalletWrapper";
import { getQueryClient } from "app/layout/Provider/ProviderReactQuery";
import { useArtifactsQuery } from "app/services/graphql-app/generated";
import utilsConstants from "app/utils/utils.constants";

interface CreateArtifactSubmitProps {
  isSubmitting: boolean;
  handleSubmit: UseFormHandleSubmit<CreateArtifactFieldProps>;
}

export default ({ isSubmitting, handleSubmit }: CreateArtifactSubmitProps) => {
  const currentAccount = useCurrentAccount();
  const navigate = useNavigate();

  const { uploadQuilt } = useUploadQuilt();
  const { initArtifact } = useArtifact();

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
          onClick={handleSubmit(async (values) => {
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
            await waitForSeconds(() => {
              getQueryClient.refetchQueries({
                queryKey: useArtifactsQuery.getKey({
                  limit: utilsConstants.MAX_ARTIFACT_CARD,
                  offset: 0,
                }),
              });
            }, 1000);

            navigate(`/artifact/${artifact.id}`);
          })}
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
