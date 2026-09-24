import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VERITY GEAR Admin",
  description: "Bảng điều khiển quản trị VERITY GEAR.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi">
      <body className="antialiased">{children}</body>
    </html>
  );
}
