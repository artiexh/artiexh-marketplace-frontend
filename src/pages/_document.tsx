import { createGetInitialProps } from "@mantine/next";
import { Head, Html, Main, NextScript } from "next/document";

// For Mantine
export const getInitialProps = createGetInitialProps();

export default function Document() {
  return (
    <Html lang="en">
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
