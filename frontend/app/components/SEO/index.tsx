import utilsConstants from "app/utils/utils.constants";

export default ({
  title = utilsConstants.FORMAT_SEO.title,
  description = utilsConstants.FORMAT_SEO.description,
  url = utilsConstants.FORMAT_SEO.url,
  image = utilsConstants.FORMAT_SEO.image,
}: Partial<typeof utilsConstants.FORMAT_SEO>) => {
  return (
    <>
      {/* X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Open Graph (Facebook, LinkedIn, Discord, etc.) */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={utilsConstants.FORMAT_SEO.title} />
      <meta property="og:image" content={image} />

      {/* DEFAULT */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
    </>
  );
};
