import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "차 vs 대중교통 | 금융 의사결정 서비스",
  description: "연봉과 자산 기반으로 자가용과 대중교통 중 최적의 선택을 분석하고, 맞춤형 차량 구매 또는 투자 전략을 추천합니다.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} antialiased min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
