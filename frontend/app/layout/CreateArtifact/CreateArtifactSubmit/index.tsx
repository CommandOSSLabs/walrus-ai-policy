import Hstack from "app/components/Hstack";
import Spinner from "app/components/Spinner";
import type { CreateArtifactFieldProps } from "..";
import type { UseFormHandleSubmit } from "react-hook-form";
import { useCurrentAccount } from "@mysten/dapp-kit-react";
import { useNavigate } from "react-router";
import useUploadQuilt from "app/hook/useUploadQuilt";
import useArtifact from "app/hook/useArtifact";
import TransactionDetail from "app/components/TransactionDetail";

interface CreateArtifactSubmitProps {
  isSubmitting: boolean;
  handleSubmit: UseFormHandleSubmit<CreateArtifactFieldProps>;
}

export default ({ isSubmitting, handleSubmit }: CreateArtifactSubmitProps) => {
  const currentAccount = useCurrentAccount();
  const navigate = useNavigate();

  const { uploadQuilt } = useUploadQuilt();
  const { createArtifact } = useArtifact();

  return (
    <>
      {isSubmitting && <TransactionDetail />}

      <button
        className="text-[#00382E] font-bold w-full h-16 rounded-lg disabled:opacity-45"
        disabled={isSubmitting}
        style={{
          background: "linear-gradient(135deg, #46F1CF 0%, #00D4B4 100%)",
        }}
        onClick={handleSubmit(async (values) => {
          if (!currentAccount?.address) return;

          console.log(uploadQuilt, createArtifact, navigate, values);

          // const quilts = await uploadQuilt(values);

          // after created blob, you need wait seconds for available blob
          // await waitForSeconds(async () => {
          //   const artifact = await createArtifact(
          //     quilts.map(({ quilt }) => quilt),
          //     quilts.map(({ name }) => name),
          //   );

          //   navigate(`/artifact/${artifact.id}`);
          // });
        })}
      >
        <Hstack>
          {isSubmitting && <Spinner />}
          CREATE ARTIFACT
        </Hstack>
      </button>
    </>
  );
};
