import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import "public/css/index.css";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource-variable/space-grotesk";

import Header from "./layout/Header";
import ProviderDappkit from "./layout/Provider/ProviderDappkit";
import ProviderReactQuery from "./layout/Provider/ProviderReactQuery";
import { Toaster } from "./components/ui/sonner";

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

        <ScrollRestoration />

        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              alignItems: "start",
              width: "fit-content",
            },
          }}
        />

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
