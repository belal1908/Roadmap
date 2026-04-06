import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "RoadmapAI",
  description:
    "AI-powered dynamic learning roadmap generator with progress tracking and market demand signals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
