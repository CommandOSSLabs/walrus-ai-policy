import Stack from "app/components/Stack";
import Vstack from "app/components/Vstack";
import utilsConstants from "app/utils/utils.constants";
import { Link } from "react-router";

export default () => {
  return (
    <>
      <p>Home</p>

      <Vstack className="mt-4 p-4 border border-red-500 w-fit">
        {utilsConstants.HOME_ARTIFACTS.map((meta) => (
          <Link
            key={meta.id}
            to={`/artifact/${meta.id}`}
            className="bg-black text-white"
          >
            <Stack className="p-2">
              <p>Blob Id {meta.id}</p>

              <img
                src={meta.image}
                alt={`Artifact image for ${meta.id}`}
                className="size-10"
              />
            </Stack>
          </Link>
        ))}
      </Vstack>
    </>
  );
};
