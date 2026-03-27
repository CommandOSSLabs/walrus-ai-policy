import SEO from "app/components/SEO";
import Home from "app/layout/Home";
import utilsConstants from "app/utils/utils.constants";

export default () => {
  return (
    <>
      <SEO
        title={`${utilsConstants.FORMAT_SEO.title} | Research Preservation`}
      />

      <Home />
    </>
  );
};
