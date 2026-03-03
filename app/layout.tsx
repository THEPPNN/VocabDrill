import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VocabDrill — ท่องศัพท์ Oxford",
  description: "ท่องศัพท์ Oxford 3000 / 5000 พร้อมคำแปลและตัวอย่างประโยค",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
