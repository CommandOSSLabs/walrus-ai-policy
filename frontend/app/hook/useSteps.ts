import { useCurrentAccount } from "@mysten/dapp-kit-react";
import { Transaction } from "@mysten/sui/transactions";
import type { TransactionDetailStateType } from "app/components/TransactionDetail";
import { estimatedFee } from "app/utils";
import utilsSui from "app/utils/utils.sui";
import { useRef, useState } from "react";

export default (params: TransactionDetailStateType[]) => {
  const currentAccount = useCurrentAccount();

  const [steps, setSteps] = useState(params);

  const currentStep = useRef(0);

  const updateFee = async (tx: Transaction) => {
    if (!currentAccount?.address) {
      throw "not found condition";
    }

    const fees = await estimatedFee(
      await (async function () {
        tx.setSenderIfNotSet(currentAccount?.address);

        // https://sdk.mystenlabs.com/sui/migrations/sui-2.0/wallet-builders#migrating-signandexecutetransaction
        const parsedTransaction = Transaction.from(
          await tx.toJSON({
            client: utilsSui.getSuiClient.core,
          }),
        );

        const bytes = await parsedTransaction.build({
          client: utilsSui.getSuiClient.core,
        });

        return bytes;
      })(),
    );

    setSteps((steps) => {
      const instance = [...steps];

      instance[currentStep.current].fees = fees.map((fee) => ({
        value: fee.value,
        symbol: fee.symbol,
      }));

      return instance;
    });
  };

  const updateStatus = (status: TransactionDetailStateType["status"]) => {
    let isIncremental = true;

    setSteps((steps) => {
      const instance = [...steps];

      instance[currentStep.current].status = status;

      if (
        status === "success" &&
        currentStep.current < steps.length - 1 &&
        isIncremental
      ) {
        currentStep.current++;
        isIncremental = false;
      }

      return instance;
    });

    // reset
    isIncremental = true;
  };

  return {
    // states
    steps,
    status: (function () {
      if (steps.every((step) => step.status === "success")) {
        return "success" as const;
      }

      if (steps.some((step) => step.status === "error")) {
        return "error" as const;
      }

      if (steps.some((step) => step.status)) {
        return "loading" as const;
      }
    })(),

    // callbacks
    setSteps,
    updateFee,
    updateStatus,
  };
};
