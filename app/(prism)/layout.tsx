import type { Metadata } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import "./prism.css";
import SmoothScroll from "@/components/providers/SmoothScroll";

const manrope = Manrope({
  variable: "--font-prism-sans",
  subsets: ["latin"],
  display: "swap",
});

const instrument = Instrument_Serif({
  variable: "--font-prism-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://danumai.com"),
  title: {
    default: "Cinematic Prism — Stories in every color of light",
    template: "%s — Cinematic Prism",
  },
  description:
    "Cinematic Prism is a premium entertainment studio crafting films, series, and worlds — where cinematic light meets enterprise-grade craft.",
  openGraph: {
    title: "Cinematic Prism — Stories in every color of light",
    description:
      "A premium entertainment studio crafting films, series, and worlds in every color of light.",
    type: "website",
  },
};

export default function PrismLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${instrument.variable} antialiased`}
    >
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
