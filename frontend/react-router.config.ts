import type { Config } from "@react-router/dev/config";
import utilsConstants from "app/utils/utils.constants";

export default {
  ssr: false,

  async prerender({ getStaticPaths }) {
    // get all routes static, not includes /:id
    const route_static = getStaticPaths();

    return [
      ...route_static,

      ...utilsConstants.HOME_ARTIFACTS.map((meta) => `/artifact/${meta.id}`),
    ];
  },
} satisfies Config;
