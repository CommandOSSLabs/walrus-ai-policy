const FORMAT_BYTES = [
  {
    key: "B",
    times: 1024 ** 0,
  },
  {
    key: "KB",
    times: 1024 ** 1,
  },
  {
    key: "MB",
    times: 1024 ** 2,
  },
  {
    key: "GB",
    times: 1024 ** 3,
  },
  {
    key: "TB",
    times: 1024 ** 4,
  },
];

const FORMAT_RESOURCE = [
  {
    key: "LAW Crimson",
    type: "red" as const,
  },
  {
    key: "Software Cyan",
    type: "cyan" as const,
  },
  {
    key: "Economy Gold",
    type: "gold" as const,
  },
];

const FORMAT_SEO = {
  brand: "WalArchive",
  description: `WalArchive preserves AI governance research and policy artifacts with immutable content storage and on-chain metadata. Prevent link rot, ensure reproducibility, and verify provenance for every contribution.`,
};

const MAX_ARTIFACT_CARD = 9;

export default {
  FORMAT_BYTES,
  FORMAT_RESOURCE,
  FORMAT_SEO,

  MAX_ARTIFACT_CARD,
};
