import "@/styles/globals.css";
import type { Metadata } from "next";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Cloak — Private, temporary chat",
  description: "Private two-person conversations that leave no trace.",
  icons: {
    icon: "/cloak-mark.svg",
    shortcut: "/cloak-mark.svg",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("cloak-theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}var p=localStorage.getItem("cloak-palette");if(!["ember","ocean","forest","rose","golden","mono"].includes(p)){p="ember"}document.documentElement.dataset.theme=t;document.documentElement.dataset.palette=p;document.documentElement.style.colorScheme=t}catch(e){document.documentElement.dataset.theme="dark";document.documentElement.dataset.palette="ember"}})();`,
          }}
        />
      </head>
      <body className="min-h-full bg-[var(--page)] font-[var(--font-sans)] text-[var(--text)] transition-colors duration-200">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
