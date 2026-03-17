const HOME_ARTIFACTS = [...Array(10)].map((_, index) => ({
  id: index,
  image: `https://picsum.photos/280?random=${index}`,
}));

export default {
  HOME_ARTIFACTS,
};
