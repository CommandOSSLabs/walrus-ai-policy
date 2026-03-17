import { Links, Meta, Outlet, Scripts } from "react-router";

import "public/css/index.css";
import { DAppKitProvider } from "@mysten/dapp-kit-react";
import utilsDappKit from "./utils/utils.dapp-kit";
import type { Route } from "./+types/root";
import Header from "./layout/Header";

export function meta({}: Route.MetaArgs) {
  return [
    {
      title: "Walrus AI Policy",
    },
    {
      name: "description",
      content: "Welcome to Walrus Policy",
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
    <DAppKitProvider dAppKit={utilsDappKit.dAppKit}>
      <Header />

      <main>
        <Outlet />
      </main>
    </DAppKitProvider>
  );
}
