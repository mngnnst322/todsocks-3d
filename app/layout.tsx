import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TODSOCKS — 2011 оноос Монголын дулаан",
  description: "Монгол ноосоор хийсэн оймс. Хонины сүргээс таны хөл хүртэлх аялал.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn">
      <body>{children}</body>
    </html>
  );
}
