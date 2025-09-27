import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "EduGradeLab - AI Destekli Sınav Analizi",
  description: "Yapay zeka ile sınav kağıtlarınızı analiz edin. Hızlı, güvenli ve profesyonel sonuçlar.",
  keywords: "sınav analizi, yapay zeka, öğretmen araçları, eğitim teknolojisi",
  authors: [{ name: "EduGradeLab Team" }],
  openGraph: {
    title: "EduGradeLab - AI Destekli Sınav Analizi",
    description: "Yapay zeka ile sınav kağıtlarınızı analiz edin",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="scroll-smooth">
      <body
        className={`${inter.variable} font-sans antialiased bg-gray-50 text-gray-900`}
      >
        <a href="#hero" className="skip-to-content">
          Ana içeriğe geç
        </a>
        <div className="relative">
          {children}
        </div>
      </body>
    </html>
  );
}
