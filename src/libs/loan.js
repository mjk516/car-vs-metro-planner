/**
 * 할부 계산 (원리금균등상환)
 */
export function calculateLoan(totalPrice, downPayment, termMonths, annualRate) {
  const principal = (totalPrice - downPayment) * 10000;
  const monthlyRate = annualRate / 100 / 12;

  if (monthlyRate === 0) {
    return {
      monthlyPayment: Math.round(principal / termMonths),
      totalPayment: principal,
      totalInterest: 0,
    };
  }

  const monthlyPayment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);

  const totalPayment = monthlyPayment * termMonths;
  const totalInterest = totalPayment - principal;

  return {
    monthlyPayment: Math.round(monthlyPayment),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
  };
}
