import CreateArtifact from "app/layout/CreateArtifact";
import utilsConstants from "app/utils/utils.constants";
import type { Route } from "./+types/create-artifact";

export function meta({}: Route.MetaArgs) {
  return [
    {
      title: `${utilsConstants.FORMAT_SEO.brand} | Create Artifact`,
    },
    {
      name: "description",
      content: utilsConstants.FORMAT_SEO.description,
    },
  ];
}

export default () => {
  return <CreateArtifact />;
};
