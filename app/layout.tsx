import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Restaurant Monthly Turnover Analyzer",
  description: "Smart Dashboard for Sales, Expenses & Business Growth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="h-full">
        <Script id="restore-theme" strategy="beforeInteractive">
          {`
            (function () {
              try {
                var savedTheme = localStorage.getItem("restaurant-theme");
                document.documentElement.classList.toggle(
                  "dark",
                  savedTheme === "dark"
                );
              } catch (e) {}
            })();
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}