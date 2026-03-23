const HOME_ARTIFACTS = [...Array(10)].map((_, index) => ({
  id: index,
  image: `https://picsum.photos/280?random=${index}`,
}));

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

export default {
  HOME_ARTIFACTS,
  FORMAT_BYTES,
};
