import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* Hero Section */}
      <section className="py-16 text-center">
        <div className="inline-block bg-blue-100 text-primary text-sm font-medium px-3 py-1 rounded-full mb-4">
          금융 의사결정 서비스
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
          자가용 vs 대중교통
          <br />
          <span className="text-primary">어떤 선택이 현명할까?</span>
        </h1>
        <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          연봉과 보유 자산을 기반으로 총비용을 비교하고,
          <br className="hidden md:block" />
          감가상각과 손익분기점까지 분석하여 최적의 선택을 추천합니다.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/input"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-blue-200"
          >
            무료 분석 시작하기
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <h2 className="text-2xl font-bold text-center mb-10">
          이런 분석을 제공합니다
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            }
            title="총비용 비교"
            description="자가용의 감가상각, 유류비, 보험료, 자동차세와 대중교통 정기권, 택시비를 정밀 비교합니다."
            color="blue"
          />
          <FeatureCard
            icon={
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            }
            title="손익분기점 분석"
            description="10년간 누적 비용을 시각화하여 어느 시점에서 비용이 역전되는지 정확히 보여줍니다."
            color="green"
          />
          <FeatureCard
            icon={
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="맞춤 추천"
            description="자가용이 유리하면 예산별 차량을 추천하고, 대중교통이면 투자 전략과 종목을 제안합니다."
            color="amber"
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12">
        <h2 className="text-2xl font-bold text-center mb-10">이용 방법</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <StepCard step={1} title="정보 입력" description="연봉, 보유 자산, 통근 거리 등 기본 정보를 입력합니다." />
          <StepCard step={2} title="비용 분석" description="자가용과 대중교통의 총비용, 손익분기점을 분석합니다." />
          <StepCard step={3} title="맞춤 추천" description="분석 결과에 따라 차량 구매 또는 투자 전략을 추천합니다." />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-10 text-white">
          <h2 className="text-2xl md:text-3xl font-bold">
            나에게 맞는 교통수단, 지금 확인하세요
          </h2>
          <p className="mt-3 text-blue-100 max-w-xl mx-auto">
            30초만 투자하면 연간 수백만원의 차이를 만드는 현명한 선택을 할 수 있습니다.
          </p>
          <Link
            href="/input"
            className="inline-flex items-center mt-6 px-8 py-4 bg-white text-primary font-semibold rounded-xl hover:bg-blue-50 transition-colors"
          >
            분석 시작하기
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-border hover:shadow-lg transition-shadow">
      <div className={`w-12 h-12 rounded-xl ${colorMap[color]} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ step, title, description }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
        {step}
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  );
}
