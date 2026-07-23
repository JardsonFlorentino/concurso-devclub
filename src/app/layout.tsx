import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Header } from "@/components/Header";
import { CustomCursor } from "@/components/CustomCursor";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DevClub — A escola das profissões do futuro",
  description:
    "Do zero à contratação: formações em programação com método, projeto real e comunidade.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // data-theme já vem no HTML do servidor para não haver flash de cor na hidratação.
    <html
      lang="pt-BR"
      data-theme="devclub"
      className={inter.variable}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground">
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.setAttribute('data-intro','pending')}}catch(e){}`,
          }}
        />
        <CustomCursor />
        <Header />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
