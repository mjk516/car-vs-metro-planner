/**
 * 숫자를 한국 원화 형식으로 포맷
 * @param {number} value - 원 단위 숫자
 * @returns {string} 포맷된 문자열 (예: "1,234,567원")
 */
export function formatWon(value) {
  return `${value.toLocaleString('ko-KR')}원`;
}

/**
 * 만원 단위 숫자를 포맷
 * @param {number} value - 만원 단위 숫자
 * @returns {string} 포맷된 문자열 (예: "1,234만원")
 */
export function formatManWon(value) {
  if (value >= 10000) {
    const uk = Math.floor(value / 10000);
    const remainder = value % 10000;
    if (remainder === 0) return `${uk}억원`;
    return `${uk}억 ${remainder.toLocaleString('ko-KR')}만원`;
  }
  return `${value.toLocaleString('ko-KR')}만원`;
}

/**
 * 퍼센트 포맷
 * @param {number} value - 퍼센트 값
 * @returns {string} 포맷된 문자열 (예: "25.3%")
 */
export function formatPercent(value) {
  return `${value}%`;
}

/**
 * 숫자 입력 포맷 (콤마 구분)
 * @param {string} value - 입력 문자열
 * @returns {string} 콤마 포맷된 문자열
 */
export function formatNumberInput(value) {
  const num = value.replace(/[^0-9]/g, '');
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 포맷된 문자열에서 숫자만 추출
 * @param {string} value - 포맷된 문자열
 * @returns {number} 숫자
 */
export function parseFormattedNumber(value) {
  return parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
}
