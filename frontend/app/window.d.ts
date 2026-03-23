/* vectors */
declare module "*.svg" {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

/* fonts */
declare module "@fontsource-variable/*";
