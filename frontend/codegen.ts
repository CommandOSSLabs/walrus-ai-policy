import type { CodegenConfig } from "@graphql-codegen/cli";

const options = {
  plugins: [
    "typescript",
    "typescript-operations",
    "typescript-react-query",

    // ignore error here: https://stackoverflow.com/a/76771678
    {
      add: {
        content:
          "// eslint-disable-next-line @typescript-eslint/ban-ts-comment\n// @ts-nocheck",
      },
    },
  ],
  hooks: {
    afterOneFileWrite: ["eslint . --fix", "prettier --write ."],
  },
  config: {
    fetcher: "graphql-request",
    withHooks: true,
    exposeQueryKeys: true,
    exposeFetcher: true,
    legacyMode: false,

    /* 
      maybeValue should
        from (T | null | undefined)
        to (T | undefined)

      following: https://github.com/dotansimha/graphql-code-generator/issues/3351#issuecomment-579951683
    */
    maybeValue: "T",

    // Use `unknown` instead of `any` for unconfigured scalars
    defaultScalarType: "unknown",

    // support v5: https://github.com/dotansimha/graphql-code-generator/issues/9786#issuecomment-1887641044
    reactQueryVersion: 5,

    // we actually don't need typename, for Example: __typename?: "Prompt";
    skipTypename: true,

    // support for import type {...} from "...."
    useTypeImports: true,
  },
};

const codegen: CodegenConfig = {
  generates: {
    "./app/services/graphql-sui/generated.ts": {
      schema: "https://graphql.testnet.sui.io/graphql",
      documents: "./app/services/graphql-sui/**/*.ts",
      plugins: options.plugins,
      hooks: options.hooks,
      config: {
        ...options.config,
        typesPrefix: "Sui",
        scalars: {
          BigInt: "string",
          DateTime: "string",
          Base64: "string",
          UInt53: "number",
          SuiAddress: "string",
        },
      },
    },

    "./app/services/graphql-app/generated.ts": {
      schema: "https://wal-archive-graphql-app-develop.up.railway.app/graphql",
      documents: "./app/services/graphql-app/**/*.ts",
      plugins: options.plugins,
      hooks: options.hooks,
      config: options.config,
    },
  },
};

export default codegen;
