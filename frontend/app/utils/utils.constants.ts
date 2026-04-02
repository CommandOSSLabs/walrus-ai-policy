import BannerPNG from "public/banner.png";

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
    key: "AI Safety",
    type: "red" as const,
  },
  {
    key: "Technical Standards",
    type: "cyan" as const,
  },
  {
    key: "Policy & Regulation",
    type: "gold" as const,
  },
  {
    key: "Governance & Ethics",
    type: "orange" as const,
  },
  {
    key: "Research & Data",
    type: "green" as const,
  },
];

const FORMAT_SEO = {
  title: "WalArchive",
  description: `WalArchive preserves AI governance research and policy artifacts with immutable content storage and on-chain metadata. Prevent link rot, ensure reproducibility, and verify provenance for every contribution.`,
  url: "https://wal-archive-develop.up.railway.app",
  image: BannerPNG,
};

const MAX_ARTIFACT_CARD = 9;

export default {
  FORMAT_BYTES,
  FORMAT_RESOURCE,
  FORMAT_SEO,

  MAX_ARTIFACT_CARD,
};
