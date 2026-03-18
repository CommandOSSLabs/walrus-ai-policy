import type { Transaction } from "@mysten/sui/transactions";
import type { SuiClientTypes } from "@mysten/sui/client";
import utilsDappKit from "app/utils/utils.dapp-kit";
import utilsSui from "app/utils/utils.sui";

interface ParametersExecuteProps {
  transaction: Transaction;

  onSuccess?: (params: {
    digest?: string;
    event?: SuiClientTypes.Event;
  }) => void;

  onError?: (
    data: Awaited<
      ReturnType<typeof utilsDappKit.dAppKit.signAndExecuteTransaction>
    >["Transaction"],
  ) => void;
}

export default () => {
  const signAndExecuteTransaction = async ({
    transaction,
    onError,
    onSuccess,
  }: ParametersExecuteProps) => {
    const resultWithEffects =
      await utilsDappKit.dAppKit.signAndExecuteTransaction({
        transaction,
      });

    const resultWithKind =
      resultWithEffects.$kind === "Transaction"
        ? resultWithEffects.Transaction
        : resultWithEffects.FailedTransaction;

    if (onError) onError(resultWithKind);

    if (onSuccess) {
      const waitTX = await utilsSui.getSuiClient.waitForTransaction({
        result: resultWithEffects,
        include: {
          events: true,
        },
      });

      onSuccess({
        digest: waitTX.Transaction?.digest,
        event: waitTX.Transaction?.events?.[0],
      });
    }

    return resultWithKind;
  };

  return {
    signAndExecuteTransaction,
  };
};
