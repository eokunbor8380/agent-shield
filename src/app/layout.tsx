import type { Metadata } from "next";
import "./globals.css";

const appUrl = process.env.APP_BASE_URL ?? "https://agent-shield-sigma.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "AgentShield | AI Agent Security Control Plane",
    template: "%s | AgentShield",
  },
  description:
    "AgentShield discovers, governs, scores, and protects enterprise AI agents and non-human identities.",
  applicationName: "AgentShield",
  keywords: ["AI agent security", "non-human identity", "agent governance", "runtime authorization", "cyber risk"],
  authors: [{ name: "AgentShield" }],
  creator: "AgentShield",
  icons: {
    icon: "/agent-shield-logo.svg",
    shortcut: "/agent-shield-logo.svg",
    apple: "/agent-shield-logo.svg",
  },
  openGraph: {
    title: "AgentShield | AI Agent Security Control Plane",
    description: "Discover, govern, score, and protect enterprise AI agents and non-human identities.",
    url: appUrl,
    siteName: "AgentShield",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgentShield | AI Agent Security Control Plane",
    description: "Discover, govern, score, and protect enterprise AI agents and non-human identities.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
