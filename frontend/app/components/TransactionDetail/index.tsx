import Flex from "../Flex";
import Hstack from "../Hstack";
import Spinner from "../Spinner";
import Typography from "../Typography";
import Vstack from "../Vstack";
import CheckedFill from "public/assets/fill/checked.svg";
import SuiToken from "public/assets/token/sui.svg";
import WalrusToken from "public/assets/token/walrus.svg";
import RemoveFill from "public/assets/fill/remove.svg";

export type TransactionDetailStateType = {
  key: string;
  status?: "loading" | "success" | "error";
  fees?: Array<{ value: string; symbol: "sui" | "wal" }>;
};

interface TransactionDetailProps {
  steps: TransactionDetailStateType[];
}

export default ({ steps }: TransactionDetailProps) => {
  return (
    <Vstack className="bg-[#9597C6]/5 border border-[#9597C6]/25 rounded-xl">
      <div className="p-6 border-b border-white/10">
        <Typography font="jetbrains" className="text-white text-xl font-bold">
          Transaction Details
        </Typography>
      </div>

      <Vstack className="p-4">
        {steps.map((step) => {
          const isLoading = step.status === "loading";
          const isSuccess = step.status === "success";
          const isError = step.status === "error";

          return (
            <Flex key={step.key} className="gap-2 text-white">
              {(function () {
                if (isError) {
                  return <RemoveFill className="size-6 text-red-500" />;
                }

                if (isSuccess) {
                  return <CheckedFill className="size-6" />;
                }

                if (isLoading) {
                  return <Spinner className="size-6" />;
                }

                return (
                  <div className="size-6 rounded-full border-[0.1875rem] border-white/25" />
                );
              })()}

              <Vstack className="gap-1 flex-1">
                <Typography className="font-bold">{step.key}</Typography>

                <Flex className="justify-between text-sm font-medium">
                  <Typography>Estimated Fee</Typography>

                  {step.fees?.length ? (
                    <Vstack>
                      {step.fees.map(({ value, symbol }, index) => (
                        <Hstack key={index} className="gap-1 justify-end">
                          <Typography>{value}</Typography>

                          {symbol === "sui" ? <SuiToken /> : <WalrusToken />}
                        </Hstack>
                      ))}
                    </Vstack>
                  ) : null}
                </Flex>
              </Vstack>
            </Flex>
          );
        })}
      </Vstack>
    </Vstack>
  );
};
