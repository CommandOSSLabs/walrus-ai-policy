import { useCurrentAccount } from "@mysten/dapp-kit-react";
import useUploadQuilt, {
  type uploadQuiltParametersProps,
} from "app/hook/useUploadQuilt";
import useArtifact from "app/hook/useArtifact";
import { useNavigate } from "react-router";
import Vstack from "app/components/Vstack";
import Stack from "app/components/Stack";
import Flex from "app/components/Flex";
import { Controller, useForm } from "react-hook-form";
import { tv } from "tailwind-variants";
import Spinner from "app/components/Spinner";
import Hstack from "app/components/Hstack";
import { waitForSeconds } from "app/utils";

export default () => {
  const currentAccount = useCurrentAccount();
  const navigate = useNavigate();

  const { uploadQuilt } = useUploadQuilt();
  const { createArtifact } = useArtifact();

  const {
    register,
    setValue,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<uploadQuiltParametersProps>();

  return (
    <>
      <Stack className="mt-20">
        <p>Create Artifact</p>

        <Vstack className="p-6 border border-blue-600 w-fit">
          <input
            className="w-56 p-2 border"
            placeholder="Title"
            type="text"
            {...register("title", { required: true })}
          />

          <textarea
            className="w-56 p-2 border resize-none"
            placeholder="Description"
            {...register("description", { required: true })}
          />

          <Vstack className="p-2 border border-black">
            <p>Categories</p>

            <Controller
              name="categories"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <Flex className="gap-2">
                  {["BOOK", "GOV", "POLICY"].map((meta) => {
                    const isActive = field?.value?.some(
                      (value) => value === meta,
                    );

                    return (
                      <button
                        key={meta}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        className={tv({
                          base: [
                            "p-1  text-white text-sm",

                            isActive ? "bg-blue-500" : "bg-black",
                          ],
                        })()}
                        onClick={() => {
                          if (isActive) {
                            const instance = field.value.filter(
                              (value) => value !== meta,
                            );

                            return setValue("categories", instance);
                          }

                          setValue("categories", [
                            ...(field?.value || []),
                            meta,
                          ]);
                        }}
                      >
                        {meta}
                      </button>
                    );
                  })}
                </Flex>
              )}
            />
          </Vstack>

          <Controller
            name="files"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <Vstack>
                <input
                  type="file"
                  className="file:hidden bg-black text-white p-4"
                  multiple={true}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  name={field.name}
                  onChange={({ currentTarget }) => {
                    const files = currentTarget.files;

                    if (files) {
                      setValue("files", Object.values(files));
                    }
                  }}
                />

                <Vstack className="mt-4">
                  {field?.value?.map((value) => (
                    <button
                      key={value.name + value.lastModified}
                      className="bg-black text-white"
                      onClick={() => {
                        const instance = field.value.filter(
                          (file) => file.name !== value.name,
                        );

                        setValue("files", instance);
                      }}
                    >
                      {value.name}
                    </button>
                  ))}
                </Vstack>
              </Vstack>
            )}
          />
        </Vstack>

        <button
          className="w-56 h-10 rounded-full bg-blue-500 text-white"
          disabled={isSubmitting}
          onClick={handleSubmit(async (values) => {
            if (!currentAccount?.address) return;

            const quilts = await uploadQuilt(values);

            // after created blob, you need wait seconds for available blob
            await waitForSeconds(async () => {
              const artifact = await createArtifact(
                quilts.map(({ quilt }) => quilt),
                quilts.map(({ name }) => name),
              );

              navigate(`/artifact/${artifact.id}`);
            });
          })}
        >
          <Hstack>
            {isSubmitting && <Spinner />}

            <p>Submit TX</p>
          </Hstack>
        </button>
      </Stack>
    </>
  );
};
