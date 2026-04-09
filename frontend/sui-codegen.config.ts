import type { SuiCodegenConfig } from "@mysten/codegen";

const config: SuiCodegenConfig = {
  output: "app/services/sui-codegen",
  generateSummaries: true,
  prune: true,
  generate: {
    types: false,
  },
  packages: [
    {
      package: "@local-pkg/walarchive",
      path: "../contract",
    },
  ],
};

export default config;
