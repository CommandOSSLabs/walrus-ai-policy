import { Links, Meta, Outlet, Scripts } from "react-router";

import "public/css/index.css";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource-variable/space-grotesk";

import type { Route } from "./+types/root";
import Header from "./layout/Header";
import ProviderDappkit from "./layout/Provider/ProviderDappkit";
import ProviderReactQuery from "./layout/Provider/ProviderReactQuery";
import utilsConstants from "./utils/utils.constants";

export function meta({}: Route.MetaArgs) {
  return [
    {
      title: utilsConstants.FORMAT_SEO.title,
    },
    {
      name: "description",
      content: utilsConstants.FORMAT_SEO.description,
    },
  ];
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <Meta />

        <Links />
      </head>

      <body>
        {children}

        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return (
    <ProviderDappkit>
      <ProviderReactQuery>
        <Header />

        <main>
          <Outlet />
        </main>
      </ProviderReactQuery>
    </ProviderDappkit>
  );
}
