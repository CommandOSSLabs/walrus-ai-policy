import CreateArtifact from "app/layout/CreateArtifact";
import utilsConstants from "app/utils/utils.constants";
import SEO from "app/components/SEO";

export default () => {
  return (
    <>
      <SEO title={`${utilsConstants.FORMAT_SEO.title} | Create Artifact`} />

      <CreateArtifact />
    </>
  );
};
