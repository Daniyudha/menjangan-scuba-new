// src/app/layout.tsx
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
export const metadata = { title: "Menjangan Scuba" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="!scroll-smooth">
      <body className={`${inter.variable} bg-dark-navy`}>
        {children}
      </body>
    </html>
  );
}