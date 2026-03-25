import { BigNumber } from "bignumber.js";
import { SUI_DECIMALS } from "@mysten/sui/utils";
import utilsConstants from "./utils.constants";
import utilsSui from "./utils.sui";

export const waitForSeconds = async (cb?: () => void, seconds?: number) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve("done");

      if (cb) cb();
    }, seconds || 2000);
  });
};

export const shorten = (hash: string, length = 6) => {
  // Handle undefined, null, or empty string cases
  if (!hash || typeof hash !== "string") {
    return "";
  }

  // If string is shorter than desired length, return as is
  if (hash.length <= length * 2) {
    return hash;
  }

  const prefix = hash.slice(0, length);
  const middle = "...";
  const suffixed = hash.slice(-length);

  return prefix + middle + suffixed;
};

export const createInputFile = (params: {
  callback: (files: File[]) => void;
  options?: Partial<HTMLInputElement>;
}) => {
  const element = document.createElement("input");

  element.type = "file";

  if (params.options) {
    for (const [k, v] of Object.entries(params.options)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      element[k] = v;
    }
  }

  element.click();

  // clear memory
  element.oncancel = () => {
    element.remove();
  };

  element.onchange = (event) => {
    const target = event.target as HTMLInputElement;

    if (target.files?.length) {
      params.callback(Object.values(target.files));

      element.remove();
    }
  };
};

export const formatBytesSizes = (bytes: number): string => {
  if (!bytes) return "0 B";

  const k = 1024;

  const i = Math.floor(Math.log(bytes) / Math.log(k)) || 0;

  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(1)) +
    " " +
    utilsConstants.FORMAT_BYTES[i].key
  );
};

export const sumNumber = (numbers: number[]) => {
  const NOT_NaN = 0;

  const instance = numbers.reduce(
    (prev, current) => (prev || NOT_NaN) + (current || NOT_NaN),
    NOT_NaN,
  );

  return instance;
};

export const RANDOM_CHARACTER = () => {
  return (Math.random() + 1).toString(6).substring(7);
};

export const estimatedFee = async (txBytes: Uint8Array) => {
  const { Transaction } = await utilsSui.getSuiClient.simulateTransaction({
    transaction: txBytes,
    include: {
      balanceChanges: true,
    },
  });

  if (!Transaction?.balanceChanges) return [];

  return Transaction.balanceChanges.map((meta) => {
    // ['0x2', 'sui', 'SUI']
    const [, coinType] = meta.coinType.split("::");

    return {
      symbol: coinType as "sui" | "wal",
      value: (function () {
        const value = BigNumber(meta.amount)
          .dividedBy(Math.pow(10, SUI_DECIMALS))
          // need float-point to modify
          .toFixed()
          // don't need visible minus, for some reason confuse
          .replace("-", "");

        // shorten digits, for E.g: 0.0034
        if (meta.amount.length >= 5) {
          let template = "";
          let foundDigit = false;

          for (let i = 0; i < value.length; i++) {
            // 0.00340 => should be 0.0034
            if (foundDigit && value[i] === "0") break;

            // 0.003 => if next element is zero we will break
            if (value[i] !== "0" && value[i] !== ".") {
              foundDigit = true;
            }

            template += value[i];
          }

          return template;
        }

        // default return full, for E.g: 0.000000015
        return value;
      })(),
    };
  });
};
