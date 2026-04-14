import WalletLine from "public/assets/line/wallet.svg";
import WalrusToken from "public/assets/token/walrus.svg";
import CloseLine from "public/assets/line/close.svg";
import Center from "app/components/Center";
import Typography from "app/components/Typography";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "app/components/ui/dialog";
import HeartLine from "public/assets/line/heart.svg";
import WarnLine from "public/assets/line/warn.svg";
import Hstack from "app/components/Hstack";
import Flex from "app/components/Flex";
import { tv } from "tailwind-variants";
import { Controller, useForm } from "react-hook-form";
import Spinner from "app/components/Spinner";
import { toast } from "sonner";
import { isValidSuiAddress } from "@mysten/sui/utils";
import useSignAndExecuteTransaction from "app/hook/useSignAndExecuteTransaction";
import { useEffect, useState } from "react";
import useWalBalance from "app/hook/useWalBalance";
import { useCurrentAccount } from "@mysten/dapp-kit-react";
import { waitForSeconds } from "app/utils";
import ConnectWalletWrapper from "app/components/ConnectWalletWrapper";
import utilsWalrus from "app/utils/utils.walrus";

interface ArtifactStatisticSponsorFieldProps {
  address: string;
  amount: number;
}

interface ArtifactStatisticSponsorProps {
  creator: string;
}

export default ({ creator }: ArtifactStatisticSponsorProps) => {
  const currentAccount = useCurrentAccount();
  const walBalance = useWalBalance(currentAccount?.address);

  const [open, setOpen] = useState(false);

  const { signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const {
    handleSubmit,
    control,
    register,
    resetField,
    formState: { isSubmitting },
  } = useForm<ArtifactStatisticSponsorFieldProps>({
    defaultValues: {
      address: creator,
    },
  });

  useEffect(() => {
    if (!open) {
      resetField("amount");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="text-[#BACAC4] flex items-center justify-center gap-2 border border-[#3B4A45] h-10 rounded-lg">
        <HeartLine />

        <Typography font="grotesk">SPONSOR</Typography>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        className="sm:w-lg py-0"
      >
        <div className="bg-[#1A2130] border border-[#3b4a45] rounded-xl">
          <Center className="justify-between border-b text-[#84948f] border-[#3b4a45] px-6 py-3">
            <div>
              <Typography
                font="grotesk"
                className="text-white text-sm font-bold"
              >
                Sponsor with WAL
              </Typography>

              <Typography font="jetbrains" className="text-xs">
                Send tokens to the artifact creator
              </Typography>
            </div>

            <DialogClose className="size-8 bg-[#1A2130] border border-[#3B4A45] rounded-xs">
              <CloseLine className="size-3.5 mx-auto" />
            </DialogClose>
          </Center>

          <div className="text-[#84948f] text-xs space-y-5 px-6 py-4 w-full">
            {/* Address */}
            <div className="space-y-2.5 w-full">
              <Flex className="gap-1.5">
                <WalletLine />

                <Typography
                  font="jetbrains"
                  className="uppercase tracking-[1.1px]"
                >
                  Recipient address
                </Typography>
              </Flex>

              <input
                type="text"
                placeholder="Enter the address"
                disabled={true}
                className={tv({
                  base: [
                    "w-full h-12 px-3 py-3",
                    "font-jetbrains placeholder:text-inherit",
                    "outline-none",
                    "bg-[#080e1b] rounded-xl",
                  ],
                })()}
                {...register("address", { required: true })}
              />
            </div>

            {/* Amount */}
            <div className="space-y-2.5 w-full">
              <Flex className="gap-1.5">
                <WalrusToken />

                <Typography
                  font="jetbrains"
                  className="uppercase tracking-[1.1px]"
                >
                  Amount
                </Typography>
              </Flex>

              <Controller
                control={control}
                name="amount"
                rules={{
                  required: true,
                }}
                render={({ field }) => {
                  return (
                    <div className="space-y-2.5 w-full">
                      <Hstack className="gap-2 w-full">
                        {[1, 2, 5, 10].map((amount) => {
                          const isActive = field.value === amount;

                          return (
                            <button
                              key={amount}
                              type="button"
                              onClick={() => field.onChange(amount)}
                              className={tv({
                                base: [
                                  isActive
                                    ? "border-[#46f1cf]"
                                    : "border-[#352F2F]",

                                  "flex-1 h-9 border rounded-lg",
                                  "bg-[#0D111D] hover:border-[#46f1cf]",
                                  "transition-colors",
                                ],
                              })()}
                            >
                              <Typography
                                font="jetbrains"
                                className="font-medium"
                              >
                                {amount}
                              </Typography>
                            </button>
                          );
                        })}
                      </Hstack>

                      <div className="relative">
                        <input
                          type="number"
                          placeholder="Enter the amount"
                          value={field.value ?? ""}
                          onChange={(event) => {
                            const nextValue = event.target.value;

                            field.onChange(
                              nextValue === "" ? undefined : Number(nextValue),
                            );
                          }}
                          className={tv({
                            base: [
                              "w-full h-12 pl-3 pr-16 py-3",
                              "font-jetbrains placeholder:text-inherit",
                              "outline-none",
                              "bg-[#080e1b] rounded-xl",
                            ],
                          })()}
                        />

                        <Flex className="gap-1.5 absolute top-1/2 right-3 -translate-y-1/2">
                          <WalrusToken />

                          <Typography
                            font="jetbrains"
                            className="text-[#46f1cf]"
                          >
                            WAL
                          </Typography>
                        </Flex>
                      </div>
                    </div>
                  );
                }}
              />
            </div>

            {/* Warning */}
            <Flex className="gap-2 p-4 bg-[#0D111D] border border-[#352f2f] rounded-xl">
              <WarnLine className="size-3.5 text-[#FFD700]/60" />

              <Typography className="opacity-70 flex-1">
                Sponsoring sends WAL tokens directly to the artifact
                creator&apos;s wallet. Transactions on the Walrus network are
                irreversible.
              </Typography>
            </Flex>
          </div>

          <Center className="justify-end h-15 px-6 bg-[#141A28] border-t border-[#3B4A45]">
            <ConnectWalletWrapper>
              <button
                disabled={isSubmitting}
                className="px-5 h-9 rounded-lg"
                style={{
                  background:
                    "linear-gradient(152deg, #46F1CF 8.13%, #00D4B4 91.87%)",
                }}
                onClick={handleSubmit(async (values) => {
                  try {
                    if (!isValidSuiAddress(values.address)) {
                      throw "Invalid address.";
                    }

                    const tx = await utilsWalrus.TransferCoin(
                      currentAccount?.address as string,
                      values.amount,
                      values.address,
                    );

                    await signAndExecuteTransaction({
                      transaction: tx,
                    });

                    await waitForSeconds(() => {
                      setOpen(false);

                      walBalance.refetch();

                      toast.success("WAL sponsored successfully.");
                    });
                  } catch (error: any) {
                    toast.error(JSON.stringify(error?.toString()));
                  }
                })}
              >
                <Hstack>
                  {isSubmitting && <Spinner />}

                  <Typography
                    font="grotesk"
                    className="text-[#00382E] font-bold"
                  >
                    Confirm
                  </Typography>
                </Hstack>
              </button>
            </ConnectWalletWrapper>
          </Center>
        </div>
      </DialogContent>
    </Dialog>
  );
};
