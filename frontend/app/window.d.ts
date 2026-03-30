/* vectors */
declare module "*.svg" {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

/* fonts */
declare module "@fontsource-variable/*";

/* third-party */
declare module "react-csv-to-table" {
  import type { ComponentType } from "react";

  export interface CsvToHtmlTableProps {
    data: string;
    csvDelimiter?: string;
    hasHeader?: boolean;
    tableClassName?: string;
    tableRowClassName?: string;
    tableColumnClassName?: string;
  }

  export const CsvToHtmlTable: ComponentType<CsvToHtmlTableProps>;
}

/* vite */
interface ImportMeta {
  readonly env: {
    readonly VITE_GRAPHQL_URL: string;
    readonly VITE_ARCHIVE_PACKAGE_ID: string;
  };
}
