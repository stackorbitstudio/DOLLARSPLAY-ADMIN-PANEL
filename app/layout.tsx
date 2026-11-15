
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DOLLARSPLAY Admin Panel",
  description: "Private administration panel for DOLLARSPLAY",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
