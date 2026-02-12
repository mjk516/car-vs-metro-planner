import ResultDashboard from '@/components/result/ResultDashboard';
import StepIndicator from '@/components/common/StepIndicator';
import Disclaimer from '@/components/common/Disclaimer';

export const metadata = {
  title: '분석 결과 | 차 vs 대중교통',
};

export default function ResultPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <StepIndicator currentStep={2} />

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">비용 분석 결과</h1>
        <p className="text-gray-500 mt-2">
          입력하신 정보를 기반으로 자가용과 대중교통의 비용을 분석했습니다.
        </p>
      </div>

      <ResultDashboard />
      <Disclaimer type="general" />
    </div>
  );
}
