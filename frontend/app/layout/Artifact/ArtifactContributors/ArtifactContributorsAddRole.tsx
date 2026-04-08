import CloseLine from "public/assets/line/close.svg";
import { Transaction } from "@mysten/sui/transactions";
import { isValidSuiAddress } from "@mysten/sui/utils";
import Hstack from "app/components/Hstack";
import Spinner from "app/components/Spinner";
import WalletLine from "public/assets/line/wallet.svg";
import RoleLine from "public/assets/line/role.svg";
import Typography from "app/components/Typography";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "app/components/ui/dialog";
import Vstack from "app/components/Vstack";
import useSignAndExecuteTransaction from "app/hook/useSignAndExecuteTransaction";
import { waitForSeconds } from "app/utils";
import utilsSui from "app/utils/utils.sui";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Center from "app/components/Center";
import { tv } from "tailwind-variants";
import { Controller, useForm } from "react-hook-form";
import { contributorConfigEnum } from "app/hook/useGetConfig";
import { managementRole } from "app/services/sui-codegen/walrus_archive/artifact";

interface ArtifactContributorsAddRoleFieldProps {
  address: string;
  role: number;
}

interface ArtifactContributorsAddRoleProps {
  rootId: string;
  roles: Record<number, string>;
  onRefetch: () => void;
}

export default ({
  rootId,
  roles,
  onRefetch,
}: ArtifactContributorsAddRoleProps) => {
  const [open, setOpen] = useState(false);

  const { signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const {
    handleSubmit,
    setValue,
    register,
    control,
    reset,
    formState: { isSubmitting, isValid },
  } = useForm<ArtifactContributorsAddRoleFieldProps>({
    defaultValues: {
      role: contributorConfigEnum.moderator,
    },
  });

  useEffect(() => {
    if (!open) {
      reset(
        {
          address: "",
        },
        {
          keepDefaultValues: true,
        },
      );
    }
  }, [open]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          className="rounded-lg w-14 h-6"
          style={{
            background: "linear-gradient(135deg, #46F1CF 0%, #00D4B4 100%)",
          }}
        >
          <Typography font="grotesk" className="text-[#00382E]">
            ADD
          </Typography>
        </DialogTrigger>

        <DialogContent
          showCloseButton={false}
          className="flex justify-center"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <div className="bg-[#1A2130] border border-[#3B4A45] rounded-xl overflow-hidden w-120">
            <Center className="px-6 py-3 justify-between bg-[#141A28] border-b border-[#3B4A45]">
              <div>
                <Typography font="grotesk" className="text-sm font-bold">
                  Add Contributor
                </Typography>

                <Typography font="jetbrains" className="text-[#84948F] text-xs">
                  Attach a collaborator to this artifact
                </Typography>
              </div>

              <DialogClose className="size-8 bg-[#1A2130] border border-[#3B4A45] rounded-sm">
                <CloseLine className="size-3.5 mx-auto" />
              </DialogClose>
            </Center>

            <Vstack className="gap-5 px-6 py-4 text-[#84948F]">
              <Vstack className="items-start">
                <Hstack className="gap-1.5">
                  <WalletLine className="size-3.5" />

                  <Typography font="jetbrains" className="text-2xs">
                    ADDRESS
                  </Typography>
                </Hstack>

                <input
                  placeholder="Enter the address"
                  className={tv({
                    base: [
                      "text-xs font-JetBrains_Mono",
                      "bg-[#080E1B] w-full h-11 px-3",
                      "border border-[#352F2F] rounded-xl",
                      "outline-none",
                    ],
                  })()}
                  {...register("address", { required: true })}
                />
              </Vstack>

              <Vstack className="items-start">
                <Hstack className="gap-1.5">
                  <RoleLine className="size-3.5" />

                  <Typography font="jetbrains" className="text-2xs">
                    ROLE
                  </Typography>
                </Hstack>

                <Hstack>
                  <Controller
                    control={control}
                    name="role"
                    render={({ field }) => {
                      return (
                        <>
                          {Object.entries(roles).map(([role, key]) => (
                            <button
                              key={key}
                              onClick={() => setValue("role", Number(role))}
                              className={tv({
                                base: [
                                  field.value === Number(role)
                                    ? "bg-[#46F1CF]/10 border-[#46F1CF]/30 text-[#46F1CF]"
                                    : "bg-[#0D111D]/60 border-[#0D111D]",

                                  "h-10 px-5 capitalize font-medium text-xs",
                                  "border rounded-lg",
                                ],
                              })()}
                            >
                              <Typography font="jetbrains">{key}</Typography>
                            </button>
                          ))}
                        </>
                      );
                    }}
                  />
                </Hstack>
              </Vstack>
            </Vstack>

            <Center className="px-6 justify-end h-15 border-t border-[#3B4A45]">
              <button
                disabled={isSubmitting || !isValid}
                className={tv({
                  base: [
                    "flex items-center gap-2",
                    "px-5 h-9 rounded-lg",
                    "text-[#00382E] text-xs font-bold",
                    "disabled:opacity-35",
                  ],
                })()}
                style={{
                  background:
                    "linear-gradient(152deg, #46F1CF 8.13%, #00D4B4 91.87%)",
                }}
                onClick={handleSubmit(async (values) => {
                  try {
                    if (!isValidSuiAddress(values.address)) {
                      throw "Invalid address.";
                    }

                    const tx = new Transaction();

                    managementRole({
                      package: utilsSui.programs.package,
                      arguments: {
                        artifact: rootId,
                        target: values.address,
                        role: values.role,
                      },
                    })(tx);

                    await signAndExecuteTransaction({
                      transaction: tx,
                    });

                    await waitForSeconds(() => {
                      onRefetch();

                      setOpen(false);

                      toast.success("You added the role successfully.");
                    });
                  } catch (error) {
                    toast.error(JSON.stringify(error, null, 4));
                  }
                })}
              >
                {isSubmitting && <Spinner />}

                <Typography font="grotesk">CONFIRM</Typography>
              </button>
            </Center>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
