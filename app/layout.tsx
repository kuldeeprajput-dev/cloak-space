import "@/styles/globals.css";
import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";

const siteUrl = "https://cloakspace.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Cloak — Self-Destructing Ephemeral 1-on-1 Private Messaging",
    template: "%s | Cloak",
  },
  description:
    "Speak freely. Leave no trace. Create secure, temporary 1-on-1 chat rooms with custom auto-destruction timers and zero server persistence.",
  keywords: [
    "Cloak",
    "Cloak Space",
    "private chat",
    "ephemeral chat",
    "self-destructing chat",
    "1-on-1 chat",
    "temporary messaging",
    "anonymous chat",
    "cloakspace",
    "secure messaging",
    "encrypted chat",
  ],
  authors: [{ name: "Kuldeep Rajput", url: "https://github.com/kuldeeprajput-dev" }],
  creator: "Kuldeep Rajput",
  publisher: "Cloak",
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: [
      { url: "/cloak-mark.svg", type: "image/svg+xml" },
    ],
    shortcut: "/cloak-mark.svg",
    apple: "/cloak-mark.svg",
  },
  openGraph: {
    title: "Cloak — Self-Destructing Ephemeral 1-on-1 Private Messaging",
    description:
      "Speak freely. Leave no trace. Create secure, temporary 1-on-1 chat rooms with custom auto-destruction timers and zero server persistence.",
    url: siteUrl,
    siteName: "Cloak Space",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Cloak - Self-Destructing Ephemeral Private Chat",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cloak — Self-Destructing Ephemeral 1-on-1 Private Messaging",
    description:
      "Speak freely. Leave no trace. Create secure, temporary 1-on-1 chat rooms with custom auto-destruction timers and zero server persistence.",
    images: ["/og-image.png"],
    creator: "@kuldeeprajput",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0e100f" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Cloak",
  alternateName: "Cloak Space",
  url: siteUrl,
  description:
    "Speak freely. Leave no trace. Self-destructing ephemeral 1-on-1 private messaging platform with custom timers.",
  applicationCategory: "CommunicationApplication",
  operatingSystem: "All",
  author: {
    "@type": "Person",
    name: "Kuldeep Rajput",
    url: "https://github.com/kuldeeprajput-dev",
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
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
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
