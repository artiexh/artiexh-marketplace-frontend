"use client";

import AuthGuard from "@/services/guards/AuthGuard";
import "@/styles/globals.css";
import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Nunito } from "next/font/google";
import Head from "next/head";

const queryClient = new QueryClient();

const nunito = Nunito({
  subsets: ["latin", "vietnamese"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <QueryClientProvider client={queryClient}>
        <AuthGuard />
        <body>
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
              breakpoints: {
                sm: "640px",
                md: "768px",
                lg: "1024px",
                xl: "1280px",
                "2xl": "1536px",
              },
              colorScheme: "light",
              fontFamily: nunito.style.fontFamily,
              // Generate here https://omatsuri.app/color-shades-generator
              colors: {
                customPrimary: [
                  "#EBDEF7",
                  "#C4A0E7",
                  "#A56CD9",
                  "#8A41CE",
                  "#732EB4",
                  "#602696",
                  "#50207D",
                  "#401A64",
                  "#331450",
                  "#291040",
                ],
                customSecondary: [
                  "#F9F5FC",
                  "#D7C3E9",
                  "#BA98DA",
                  "#A172CC",
                  "#8C52C1",
                  "#793FAE",
                  "#683696",
                  "#572D7E",
                  "#49266A",
                  "#3E2059",
                ],
              },
              // index of shade
              primaryShade: 6,
              // DO NOT REFERENCE HEX DIRECTLY, ONLY COLORS FROM theme.colors
              primaryColor: "customPrimary",
              defaultGradient: {
                deg: 135,
                from: "customPrimary",
                to: "customSecondary",
              },
              defaultRadius: "8px",
            }}
          >
            <style jsx global>
              {`
                html {
                  font-family: ${nunito.style.fontFamily};
                }
              `}
            </style>
            <Head>
              <meta
                name="viewport"
                content="minimum-scale=1, initial-scale=1, width=device-width"
              />
            </Head>
            {children}
          </MantineProvider>
        </body>
      </QueryClientProvider>
    </html>
  );
}
