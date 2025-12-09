import "./globals.css";
import React from "react";
import Providers from "./providers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "GitHub Search",
  description: "SSR + CSR GitHub user search with rate limit handling"
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
