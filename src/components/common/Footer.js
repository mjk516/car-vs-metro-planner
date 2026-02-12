import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="font-semibold text-foreground">차 vs 대중교통 금융 의사결정 서비스</p>
            <p className="text-sm text-gray-500 mt-1">
              합리적인 교통수단 선택을 위한 종합 비용 분석
            </p>
          </div>
          <div className="flex gap-4 text-sm text-gray-500">
            <Link href="/input" className="hover:text-primary transition-colors">
              분석 시작
            </Link>
            <span className="text-gray-300">|</span>
            <span>면책조항: 본 서비스는 참고용이며 투자 권유가 아닙니다</span>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-400">
          &copy; 2025 Car vs Transport Analyzer. 본 서비스의 모든 데이터는 참고용입니다.
        </div>
      </div>
    </footer>
  );
}
