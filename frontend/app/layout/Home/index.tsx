import Flex from "app/components/Flex";
import HomeSidebar from "./HomeSidebar";
import HomeArticle from "./HomeArticle";

export default () => {
  return (
    <Flex className="container gap-5 py-5">
      <HomeSidebar />

      <HomeArticle />
    </Flex>
  );
};
