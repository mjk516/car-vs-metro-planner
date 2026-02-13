import { CAR_CATEGORIES } from '@/data/car-data';
import { parseFormattedNumber } from '@/utils/format';
import InputField from './InputField';

export default function CarPriceSection({ form, errors, onChange, setFieldRef }) {
  const selectCarPrice = (price) => {
    onChange('carPrice', price.toString());
  };

  return (
    <div className="bg-white rounded-2xl border border-border p-6">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <span className="w-7 h-7 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center text-sm font-bold">3</span>
        희망 차량 가격대
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {CAR_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => selectCarPrice(Math.round((cat.minPrice + cat.maxPrice) / 2))}
            className={`p-3 rounded-xl border text-left transition-colors ${
              parseFormattedNumber(form.carPrice) >= cat.minPrice &&
              parseFormattedNumber(form.carPrice) <= cat.maxPrice
                ? 'border-primary bg-blue-50'
                : 'border-gray-200 hover:border-primary'
            }`}
          >
            <p className="text-sm font-semibold">{cat.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{cat.priceRange}</p>
          </button>
        ))}
      </div>
      <InputField
        label="희망 차량 가격 (직접 입력)"
        unit="만원"
        placeholder="예: 3,000"
        value={form.carPrice}
        onChange={(v) => onChange('carPrice', v)}
        error={errors.carPrice}
        hint="비교 분석에 사용될 차량 가격"
        ref={(el) => setFieldRef('carPrice', el)}
      />
    </div>
  );
}