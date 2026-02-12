import InputForm from '@/components/input/InputForm';
import StepIndicator from '@/components/common/StepIndicator';
import Disclaimer from '@/components/common/Disclaimer';

export const metadata = {
  title: '정보 입력 | 차 vs 대중교통',
};

export default function InputPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <StepIndicator currentStep={1} />

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">기본 정보를 입력해주세요</h1>
        <p className="text-gray-500 mt-2">
          정확한 분석을 위해 아래 정보를 입력해주세요. 모든 정보는 브라우저에만 저장됩니다.
        </p>
      </div>

      <InputForm />
      <Disclaimer type="general" />
    </div>
  );
}
