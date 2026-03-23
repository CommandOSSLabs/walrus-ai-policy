import Flex from "app/components/Flex";
import HomeSidebar from "./HomeSidebar";
import HomeArticle from "./HomeArticle";

export default () => {
  return (
    <>
      <Flex className="gap-8 py-5 px-8">
        <HomeSidebar />

        <HomeArticle />
      </Flex>
    </>
  );
};
